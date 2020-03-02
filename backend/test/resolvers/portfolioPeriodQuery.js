import { expect } from "chai";

import { openPortfolioPeriod } from "../../resolvers/queries/portfolioPeriodQuery";
import { assignToPortfolioPeriod } from "../../resolvers/mutations/portfolioPeriod";
import { fakeUser, fakePortfolioPeriod, fakePortfolio } from "../factories";
import PortfolioPeriod from "../../models/portfolioPeriod";

describe("Portfolio Period Queries", function() {
  describe("openPortfolioPeriod", function() {
    it("returns null when the student already has a portfolio", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()])
        .then(models => {
          const user = models[0];
          const period = models[1];
          return Promise.all([user, period, fakePortfolio({ user, period })]);
        })
        .then(models => {
          const user = models[0];
          return openPortfolioPeriod(
            {},
            {
              studentUsername: user.username
            },
            { auth: { type: "ADMIN" } }
          );
        })
        .then(period => {
          return expect(period).to.be.null;
        });
    });
    it("returns a period when the student does not have a portfolio", function() {
      return Promise.all([fakeUser(), fakePortfolioPeriod()])
        .then(models => {
          const user = models[0];
          return openPortfolioPeriod(
            {},
            {
              studentUsername: user.username
            },
            { auth: { type: "ADMIN" } }
          );
        })
        .then(period => {
          return expect(period).to.be.not.null;
        });
    });
  });
});
