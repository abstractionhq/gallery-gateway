import { EntryBase } from './entryType'

export default {
  Photo: {
    ...EntryBase,
    path (entry) {
      return entry.getSinglePiece().getImage().then(image => image.path)
    },
    horizDimInch (entry) {
      return entry.getSinglePiece().getImage().then(image => image.horizDimInch)
    },
    vertDimInch (entry) {
      return entry.getSinglePiece().getImage().then(image => image.vertDimInch)
    },
    mediaType (entry) {
      return entry.getSinglePiece().getImage().then(image => image.mediaType)
    }
  }
}
