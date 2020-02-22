import { EntryBase } from './entryType'

export default {
  Video: {
    ...EntryBase,
    provider (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getVideo().then(video => video.provider))
    },
    videoId (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getVideo().then(video => video.videoId))
    }
  }
}
