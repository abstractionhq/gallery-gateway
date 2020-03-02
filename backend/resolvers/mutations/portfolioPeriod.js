import { UserError } from "graphql-errors";
import moment from "moment-timezone";
import { ADMIN } from "../../constants";
import PortfolioPeriod from "../../models/portfolioPeriod";
import Portfolio from "../../models/portfolio";
import db from '../../config/sequelize';

export function createPortfolioPeriod(_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError("Permission Denied");
  }
  // Handle timezones, start times to midnight and end times to 11:59:59
  const entryStart = moment(args.input.entryStart)
    .tz("America/New_York")
    .startOf("day");
  const entryEnd = moment(args.input.entryEnd)
    .tz("America/New_York")
    .endOf("day");
  const judgingStart = moment(args.input.judgingStart)
    .tz("America/New_York")
    .startOf("day");
  const judgingEnd = moment(args.input.judgingEnd)
    .tz("America/New_York")
    .endOf("day");
  const newPortfolioPeriod = {
    name: args.input.name,
    description: args.input.description,
    entryStart: entryStart,
    entryEnd: entryEnd,
    judgingStart: judgingStart,
    judgingEnd: judgingEnd,
    numPieces: args.input.numPieces
  };
  return PortfolioPeriod.create(newPortfolioPeriod);
}

export function assignToPortfolioPeriod (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return PortfolioPeriod.findOne({ where: { id: args.portfolioPeriodId } }).then((portfolioPeriod) => {
    if (portfolioPeriod === null) {
      throw new UserError('Portfolio Period Not Found')
    }
    if (args.usernames.length < 1) {
      throw new UserError('Please input one or more usernames')
    }
    return portfolioPeriod
      .addUsers(args.usernames)
      .catch(() => {
        throw new UserError('Cannot find one or more usernames')
      })
  }).then(() => { return true })
}

export function removeFromPortfolioPeriod (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  if (args.usernames.length < 1) {
    throw new UserError('Please input one or more usernames')
  }
  return db.transaction(transaction =>
    PortfolioPeriod.findOne({ where: { id: args.portfolioPeriodId }, transaction })
      .then((portfolioPeriod) => {
        if (portfolioPeriod === null) {
          throw new UserError('Portfolio Period Not Found')
        }

        return portfolioPeriod.removeUsers(args.usernames, {transaction})
      })
      .then(() => Portfolio.findAll({where: {portfolioPeriodId: args.portfolioPeriodId}, transaction}))
      .then(portfolios => {
        const portfolioIds = portfolios.map(portfolio => portfolio.id)
        return Promise.resolve(true);
        // TODO Destroy portfolio votes. Voting wasn't built out yet when this was done created.
        // Will probably look something like the following
        // PortfolioVote.destroy({where: {portfolioId: portfolioIds, judgeUsername: args.usernames}, transaction})
      })
  ).then(() => { return true })
}
