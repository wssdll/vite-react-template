import React from 'react'
import pageStore, { IPageInstance, IPageInstanceProps } from '@/scripts/stores/pageStore'
import { IEvent } from '@/scripts/commons/EventBus';


export type Loader = (() => Promise<{default : React.ComponentClass<any,any> | React.FC<any>}>)

export interface IPageProps<T extends object> {
	page : IPageInstanceProps<T>
}

interface IPageState {
	Component :  React.ComponentClass<any,any> | React.FC<any> | null
}

export function load<T extends object>(loader : Loader /*, params? : T */) : React.ComponentClass<IPageProps<T>,any> {
	return class extends React.Component<IPageProps<T>, IPageState>{

		off : (()=>void) | null
		constructor(props : IPageProps<T>){
			super(props)
			this.state = {
				Component : null
			}
		}

		shouldComponentUpdate(_nextProps :IPageProps<T>,nextState : IPageState){
			if(this.state.Component ===  nextState.Component){
				return false
			}else{
				return true
			}
		}

		componentDidUpdate(_prevProps: IPageProps<T>) {
			console.log(this.props.page.pageId)
		}

		async componentDidMount() {
			if(loader){
				let {default : Component} = await loader()
				this.setState({Component})
			}
			this.off = pageStore.onRefresh(this.refresh)
		}

		componentWillUnmount(){
			if(this.off){
				this.off()
				this.off = null
			}
		}

		refresh = (e : IEvent<IPageInstance<any>>)=>{
			if(e.data && e.data.id === this.props.page.id){
				this._refresh()
			}
		}

		private _refresh() {
			let { Component } = this.state
			this.setState({ Component: null }, () => {
				this.setState({ Component })
			})
		}

		public render(): JSX.Element {
			const {Component} = this.state
			if(Component){
				return <Component  {...this.props} />
			}else{
				return <div />
			}
		}
	}
}
