import { EntryBase } from './entryType'

export default {
  OtherMedia: {
    ...EntryBase,
    path (entry) {
      return entry.getSinglePiece().getOther().then(other => other.path)
    }
  }
}
