import { UserError } from "graphql-errors";
import moment from "moment-timezone";
import { ADMIN } from "../../constants";
import PortfolioPeriod from "../../models/portfolioPeriod";

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
