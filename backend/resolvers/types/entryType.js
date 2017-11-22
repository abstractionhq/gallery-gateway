import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../../constants'

export default {
  Entry: {
    __resolveType (data, context, info) {
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
