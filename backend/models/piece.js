import DataTypes from "sequelize";
import sequelize from "../config/sequelize";
import Portfolio from "./portfolio";
import SinglePiece from "./singlePiece";


const Piece = sequelize.define("piece", {
  portfolioId: {
    type: DataTypes.INTEGER,
    references: {
      model: "portfolios",
      key: "id"
    },
    onUpdate: "cascade",
    onDelete: "cascade"
  },
  pieceId: {
    allowNull: false,
    type: DataTypes.INTEGER
  }
});

Piece.prototype.getPortfolio = function getPortfolio() {
  return Portfolio.findById(this.portfolioId);
};

Piece.prototype.getSinglePiece = function getSinglePiece() {
  return SinglePiece.findById(this.pieceId);
};

export default Piece;
