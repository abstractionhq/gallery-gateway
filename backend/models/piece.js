import DataTypes from "sequelize";
import sequelize from "../config/sequelize";
import Portfolio from "./portfolio";
import Image from "./image";
import Video from "./video";
import Other from "./other";
import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from "../constants";

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

Piece.prototype.getOwner = function getOwner() {
  return Portfolio.findById(this.portfolioId).then(
    portfolio => portfolio.studentUsername
  );
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

Piece.prototype.getMedia = function(transaction) {
  let Type = null;
  switch (this.pieceType) {
    case IMAGE_ENTRY:
      Type = Image;
      break;
    case VIDEO_ENTRY:
      Type = Video;
      break;
    case OTHER_ENTRY:
      Type = Other;
      break;
    default:
      return Promise.resolve(null);
  }
  return Type.findOne({where: {id: this.pieceId }, transaction})
};

export default Piece;
