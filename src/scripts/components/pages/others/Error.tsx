import React from 'react'
import PageWrap from '@/scripts/components/commons/PageWrap'
import {Card} from 'antd'
import notfound from '@/images/notfound.svg'
import styled from "styled-components";

const ErrorContainer = styled.div`
  text-align: center;
  padding-top: 5px;
  padding-bottom: 35px;
`

const ErrorTitle = styled.div`
  font-size: 32px;
  font-family: fantasy;
  color: #c2ccd5;
  margin-bottom: 20px;
`

export default class ErrorPage extends React.Component<{},{}> {
	render(){

		return (
			<PageWrap>
				<Card>
					<ErrorContainer>
						<ErrorTitle>404 Not Found</ErrorTitle>
						<img src={notfound} alt="404"/>
					</ErrorContainer>
				</Card>
			</PageWrap>
		)
	}

}
