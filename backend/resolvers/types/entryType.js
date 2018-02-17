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
  }
}

export default {
  Entry: {
    __resolveType (data, context, info) {
      // Identifies for GraphQL which concrete instance of Entry this object is.
      // Here we also prefetch the associated photo/video/other object so that
      // their specific type resolvers can pull out those properties
      if (data.entryType === IMAGE_ENTRY) {
        context.image = data.getImage()
        return info.schema.getType('Photo')
      } else if (data.entryType === VIDEO_ENTRY) {
        context.video = data.getVideo()
        return info.schema.getType('Video')
      } else if (data.entryType === OTHER_ENTRY) {
        context.other = data.getOther()
        return info.schema.getType('OtherMedia')
      }
      throw new Error('Unknown entry type')
    }
  }
}
