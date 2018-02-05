import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Container, Card, CardTitle, CardSubtitle, CardText, Row, Col, Button } from 'reactstrap'

const CardStyle =`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  height: 229px;
  width: 100%;
`
const Shows = styled.div`
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`

const StudentShowCard = () => (
  <Container style={{padding:'20px 0 20px 0'}}>
    <Row>
      <Col>
       <Card body>
         <CardTitle>Show 1</CardTitle>
         <CardSubtitle>With supporting text below as a natural lead-in to additional content.</CardSubtitle>
         <Button>Make a Submission</Button>
       </Card>
     </Col>
    </Row>
  </Container>
)

export default StudentShowCard
