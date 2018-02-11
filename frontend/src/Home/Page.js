import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'

import splash from 'assets/splash-page.jpg'

const SplashImage = styled.img`
  background-image: url(${props => props.src});
  object-fit: cover;
  height: 100vh;
  width: 41%;
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

const LoginContainer = styled.div`
  justify-content: center;
  min-height: 75vh;
  display: flex;
  flex-direction: column;
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
  <Container>
    <Row>
      <Col sm='7' xs='12'>
        <SplashImage src={splash} className='d-none d-sm-block'/>
        <LoginContainer>
          <PageTitle>Gallery Gateway</PageTitle>
          <ButtonContainer>
            <LoginButton href='http://localhost:3000/auth/login'>Login</LoginButton>
          </ButtonContainer>
        </LoginContainer>
      </Col>
    </Row>
  </Container>
)

export default Home
