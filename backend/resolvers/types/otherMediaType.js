import { EntryBase } from './entryType'

export default {
  OtherMedia: {
    ...EntryBase,
    path (_, __, context) {
      return context.other.then(other => other.path)
    }
  }
}
