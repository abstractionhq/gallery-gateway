import { PieceBase } from './pieceType'

export default {
  OtherMediaPiece: {
    ...PieceBase,
    path (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getOther().then(other => other.path))
    }
  }
}
