import React from 'react'
import ReactDOM from 'react-dom'
import '@/styles/style.less'

// import App from "@/App";
import App from "@/scripts/components/App";
import menus from '@/scripts/menus/source'

ReactDOM.render(
	<App appType="main" menus={menus} defaultPageId="userProfile"/>,
	document.getElementById('root')
)
