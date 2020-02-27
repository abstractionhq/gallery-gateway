import DataTypes from "sequelize";
import sequelize from "../config/sequelize";
import Image from "./image";
import Video from "./video";
import Other from "./other";
import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../constants'
import Entry from "./entry";


const SinglePiece = sequelize.define("singlePiece", {
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

SinglePiece.prototype.getImage = function getImage() {
  if (this.pieceType !== IMAGE_ENTRY) {
    return Promise.resolve(null);
  }
  return this.imagePromise
    ? this.imagePromise
    : (this.imagePromise = Image.findOne({ where: { id: this.pieceId } }));
};

SinglePiece.prototype.getVideo = function getVideo() {
  if (this.pieceType !== VIDEO_ENTRY) {
    return Promise.resolve(null);
  }
  return this.videoPromise
    ? this.videoPromise
    : (this.videoPromise = Video.findOne({ where: { id: this.pieceId } }));
};

SinglePiece.prototype.getOther = function getOther() {
  if (this.pieceType !== OTHER_ENTRY) {
    return Promise.resolve(null);
  }
  return this.otherPromise
    ? this.otherPromise
    : (this.otherPromise = Other.findOne({ where: { id: this.pieceId } }));
};

SinglePiece.prototype.getEntry = function getEntry() {

  return Entry.findOne({where: {pieceId: this.id}})
};

SinglePiece.prototype.getMedia = function(transaction) {
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

export default SinglePiece;
