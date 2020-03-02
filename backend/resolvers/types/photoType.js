import { EntryBase } from './entryType'

export default {
  Photo: {
    ...EntryBase,
    title (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.title)
    },
    comment (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.comment)
    },
    path (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getImage().then(image => image.path))
    },
    horizDimInch (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getImage().then(image => image.horizDimInch))
    },
    vertDimInch (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getImage().then(image => image.vertDimInch))
    },
    mediaType (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getImage().then(image => image.mediaType))
    }
  }
}
