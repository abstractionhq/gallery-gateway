import { EntryBase } from './entryType'

export default {
  Video: {
    ...EntryBase,
    provider (entry) {
      return entry.getVideo().then(video => video.provider)
    },
    videoId (entry) {
      return entry.getVideo().then(video => video.videoId)
    }
  }
}
