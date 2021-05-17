import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import App from "@/App";
import App from "@/scripts/components/App";
import menus from '@/scripts/menus/source'

ReactDOM.render(
	<App appType="sfa" menus={menus} defaultPageId="userProfile"/>,
	document.getElementById('root')
)
