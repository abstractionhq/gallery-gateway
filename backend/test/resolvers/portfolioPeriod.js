import { expect } from "chai";

import {
  assignToPortfolioPeriod,
  removeFromPortfolioPeriod
} from "../../resolvers/mutations/portfolioPeriod";
import { fakeUser, fakePortfolioPeriod, fakePortfolio } from "../factories";
import PortfolioPeriod from "../../models/portfolioPeriod";

describe("Portfolio Periods", () => {
  describe("Manages judge assignment on portfolio periods", () => {
    it("adds judges to a portfolio period", () => {
      return Promise.all([fakeUser({ type: "JUDGE" }), fakePortfolioPeriod()])
        .then(([user, portfolioPeriod]) =>
          Promise.all([
            portfolioPeriod,
            assignToPortfolioPeriod(
              {},
              {
                portfolioPeriodId: portfolioPeriod.id,
                usernames: [user.username]
              },
              { auth: { type: "ADMIN" } }
            )
          ])
        )
        .then(([portfolioPeriod]) => portfolioPeriod.getUsers())
        .then(users => expect(users.length).to.equal(1));
    });
    it("adds judges to a portfolio period", () => {
      return Promise.all([fakeUser({ type: "JUDGE" }), fakePortfolioPeriod()])
        .then(([user, portfolioPeriod]) =>
          Promise.all([
            user,
            portfolioPeriod,
            assignToPortfolioPeriod(
              {},
              {
                portfolioPeriodId: portfolioPeriod.id,
                usernames: [user.username]
              },
              { auth: { type: "ADMIN" } }
            )
          ])
        )
        .then(([user, portfolioPeriod]) =>
          Promise.all([
            portfolioPeriod,
            removeFromPortfolioPeriod(
              {},
              {
                portfolioPeriodId: portfolioPeriod.id,
                usernames: [user.username]
              },
              { auth: { type: "ADMIN" } }
            )
          ])
        )
        .then(([portfolioPeriod]) => portfolioPeriod.getUsers())
        .then(users => expect(users.length).to.equal(0));
    });
  });
});
