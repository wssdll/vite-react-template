import React from 'react'
import styled from "styled-components";

export interface IGlobalFooterProps {
	className? : string;
	links : any[];
	copyright : React.ReactElement
}

const StyledFooter = styled.div`
  padding: 0 16px;
  text-align: center;
  
  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);
      transition: all .3s;

      &:not(:last-child) {
        margin-right: 40px;
      }

      &:hover {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }

  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
`


const GlobalFooter: React.FC<IGlobalFooterProps> = (props) => {
	let {links, copyright} = props
	return <StyledFooter>
		{links && (
			<div className="links">
				{links.map((link) => (
					<a
						key={link.title}
						target={link.blankTarget ? '_blank' : '_self'}
						href={link.href}
					>
						{link.title}
					</a>
				))}
			</div>
		)}
		{copyright && <div className="copyright">{copyright}</div>}
	</StyledFooter>
}

export default GlobalFooter
