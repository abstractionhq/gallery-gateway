import React from 'react'
import FASpinner from 'react-icons/lib/fa/spinner'
import styled from 'styled-components'

const LoadingDiv = styled.div`
  text-align: center;
  padding: 10px;
`

const Loading = () => (
  <LoadingDiv>
    <FASpinner size={70} />
  </LoadingDiv>
)

export default Loading
