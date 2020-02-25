import User from "../../models/user";
import { UserError } from "graphql-errors";
import { ADMIN } from "../../constants";
import PortfolioPeriod from "../../models/portfolioPeriod";
import Portfolio from "../../models/portfolio";

const isRequestingOwnUser = (req, args) => {
  return (
    req.auth.username !== undefined &&
    req.auth.username === args.studentUsername
  );
};

export function portfolioPeriod (_, args, req) {
  return PortfolioPeriod.findById(args.id)
}

export function portfolioPeriods(_, args, req) {
  // Students can only look at their own portfolios
  // TODO: uncomment the student stuff for when students are
  // requesting their porfolios
  if (
    //args.studentUsername &&
    req.auth.type !== ADMIN //&&
    //!isRequestingOwnUser(req, args)
  ) {
    throw new UserError("Permission Denied");
  }

  // Apply ordering, if desired
  const order = args.orderBy
    ? { order: [[args.orderBy.sort, args.orderBy.direction]] }
    : {};

  //TODO: Get student portfolios

  return PortfolioPeriod.findAll(order);
}

/**
 * Just looking for the open portfolio period. If the student requestion (if a student is requesting)
 * already has a portfolio for that period, return null.
 */
export function openPortfolioPeriod(_, args, req) {
  return PortfolioPeriod.findOne({
    where: {
      $and: [
        { entryStart: { $lt: new Date() } },
        { entryEnd: { $gt: new Date() } }
      ]
    }
  }).then(openPeriod => {
    if (!openPeriod) return null;

    if (args.studentUsername) {
      return Portfolio.findOne({
        where: {
          portfolioPeriodId: openPeriod.id,
          studentUsername: args.studentUsername
        }
      }).then(portfolio => {
        return !portfolio ? openPeriod : null;
      });
    } else {
      return openPeriod;
    }
  });
}
