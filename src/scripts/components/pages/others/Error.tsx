import React from 'react'
import PageWrap from '@/scripts/components/commons/PageWrap'
import {Card} from 'antd'

export default class ErrorPage extends React.Component<{},{}> {
	render(){

		return (
			<PageWrap>
				<Card>
					<div className="text-center">页面出错</div>
				</Card>
			</PageWrap>
		)
	}

}
