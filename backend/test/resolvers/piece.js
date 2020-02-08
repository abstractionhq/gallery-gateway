import { expect } from "chai";

import Piece from "../../models/piece";
import Portfolio from '../../models/portfolio'
import {
  createPortfolioPhoto,
  createPortfolioVideo,
  createPortfolioOtherMedia
} from "../../resolvers/mutations/piece";
import { fakeUser, fakePortfolioPeriod } from "../factories";

const standardPiece = (user, period, portfolio) => ({
  studentUsername: user.username,
  periodId: period.id,
  portfolioId: portfolio ? portfolio.id : null,
  title: "mytitle",
  comment: "this is my comment",
  yearLevel: "second",
  academicProgram: "learning"
});

describe("Piece Mutations", function() {
  it("creates an image piece", function() {
    return Promise.all([fakeUser(), fakePortfolioPeriod()]).then(models => {
      const user = models[0];
      const period = models[1];
      const args = {
        input: {
          piece: standardPiece(user, period),
          path: "a/path.jpg",
          horizDimInch: 1.2,
          vertDimInch: 1.3,
          mediaType: "mymedia"
        }
      };
      return createPortfolioPhoto({}, args, { auth: { type: "ADMIN" } }).then(
        () => {
          // make sure an Piece was created
          return Piece.count().then(num => expect(num).to.equal(1));
        }
      );
    });
  });
  it("creates a video piece", function() {
    return Promise.all([fakeUser(), fakePortfolioPeriod()]).then(models => {
      const user = models[0];
      const period = models[1];
      const args = {
        input: {
          piece: standardPiece(user, period),
          url: "https://vimeo.com/45196609"
        }
      };
      return createPortfolioVideo({}, args, { auth: { type: "ADMIN" } }).then(
        () => {
          return Piece.count().then(num => expect(num).to.equal(1));
        }
      );
    });
  });
  it("creates an other media piece", function() {
    return Promise.all([fakeUser(), fakePortfolioPeriod()]).then(models => {
      const user = models[0];
      const period = models[1];
      const args = {
        input: {
          piece: standardPiece(user, period),
          path: "https://www.rit.edu/computing/sites/rit.edu.computing/files/docs/BS%20-%20Flowchart%20Fall%202013-Sum%202016.pdf"
        }
      };
      return createPortfolioOtherMedia({}, args, { auth: { type: "ADMIN" } }).then(
        () => {
          return Piece.count().then(num => expect(num).to.equal(1));
        }
      );
    });
  });
  it("creates a portfolio when necessary", function() {
    return Promise.all([fakeUser(), fakePortfolioPeriod()]).then(models => {
      const user = models[0];
      const period = models[1];
      const args = {
        input: {
          piece: standardPiece(user, period),
          path: "https://www.rit.edu/computing/sites/rit.edu.computing/files/docs/BS%20-%20Flowchart%20Fall%202013-Sum%202016.pdf"
        }
      };
      return Portfolio.count().then(beforeCount => {
          return createPortfolioOtherMedia({}, args, { auth: { type: "ADMIN" } }).then(
        () => {
          return Portfolio.count().then(afterCount => 
            {
                expect(beforeCount).to.equal(0)
                expect(afterCount).to.equal(1)
                return Promise.resolve()
            });
        }
      );
      })
      
    });
  });
});
