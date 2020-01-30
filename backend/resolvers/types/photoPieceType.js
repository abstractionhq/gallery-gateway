import { PieceBase } from './pieceType'

export default {
  PhotoPiece: {
    ...PieceBase,
    path (piece) {
      debugger;
      return piece.getImage().then(image => image.path)
    },
    horizDimInch (piece) {
      return piece.getImage().then(image => image.horizDimInch)
    },
    vertDimInch (piece) {
      return piece.getImage().then(image => image.vertDimInch)
    },
    mediaType (piece) {
      return piece.getImage().then(image => image.mediaType)
    }
  }
}
