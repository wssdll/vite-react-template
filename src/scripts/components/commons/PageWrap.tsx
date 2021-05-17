import React from 'react'
import styled from "styled-components";

export interface IPageWrapProps {
	title? : React.ReactNode;
	className? : string
}

const StyledPage = styled.div`
  .ant-card {
    border-top: none;
  }

  .ant-card-body {
    padding: 8px 12px;
  }
`

const PageWrap: React.FC<IPageWrapProps> = (props) => {
	return <StyledPage>{props.children}</StyledPage>
}

export default PageWrap
