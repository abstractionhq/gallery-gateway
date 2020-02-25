import { PieceBase } from './pieceType'

export default {
  VideoPiece: {
    ...PieceBase,
    provider (piece) {
      return piece.getVideo().then(video => video.provider)
    },
    videoId (piece) {
      return piece.getVideo().then(video => video.videoId)
    }
  }
}
