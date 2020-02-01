import { PieceBase } from './pieceType'

export default {
  OtherMediaPiece: {
    ...PieceBase,
    path (piece) {
      return piece.getOther().then(other => other.path)
    }
  }
}
