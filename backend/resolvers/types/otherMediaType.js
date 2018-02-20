import { EntryBase } from './entryType'

export default {
  OtherMedia: {
    ...EntryBase,
    path (entry) {
      return entry.getOther().then(other => other.path)
    }
  }
}
