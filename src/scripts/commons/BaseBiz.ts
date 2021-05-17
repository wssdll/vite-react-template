import { IPageProps } from '@/scripts/components/pages/loader';
import { IPageInstanceProps } from '@/scripts/stores/pageStore';

export default class BaseBiz<S> {

	state: S

	readonly $component: React.Component<IPageProps<any>, any>
	readonly $page: IPageInstanceProps<any>

	constructor(component: React.Component<IPageProps<any>, any>) {
		this.$component = component
		this.$page = component.props.page
	}

	setState(state?: Partial<S>, cb?: () => void) {
		this.state = {...this.state,...state}
		// this.$component.setState({},cb)
		this.$component.forceUpdate(cb)
	}

	toggle(field : keyof S, state? : Partial<S> ){
		let value = !this.state[field] as any
		state = {[field] : value,...state}  as  Partial<S>
		this.setState(state)
	}
}
