import { EntryBase } from './entryType'

export default {
  OtherMedia: {
    ...EntryBase,
    title (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.title)
    },
    comment (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.comment)
    },
    path (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getOther().then(other => other.path))
    }
  }
}
