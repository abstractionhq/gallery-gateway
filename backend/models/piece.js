import DataTypes from "sequelize";
import sequelize from "../config/sequelize";
import Portfolio from "./portfolio";
import Image from "./image";
import Video from "./video";
import Other from "./other";

const Piece = sequelize.define("Piece", {
  portfolioId: {
    type: DataTypes.INTEGER,
    references: {
      model: "portfolios",
      key: "id"
    },
    onUpdate: "cascade",
    onDelete: "cascade"
  },
  pieceType: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  pieceId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: "Untitled",
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
});

Piece.prototype.getPortfolio = function getPortfolio() {
  return Portfolio.findById(this.portfolioId);
};

Piece.prototype.getImage = function getImage() {
  if (this.pieceType !== IMAGE_ENTRY) {
    return Promise.resolve(null);
  }
  return this.imagePromise
    ? this.imagePromise
    : (this.imagePromise = Image.findOne({ where: { id: this.pieceId } }));
};

Piece.prototype.getVideo = function getVideo() {
  if (this.pieceType !== VIDEO_ENTRY) {
    return Promise.resolve(null);
  }
  return this.videoPromise
    ? this.videoPromise
    : (this.videoPromise = Video.findOne({ where: { id: this.pieceId } }));
};

Piece.prototype.getOther = function getOther() {
  if (this.pieceType !== OTHER_ENTRY) {
    return Promise.resolve(null);
  }
  return this.otherPromise
    ? this.otherPromise
    : (this.otherPromise = Other.findOne({ where: { id: this.pieceId } }));
};

export default Piece;
