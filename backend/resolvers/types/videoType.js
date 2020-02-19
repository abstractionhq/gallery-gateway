import { EntryBase } from './entryType'

export default {
  Video: {
    ...EntryBase,
    provider (entry) {
      return entry.getSinglePiece().getVideo().then(video => video.provider)
    },
    videoId (entry) {
      return entry.getSinglePiece().getVideo().then(video => video.videoId)
    }
  }
}
