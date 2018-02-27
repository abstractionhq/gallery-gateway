import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../../constants'

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
  // Returning entry type directly on the base class, for convenience
  entryType (entry) {
    if (entry.entryType === IMAGE_ENTRY) {
      return 'PHOTO'
    } else if (entry.entryType === VIDEO_ENTRY) {
      return 'VIDEO'
    } else if (entry.entryType === OTHER_ENTRY) {
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
