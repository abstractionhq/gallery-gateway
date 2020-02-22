import { EntryBase } from './entryType'

export default {
  OtherMedia: {
    ...EntryBase,
    path (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getOther().then(other => other.path))
    }
  }
}
