import User from "../../models/user";
import { UserError } from "graphql-errors";
import { ADMIN } from "../../constants";
import PortfolioPeriod from "../../models/portfolioPeriod";

const isRequestingOwnUser = (req, args) => {
  return (
    req.auth.username !== undefined &&
    req.auth.username === args.studentUsername
  );
};

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
