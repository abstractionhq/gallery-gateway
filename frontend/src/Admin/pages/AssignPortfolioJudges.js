import React, { Component, Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "recompose";

import AssignPortfolioJudgesTable from "../containers/AssignPortfolioJudgesTable";
import CreateJudgeForm from "../containers/CreateJudgeForm";
import NotFound from "../../shared/components/NotFound";
import { fetchPortfolioPeriod } from "../actions";

const FormContainer = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
`;

class AssignPortfolioJudges extends Component {
  static propTypes = {
    portfolioPeriod: PropTypes.any // Object w/ 'id' and 'name' property or something falsey
  };

  componentDidMount() {
    const { id } = this.props.match.params;

    if (id) {
      this.props.fetchData(id);
    }
  }

  renderPage(portfolioPeriod) {
    return (
      <Fragment>
        <Container>
          <Row>
            <Col>
              <h1>{portfolioPeriod.name}</h1>
            </Col>
          </Row>
          <hr />
        </Container>
        <Container fluid>
          <AssignPortfolioJudgesTable portfolioPeriodId={portfolioPeriod.id} />
          <FormContainer>
            <CreateJudgeForm />
          </FormContainer>
        </Container>
      </Fragment>
    );
  }

  render() {
    // TODO: Show loading if loading so that 'Not Found' doesn't flash on valid shows
    return this.props.portfolioPeriod ? (
      this.renderPage(this.props.portfolioPeriod)
    ) : (
      <NotFound />
    );
  }
}

const mapStateToProps = ({ admin }, ownProps) => ({
  portfolioPeriod: admin.portfolioPeriods[ownProps.match.params.id]
});

const mapDispatchToProps = dispatch => ({
  fetchData: portfolioPeriodId =>
    dispatch(fetchPortfolioPeriod(portfolioPeriodId))
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  AssignPortfolioJudges
);
