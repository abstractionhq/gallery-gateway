import { PieceBase } from './pieceType'

export default {
  PhotoPiece: {
    ...PieceBase,
    path (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getImage().then(image => image.path))
    },
    horizDimInch (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getImage().then(image => image.horizDimInch))
    },
    vertDimInch (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getImage().then(image => image.vertDimInch))
    },
    mediaType (piece) {
      return piece.getSinglePiece().then(singlePiece => singlePiece.getImage().then(image => image.mediaType))
    }
  }
}
