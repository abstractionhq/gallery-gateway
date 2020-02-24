import { PieceBase } from './pieceType'

export default {
  VideoPiece: {
    ...PieceBase,
    title (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.title)
    },
    comment (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.comment)
    },
    provider (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getVideo().then(video => video.provider))
    },
    videoId (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getVideo().then(video => video.videoId))
    }
  }
}
