import React from 'react'
import pageStore from '@/scripts/stores/pageStore'
import { PageId } from '@/scripts/components/pages'

export interface IBaseLinkProps {
	title?: string
	fromId?: string
	source? : 'menu'
}

export interface ILinkProps<T extends object> extends IBaseLinkProps {
	to : PageId | {id : PageId}
	style? : React.CSSProperties
	className? : string
	params?: T
	linkType? : 'redirect' | 'refresh'
}

type Target = PageId | {id : PageId}

function parseLinkParams(target: Target, params?: object, baseLinkOptions?: IBaseLinkProps){
	let pageId = typeof target === 'string' ? target : (target ? target.id : null)
	let { fromId, title,source } = baseLinkOptions || {}
	params = params || {}

	if(source !== 'menu' && !fromId){
		const active = pageStore.getActive()
		fromId = active ? active.id : void 0
	}
	return {pageId,options : {title, fromId, params} }
}


export default class PageLink<T extends object> extends React.Component<ILinkProps<T>, any> {

	static to(target: Target, params?: object, basePageProps?: IBaseLinkProps) {
		const {pageId,options} = parseLinkParams(target,params,basePageProps)
		pageStore.addInstance(pageId, options)
	}

	static toAndRefresh(target: Target, params?: object, basePageProps?: IBaseLinkProps) {
		const {pageId,options} = parseLinkParams(target,params,basePageProps)
		pageStore.addInstance(pageId, options,true)
	}

	static refresh(instanceId : string) {
		pageStore.refresh(instanceId)
	}

	static redirect(target: Target, params?: object, basePageProps?: IBaseLinkProps) {
		const {pageId,options} = parseLinkParams(target,params,basePageProps)
		pageStore.replaceInstance(pageId,options)
	}

	handleClick = (e : React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		let { to: target, params,fromId,title,linkType,source } = this.props
		const basePageProps = {fromId,title,source}
		if(!linkType){
			PageLink.to(target,params,basePageProps)
		}else if(linkType === 'redirect'){
			PageLink.redirect(target,params,basePageProps)
		}else if(linkType === 'refresh'){
			PageLink.toAndRefresh(target,params,basePageProps)
		}
	}

	public render(): JSX.Element {
		let {fromId,params,to,linkType,title,source,...rests} = this.props
		return <a {...rests} onClick={this.handleClick} />
	}
}
