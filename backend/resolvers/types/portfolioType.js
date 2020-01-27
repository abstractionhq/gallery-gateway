import Piece from "../../models/piece";

export default {
  Portfolio: {
    pieces(portfolio, _, req) {
      return Piece.findAll({ where: { portfolioId: portfolio.id } });
    }
  }
};
