import { EntryBase } from './entryType'

export default {
  Video: {
    ...EntryBase,
    title (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.title)
    },
    comment (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.comment)
    },
    provider (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getVideo().then(video => video.provider))
    },
    videoId (entry) {
      return entry.getSinglePiece().then(singlePiece => singlePiece.getVideo().then(video => video.videoId))
    }
  }
}
