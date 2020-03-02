import Portfolio from "../../models/portfolio";

export default {
  PortfolioPeriod: {
    judges(portfolioPeriod, _, req){
      return portfolioPeriod.getUsers()
    },
    portfolios(portfolioPeriod, _, req) {
      return Portfolio.findAll({ where: { portfolioPeriodId: portfolioPeriod.id} });
    }
  }
};
