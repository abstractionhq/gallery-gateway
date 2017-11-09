import React from 'react'
import { Row, Col } from 'reactstrap'
import { Flex } from 'rebass'
import styled from 'styled-components'

import splash from 'assets/splash-page.jpg'

const SplashImage = styled.img`
  background-image: url(${props => props.src});
  background-size: cover;
  height: 100vh;
  position: fixed;
  right: 0;
`

const PageTitle = styled.h1`
  text-align: center;
`

const ButtonContainer = styled.div`
  margin: 50px auto 0 auto;
  text-align: center;
  width: 250px;
`

const LoginButton = styled.a`
  background-color: #ee6e73;
  color: white;
  cursor: pointer;
  display: block;
  padding: 10px;
  width: 250px;

  &:hover {
    color: white;
    opacity: 0.75;
    text-decoration: none;
  }
`

const Home = () => (
  <Row>
    <Col md='7'>
      <Flex column align='center' justify='center' style={{minHeight: '75vh'}}>
        <PageTitle>Gallery Gateway</PageTitle>
        <ButtonContainer>
          <LoginButton href='http://localhost:3000/auth/login'>Login</LoginButton>
        </ButtonContainer>
      </Flex>
    </Col>
    <Col>
      <SplashImage src={splash} />
    </Col>
  </Row>
)

export default Home
