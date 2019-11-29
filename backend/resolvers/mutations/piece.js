import db from "../../config/sequelize";
import { Op } from "sequelize";
import moment from "moment";
import { UserError } from "graphql-errors";
import Image from "../../models/image";
import Video from "../../models/video";
import Other from "../../models/other";
import { ADMIN, IMAGE_ENTRY, OTHER_ENTRY, VIDEO_ENTRY } from "../../constants";
import { allowedToSubmit, parseVideo } from "../../helpers/submission";
import Portfolio from "../../models/portfolio";
import PortfolioPeriod from "../../models/portfolioPeriod";
import Piece from "../../models/piece";

// Creates an Piece based on the 'PieceInput' schema
const createPiece = (piece, entryType, pieceId, t) => {
  let existingId = piece.portfolioId;
  let portolioPromise =
    existingId === null ? Promise.resolve(existingId) : createNewPortfolio(piece, t);
  return portolioPromise.then(portfolioId=> {
    delete piece['studentUsername']
    delete piece['yearLevel']
    delete piece['academicProgram']
    return Piece.create({
      ...piece,
      pieceType: entryType,
      pieceId,
      portfolioId
    }, {transaction: t})
  })
};

const createNewPortfolio = (
  { studentUsername, yearLevel, academicProgram },
  t
) => {
  const now = new Date();
  // find if there's an open period
  return PortfolioPeriod.find(
    {
      where: {
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
        throw new UserError("There is not an open Portfolio Period");
      }
      // Make new portfolio
      return Portfolio.create(
        {
          portfolioPeriodId: period.id,
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
      piece: { portfolioId }
    }
  },
  t
) => {
  return portfolioId
    ? Portfolio.findById(portfolioId, {
        transaction: t,
        rejectOnEmpty: true
      }).then(portfolio => {
        PortfolioPeriod.findById(portfolio.portfolioPeriodId, {
          transaction: t
        }).then(portfolioPeriod => {
          if (moment().isBefore(moment(portfolioPeriod.entryEnd))) {
            return Promise.resolve();
          } else {
            throw new UserError("Submission deadline has ended");
          }
        });
      })
    : Promise.resolve();
};

export function createPhoto(_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError("Permission Denied");
  }
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

export function createVideo(_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError("Permission Denied");
  }
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

export function createOtherMedia(_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError("Permission Denied");
  }
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
