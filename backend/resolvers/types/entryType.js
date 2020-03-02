import { UserError } from 'graphql-errors'

import Show from '../../models/show'
import Vote from '../../models/vote'
import {
  IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY,
  ADMIN, JUDGE
} from '../../constants'
import SinglePiece from '../../models/singlePiece'

// For Convenience: the 'base class' of functions for Photo / Video / OtherMedia
// entry type fields, which they share.
export const EntryBase = {
  group (entry) {
    return entry.getGroup()
  },
  student (entry) {
    return entry.getStudent()
  },
  score (entry) {
    return entry.getScore()
  },
  show (entry) {
    return Show.findById(entry.showId)
  },
  votes (entry, _, req) {
    switch (req.auth.type) {
      case ADMIN:
        // Admins see all votes
        return Vote.findAll({where: {entryId: entry.id}})
      case JUDGE:
        // Judges see only their own votes
        return Vote.findAll({where: {entryId: entry.id, judgeUsername: req.auth.username}})
      default:
        // Students cannot access this
        throw new UserError('Students cannot access entry votes')
    }
  },
  // Returning entry type directly on the base class, for convenience
  entryType (entry) {
    return entry.getSinglePiece().then(piece => {
      if (piece.pieceType === IMAGE_ENTRY) {
        return 'PHOTO'
      } else if (piece.pieceType === VIDEO_ENTRY) {
        return 'VIDEO'
      } else if (piece.pieceType === OTHER_ENTRY) {
        return 'OTHER'
      }
    })
  }
}

export default {
  Entry: {
    __resolveType (data, context, info) {
      return SinglePiece.findOne({where: {id: data.pieceId}}).then(piece => {
        // Identifies for GraphQL which concrete instance of Entry this object is.
        if (piece.pieceType === IMAGE_ENTRY) {
          return info.schema.getType('Photo')
        } else if (piece.pieceType === VIDEO_ENTRY) {
          return info.schema.getType('Video')
        } else if (piece.pieceType === OTHER_ENTRY) {
          return info.schema.getType('OtherMedia')
        }
        throw new Error("Unknown piece type")
      })
    }
  }
}
