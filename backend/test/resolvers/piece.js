import { expect } from "chai";

import Piece from "../../models/piece";
import Portfolio from "../../models/portfolio";
import Image from "../../models/image";
import Video from "../../models/video";
import Other from "../../models/other";
import {
  createPortfolioPhoto,
  createPortfolioVideo,
  createPortfolioOtherMedia,
  deletePiece
} from "../../resolvers/mutations/piece";
import {
  fakeUser,
  fakePortfolioPeriod,
  fakePortfolio,
  fakeImagePiece,
  fakeVideoPiece,
  fakeOtherPiece
} from "../factories";
import { STUDENT, ADMIN, JUDGE } from "../../constants";

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
  describe("Piece creation", function() {
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
            path:
              "https://www.rit.edu/computing/sites/rit.edu.computing/files/docs/BS%20-%20Flowchart%20Fall%202013-Sum%202016.pdf"
          }
        };
        return createPortfolioOtherMedia({}, args, {
          auth: { type: "ADMIN" }
        }).then(() => {
          return Piece.count().then(num => expect(num).to.equal(1));
        });
      });
    });
    it("creates a portfolio when necessary", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()]).then(models => {
        const user = models[0];
        const period = models[1];
        const args = {
          input: {
            piece: standardPiece(user, period),
            path:
              "https://www.rit.edu/computing/sites/rit.edu.computing/files/docs/BS%20-%20Flowchart%20Fall%202013-Sum%202016.pdf"
          }
        };
        return Portfolio.count().then(beforeCount => {
          return createPortfolioOtherMedia({}, args, {
            auth: { type: "ADMIN" }
          }).then(() => {
            return Portfolio.count().then(afterCount => {
              expect(beforeCount).to.equal(0);
              expect(afterCount).to.equal(1);
              return Promise.resolve();
            });
          });
        });
      });
    });
  });
  describe("Deletes pieces", function() {
    it("deletes an image piece", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()])
        .then(([user, period]) =>
          Promise.all([
            user,
            fakePortfolio({
              user,
              period
            })
          ])
        )
        .then(([user, portfolio]) =>
          Promise.all([user, fakeImagePiece({ user, portfolio })])
        )
        .then(([user, piece]) =>
          deletePiece(
            {},
            { id: piece.id },
            { auth: { type: STUDENT, username: user.username } }
          )
        )
        .then(() =>
          Promise.all([
            Piece.count().then(num => expect(num).to.equal(0)),
            Image.count().then(num => expect(num).to.equal(0))
          ])
        );
    });

    it("deletes a video piece", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()])
        .then(([user, period]) =>
          Promise.all([
            user,
            fakePortfolio({
              user,
              period
            })
          ])
        )
        .then(([user, portfolio]) =>
          Promise.all([user, fakeVideoPiece({ user, portfolio })])
        )
        .then(([user, piece]) =>
          deletePiece(
            {},
            { id: piece.id },
            { auth: { type: STUDENT, username: user.username } }
          )
        )
        .then(() =>
          Promise.all([
            Piece.count().then(num => expect(num).to.equal(0)),
            Video.count().then(num => expect(num).to.equal(0))
          ])
        );
    });

    it("deletes an other piece", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()])
        .then(([user, period]) =>
          Promise.all([
            user,
            fakePortfolio({
              user,
              period
            })
          ])
        )
        .then(([user, portfolio]) =>
          Promise.all([user, fakeOtherPiece({ user, portfolio })])
        )
        .then(([user, piece]) =>
          deletePiece(
            {},
            { id: piece.id },
            { auth: { type: STUDENT, username: user.username } }
          )
        )
        .then(() =>
          Promise.all([
            Piece.count().then(num => expect(num).to.equal(0)),
            Other.count().then(num => expect(num).to.equal(0))
          ])
        );
    });

    it("lets an admin delete pieces", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()])
        .then(([user, period]) =>
          Promise.all([
            user,
            fakePortfolio({
              user,
              period
            })
          ])
        )
        .then(([user, portfolio]) => fakeOtherPiece({ user, portfolio }))
        .then(piece =>
          deletePiece({}, { id: piece.id }, { auth: { type: ADMIN } })
        )
        .then(() =>
          Promise.all([
            Piece.count().then(num => expect(num).to.equal(0)),
            Other.count().then(num => expect(num).to.equal(0))
          ])
        );
    });

    it("does not let a student delete pieces that don't belong to them", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()])
        .then(([user, period]) =>
          Promise.all([
            user,
            fakePortfolio({
              user,
              period
            })
          ])
        )
        .then(([user, portfolio]) =>
          Promise.all([user, fakeOtherPiece({ user, portfolio })])
        )
        .then(([user, piece]) => {
          return deletePiece(
            {},
            { id: piece.id },
            {
              auth: {
                type: STUDENT,
                username: user.username + "ABC" // Guaranteed wrong username
              }
            }
          )
            .then(() => {
              assert.fail("Expected exception");
            })
            .catch(error => {
              expect(error.message).to.equal("Permission Denied");
            });
        });
    });

    it("does not let a student Judge delete piece", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()])
        .then(([user, period]) =>
          Promise.all([
            user,
            fakePortfolio({
              user,
              period
            })
          ])
        )
        .then(([user, portfolio]) => fakeOtherPiece({ user, portfolio }))
        .then(piece => {
          return deletePiece(
            {},
            { id: piece.id },
            {
              auth: {
                type: JUDGE
              }
            }
          )
            .then(() => {
              assert.fail("Expected Exception");
            })
            .catch(error => {
              expect(error.message).to.equal("Permission Denied");
            });
        });
    });
  });
});
