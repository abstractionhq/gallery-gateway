import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from "../../constants";
import SinglePiece from "../../models/singlePiece"

export const PieceBase = {
  pieceType(piece) {
    if (piece.getSinglePiece().pieceType === IMAGE_ENTRY) {
      return "PHOTO";
    } else if (piece.getSinglePiece().pieceType === VIDEO_ENTRY) {
      return "VIDEO";
    } else if (piece.getSinglePiece().pieceType === OTHER_ENTRY) {
      return "OTHER";
    }
  }
};

export default {
  Piece: {
    __resolveType(data, context, info) {
      return SinglePiece.findOne({where: {id: data.pieceId}}).then(piece => {
        // Identifies for GraphQL which concrete instance of Entry this object is.
        if (piece.pieceType === IMAGE_ENTRY) {
          return info.schema.getType('Photo')
        } else if (piece.pieceType === VIDEO_ENTRY) {
          return info.schema.getType('Video')
        } else if (piece.pieceType === OTHER_ENTRY) {
          return info.schema.getType('OtherMedia')
        }
        throw new Error("Unknown piece type")
      })
    }
  }
};
