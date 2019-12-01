import { UserError } from "graphql-errors";
import { ADMIN } from "../../constants";
import Portfolio from "../../models/portfolio";

export function portfolioByPeriod(_, args, req) {
  // Students can only look at their own portfolios
  // TODO: uncomment the student stuff for when students are
  // requesting their porfolios
  if (args.studentUsername && req.auth.type !== ADMIN) {
    throw new UserError("Permission Denied");
  }
  const { periodId } = args;

  const studentUsername = args.studentUsername
    ? args.studentUsername
    : req.auth.username;

  return Portfolio.find({
    where: {
      studentUsername,
      portfolioPeriodId: periodId
    }
  });
}
