import Portfolio from "../../models/portfolio";

export default {
  PortfolioPeriod: {
    portfolios(portfolioPeriod, _, req) {
      return Portfolio.findAll({ where: { portfolioPeriodId: portfolioPeriod.id} });
    }
  }
};
