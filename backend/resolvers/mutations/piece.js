import db from "../../config/sequelize";
import moment from "moment";
import { UserError } from "graphql-errors";
import Image from "../../models/image";
import Video from "../../models/video";
import Other from "../../models/other";
import Group from "../../models/group";
import Show from "../../models/show";
import User from "../../models/user";
import { ADMIN, IMAGE_ENTRY, OTHER_ENTRY, VIDEO_ENTRY } from "../../constants";
import { allowedToSubmit, parseVideo } from "../../helpers/submission";
import Portfolio from "../../models/portfolio";
import PortfolioPeriod from "../../models/portfolioPeriod";

// Creates an Piece based on the 'PieceInput' schema
const createPiece = (piece, entryType, pieceId, t) => {
  return groupPromise
    .then(group => {
      // We now have access to a Group instance (from attributes above).
      // The only thing left to do is create the Entry object, which is (mostly)
      // described by the `entry` parameter. We must first remove its `group`
      // property and replace it with the group's ID, since our orm recognizes
      // groupId, not a Group

      let userFindPromise = Promise.resolve(null);
      if (entry.studentUsername) {
        userFindPromise = User.findById(entry.studentUsername);
      }

      // clone the object
      let newEntry = Object.assign({}, entry);
      // remove the 'group' property
      delete newEntry["group"];
      // create the new Entry with select properties filled-in
      return userFindPromise.then(user => {
        let userUpdatePromise = Promise.resolve(null);
        if (user.hometown != entry.hometown) {
          userUpdatePromise = User.update(
            {
              hometown: entry.hometown
            },
            { where: { username: entry.studentUsername } }
          );
        }

        delete newEntry["hometown"];
        return userUpdatePromise.then(() =>
          Entry.create(
            {
              ...newEntry,
              entryType: entryType,
              entryId: entryId,
              groupId: group ? group.id : null
            },
            { transaction: t }
          )
        );
      });
    })
    .then(() => Show.findById(entry.showId));
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
        PortfolioPeriod.findById(portfolio.portfolioPeriodId, {transaction: t}).then(
          portfolioPeriod => {
            if (moment().isBefore(moment(portfolioPeriod.entryEnd))) {
              return Promise.resolve();
            } else {
              throw new UserError("Submission deadline has ended");
            }
          }
        );
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
