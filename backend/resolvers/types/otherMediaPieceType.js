import { PieceBase } from './pieceType'

export default {
  OtherMediaPiece: {
    ...PieceBase,
    title (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.title)
    },
    comment (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.comment)
    },
    path (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getOther().then(other => other.path))
    }
  }
}
