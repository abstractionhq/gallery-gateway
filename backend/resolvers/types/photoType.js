import { EntryBase } from './entryType'

export default {
  Photo: {
    ...EntryBase,
    path (_, __, context) {
      return context.image.then(image => image.path)
    },
    horizDimInch (_, __, context) {
      return context.image.then(image => image.horizDimInch)
    },
    vertDimInch (_, __, context) {
      return context.image.then(image => image.vertDimInch)
    },
    mediaType (_, __, context) {
      return context.image.then(image => image.mediaType)
    }
  }
}
