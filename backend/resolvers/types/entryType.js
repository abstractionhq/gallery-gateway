import { UserError } from 'graphql-errors'

import Show from '../../models/show'
import Vote from '../../models/vote'
import {
  IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY,
  ADMIN, JUDGE
} from '../../constants'

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
    if (entry.getSinglePiece().entryType === IMAGE_ENTRY) {
      return 'PHOTO'
    } else if (entry.getSinglePiece().entryType === VIDEO_ENTRY) {
      return 'VIDEO'
    } else if (entry.getSinglePiece().entryType === OTHER_ENTRY) {
      return 'OTHER'
    }
  }
}

export default {
  Entry: {
    __resolveType (data, context, info) {
      // Identifies for GraphQL which concrete instance of Entry this object is.
      if (data.entryType === IMAGE_ENTRY) {
        return info.schema.getType('Photo')
      } else if (data.entryType === VIDEO_ENTRY) {
        return info.schema.getType('Video')
      } else if (data.entryType === OTHER_ENTRY) {
        return info.schema.getType('OtherMedia')
      }
      throw new Error('Unknown entry type')
    }
  }
}
