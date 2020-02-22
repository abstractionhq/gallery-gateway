import { PieceBase } from './pieceType'

export default {
  VideoPiece: {
    ...PieceBase,
    provider (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getVideo().then(video => video.provider))
    },
    videoId (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getVideo().then(video => video.videoId))
    }
  }
}
