import { PieceBase } from './pieceType'

export default {
  OtherMediaPiece: {
    ...PieceBase,
    path (piece) {
      return piece.getSinglePiece().getOther().then(other => other.path)
    }
  }
}
