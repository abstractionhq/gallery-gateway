import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from "../../constants";

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
      // Identifies for GraphQL which concrete instance of Entry this object is.
      if (data.pieceType === IMAGE_ENTRY) {
        return info.schema.getType("PhotoPiece");
      } else if (data.pieceType === VIDEO_ENTRY) {
        return info.schema.getType("VideoPiece");
      } else if (data.pieceType === OTHER_ENTRY) {
        return info.schema.getType("OtherMediaPiece");
      }
      throw new Error("Unknown entry type");
    }
  }
};
