import db from "../../config/sequelize";
import { Op } from "sequelize";
import moment from "moment";
import { UserError } from "graphql-errors";
import Image from "../../models/image";
import Video from "../../models/video";
import Other from "../../models/other";
import {
  ADMIN,
  IMAGE_ENTRY,
  OTHER_ENTRY,
  VIDEO_ENTRY,
  STUDENT,
  JUDGE
} from "../../constants";
import { allowedToSubmit, parseVideo } from "../../helpers/submission";
import Portfolio from "../../models/portfolio";
import PortfolioPeriod from "../../models/portfolioPeriod";
import Piece from "../../models/piece";
import SinglePiece from "../../models/singlePiece"

// Creates a Piece based on the 'PieceInput' schema
const createPiece = (piece, entryType, entryId, t) => {
  let existingId = piece.portfolioId;
  let portolioPromise =
    existingId !== null
      ? Promise.resolve(existingId)
      : createNewPortfolio(piece, t);

  const piecePromise = SinglePiece.create({
    pieceType: entryType,
    pieceId: entryId,
    title: piece.title,
    comment: piece.comment
  })

  return Promise.all([portolioPromise, piecePromise])
    .then(values => {
      const portfolioId = values[0]
      const singlePiece = values[1]
      return Piece.create(
        {
          pieceId: singlePiece.id,
          portfolioId
        },
        { transaction: t }
      );
    })
    .then(newPiece => Portfolio.findById(newPiece.portfolioId));
};

const createNewPortfolio = (
  { studentUsername, yearLevel, academicProgram, periodId },
  t
) => {
  const now = new Date();
  // find if there's an open period
  return PortfolioPeriod.find(
    {
      where: {
        id: periodId,
        entryEnd: {
          [Op.gt]: now
        },
        entryStart: {
          [Op.lt]: now
        }
      }
    },
    { transaction: t }
  )
    .then(period => {
      if (!period) {
        throw new UserError("This Portfolio Period is not open.");
      }
      // Make new portfolio
      return Portfolio.create(
        {
          portfolioPeriodId: periodId,
          studentUsername,
          yearLevel,
          academicProgram,
          submitted: false
        },
        { transaction: t }
      );
    })
    .then(portfolio => portfolio.id); // return the id
};

const isSubmissionEntryOpen = (
  {
    input: {
      piece: { periodId }
    }
  },
  t
) => {
  if (!periodId) {
    throw new UserError("Submission not associated with Portfolio Period");
  }
  return PortfolioPeriod.findById(periodId, {
    transaction: t
  }).then(portfolioPeriod => {
    if (moment().isBefore(moment(portfolioPeriod.entryEnd))) {
      return Promise.resolve();
    } else {
      throw new UserError("Submission deadline has ended");
    }
  });
};

export function createPortfolioPhoto(_, args, req) {
  return db.transaction(t =>
    isSubmissionEntryOpen(args, t).then(() =>
      Image.create(
        {
          path: args.input.path,
          horizDimInch: args.input.horizDimInch,
          vertDimInch: args.input.vertDimInch,
          mediaType: args.input.mediaType
        },
        { transaction: t }
      ).then(image => createPiece(args.input.piece, IMAGE_ENTRY, image.id, t))
    )
  );
}

export function createPortfolioVideo(_, args, req) {
  const { type, id } = parseVideo(args.input.url);
  if (!type || !id) {
    throw new UserError(
      "The video URL must be a valid URL from Youtube or Vimeo"
    );
  }
  return db.transaction(t =>
    isSubmissionEntryOpen(args, t).then(() =>
      Video.create(
        {
          provider: type,
          videoId: id
        },
        { transaction: t }
      ).then(video => createPiece(args.input.piece, VIDEO_ENTRY, video.id, t))
    )
  );
}

export function createPortfolioOtherMedia(_, args, req) {
  return db.transaction(t =>
    isSubmissionEntryOpen(args, t).then(() =>
      Other.create(
        {
          path: args.input.path
        },
        { transaction: t }
      ).then(other => createPiece(args.input.piece, OTHER_ENTRY, other.id, t))
    )
  );
}

export function deletePiece(_, args, req) {
  const pieceId = args.id;

  return Piece.findById(pieceId).then(piece => {
    return piece
      .getOwner()
      .then(ownerUsername => {
        if (
          // Students can only delete their own
          (req.auth.type === STUDENT && req.auth.username !== ownerUsername) ||
          req.auth.type === JUDGE // Judges can never delete pieces
        ) {
          throw new UserError("Permission Denied");
        }
      })
      .then(() =>
        piece.getSinglePiece()).then( singlePiece =>
        db.transaction(transaction =>
          singlePiece
            .getMedia(transaction)
            .then(media => media.destroy({ transaction }))
            .then(() => piece.destroy({ transaction }))
            .then(() => singlePiece.destroy({ transaction }))
        )
      );
  });
}

