import EventBus, { IHandler } from '@/scripts/commons/EventBus'
import { deepEqual } from '@/scripts/utils'
import pages,{ PageId } from '@/scripts/components/pages'
import storage from 'beyond-lib/lib/storage'


const pagesEventBus = new EventBus()

type AppType =  'main'


export interface IBasePageInstance<T extends object> {
	title?: string
	fromId?: string
	params?: T
}

export interface IPageInstance<T extends object> extends IBasePageInstance<T> {
	id: string
	pageId: PageId;
	appType: AppType
}

export type PageEventMessage = 'update' | string | object

const ACTIVE_CHANGE = 'activeChange'


export function triggerSideLink(title: string) {
	setTimeout(() => {
		// @ts-ignore
		let sideCollection: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('ant-menu-item')
		for (let i = 0; i < sideCollection.length; i++) {
			const sideArrElement = sideCollection[i]
			if (sideArrElement.innerText === title) {
				sideArrElement.click()
			}
		}
	},500)
}

function triggerSideMenu(current: string,instances:IPageInstance<any>[]) {
	let instance =  instances.find(item=>item.id === current)
	if(instance){
		triggerSideLink(instance.title)
	}
}

export interface IPageInstanceProps<T extends object> extends IPageInstance<T> {

	close: () => void;
	closeAndGoBack: () => void;
	//刷新本页面，效果同标签上右键 的刷新
	refresh : ()=> void;
	onActiveChange: (handler: IHandler<{activeId : string}>) => (()=>void) | void;
	get: (handler: IHandler<PageEventMessage>) => void;
	send: (target: IPageInstance<{}>, message: PageEventMessage) => void;
	sendFrom: (message: PageEventMessage) => void;
	isActive : ()=> boolean
}


export function getPageInstanceProps<T extends object>(instance: IPageInstance<T>): IPageInstanceProps<T> {
	let { fromId, params, id, pageId,appType,title } = instance
	return {
		id,
		pageId,
		appType,
		title,
		fromId,
		params,
		isActive : ()=> id === pageStore.activeId,

		close() {
			pageStore.remove(instance)
		},

		closeAndGoBack() {
			if (instance) {
				pageStore.remove(instance, fromId)
			}
		},

		refresh(){
			if(instance){
				pageStore.refresh(instance)
			}
		},

		onActiveChange(handler: IHandler<{activeId : string}>){
			if (instance) {
				return pagesEventBus.on(ACTIVE_CHANGE, handler)
			}
		},

		get(handler: IHandler<PageEventMessage>) {
			if (instance) {
				return pagesEventBus.on(instance.id, handler)
			}
		},

		send(targetPageInstance: IPageInstance<{}> | string, message: PageEventMessage) {
			if (targetPageInstance) {
				let targetId = typeof targetPageInstance === 'string' ? targetPageInstance : targetPageInstance.id
				pagesEventBus.trigger(targetId, message)
			}
		},

		sendFrom(message: PageEventMessage) {
			if (fromId) {
				pagesEventBus.trigger(fromId, message)
			}
		}
	}
}

class PageStore extends EventBus {

	private _activeIds: { [key: string]: string }
	private _pages: { [key: string]: IPageInstance<any>[] }
	private _appType: AppType

	private _defaultPage : IPageInstance<any>

	prevActiveId : string

	constructor() {
		super()
	}

	init(appType: AppType, defaultPageId? : PageId) {
		this._pages = storage.get('pages') || {}
		this._activeIds = storage.get('activePageId') || {}
		this.appType = appType

		let instances = this.instances.filter((instance)=> pages[instance.pageId]  )
		if(defaultPageId){
			this._defaultPage = this.getSameInstance(defaultPageId) || this.createPageInstance(defaultPageId, {params: {}})

			if(!instances.length){
				instances = [this._defaultPage]
			}
		}
		this.instances = instances
		const activeId = this.activeId
		if(!activeId || !this.getInstanceById(activeId)){
			this.activeId = instances[0] ? this.instances[0].id : null
		}
		triggerSideMenu(this.activeId,this.instances)
		// if(instances.some((instance)=> instance. ))
		// if (!this.getActive()) {
		// 	this.activeId = this.instances[0] ? this.instances[0].id : null
		// }
	}

	set instances(value: IPageInstance<any>[]) {
		this._pages[this.appType] = value
		storage.set('pages',this._pages)
	}

	get instances() {
		return this._pages[this.appType] ? this._pages[this.appType].slice(0) : []
	}

	get appType() {
		return this._appType
	}

	set appType(value: AppType) {
		this._appType = value
	}

	set activeId(value: string) {
		this._activeIds[this.appType] = value
		storage.set('activePageId', this._activeIds)
	}

	get activeId() {
		return this._activeIds ? this._activeIds[this.appType] : null
	}

	private createPageInstance(pageId: PageId, options? : IBasePageInstance<any>): IPageInstance<any> {
		let id = +new Date() + '' + Math.ceil(Math.random() * 10000)
		let title = options && options.title ? options.title : pages[pageId].title
		return { id, pageId, ...options,title, appType: this.appType }
	}

	replaceInstance(pageId: PageId, options : IBasePageInstance<object> = {}){
		const from = this.getInstanceById(options.fromId)
		if(from){
			const newPage = this.createPageInstance(pageId, options)
			const instances = this.instances
			const activeIndex = this.getActiveIndex()
			instances[activeIndex] = newPage
			this.instances = instances
			this.active(newPage)
		}
	}

	addInstance(pageId: PageId, options : IBasePageInstance<object> = {},refresh? : boolean) {
		if (pageId) {
			let newPage = this.createPageInstance(pageId, options)
			let page = this.getSameInstance(newPage)
			if(page){
				this.active(page)
				if(refresh){
					this.refresh(page)
				}
			}else{
				let instances = this.instances
				let activeIndex = this.getActiveIndex()
				instances.splice(activeIndex+1,0,newPage)
				this.instances = instances
				this.active(newPage)
			}
		}
	}

	getInstanceById(id: string) {
		if (id) {
			return this.instances.filter((item) => item.id === id)[0] || null
		} else {
			return null
		}
	}

	private getSameInstance(instance : IPageInstance<any> | PageId) {
		if(!instance){
			return
		}
		if(typeof instance === 'string'){
			return this.instances.filter((item)=> item.pageId === instance)[0] || null
		}else{
			const {pageId,title,params} = instance
			return this.instances.filter((item)=> item.pageId === pageId && title === item.title && deepEqual(params, item.params))[0] || null
		}
	}

	getActive() {
		if (this.activeId) {
			return this.getInstanceById(this.activeId)
		} else {
			return null
		}
	}

	isActive(page: IPageInstance<any>) {
		return page && page.id === this.activeId
	}

	active(instance : string | IPageInstance<any>) {
		this.prevActiveId = this.activeId
		let nextActiveId : string
		if(instance){
			let instanceId = typeof instance === 'string' ? instance : instance.id
			if(this.getInstanceById(instanceId)){
				nextActiveId = instanceId
			}
		}

		if(nextActiveId){
			this.activeId = nextActiveId
		}else{
			this.activeId = this.instances && this.instances[0] ? this.instances[0].id : null
		}
		triggerSideMenu(this.activeId,this.instances)
		pagesEventBus.trigger(ACTIVE_CHANGE,{activeId : this.activeId})
		this.triggerUpdate()
	}

	remove(instance: IPageInstance<any> | string, nextId? : string) {

		if (typeof instance === 'string') {
			instance = this.getInstanceById(instance)
		}
		if (instance) {
			let removeId = instance.id
			if(removeId === nextId){
				nextId = null
			}
			if(!this.isActive(instance)){
				//关闭 非active页面
				nextId = this.activeId
			}else if(!nextId){
				let instances = this.instances
				let index = this.getActiveIndex()
				let next = instances[index - 1]
				nextId  = next ? next.id : null
			}
			this.instances = this.instances.filter((item) => item.id !== removeId)
			this.active(nextId)
		}
	}

	removeLeft(page: IPageInstance<any>) {
		if (page) {
			const index = this.getIndex(page)
			if (index >= 0) {
				const activeIndex = this.getActiveIndex()
				const instances = this.instances
				const defaultInstance = instances[0]
				this.instances = [defaultInstance].concat(instances.slice(index))
				if(activeIndex > 0 && activeIndex < index){
					this.active(page.id)
				}else{
					this.triggerUpdate()
				}
			}
		}
	}

	removeRight(page: IPageInstance<any>) {
		if (page) {
			let index = this.getIndex(page)
			if (index >= 0) {
				this.instances = this.instances.slice(0, index + 1)

				if(this.getActiveIndex() > index){
					this.active(page.id)
					// this.activeId = page.id
				}else{
					this.triggerUpdate()
				}
			}
		}
	}

	removeOthers(instance: IPageInstance<any>) {
		if (instance) {
			let instances = this.instances.filter((item) => item.id === instance.id)
			if(this._defaultPage && instance.pageId !== this._defaultPage.pageId){
				instances.unshift(this._defaultPage)
			}
			this.instances = instances
			this.active(instance.id)
			// this.activeId = instance.id
			// this.triggerUpdate()
		}
	}

	getActiveIndex() {
		return this.getIndex(this.getActive())
	}

	getIndex(instance : IPageInstance<any>) {
		if(instance){
			let instances = this.instances
			for(let i = 0; instances[i]; i++){
				if(instances[i].id === instance.id){
					return i
				}
			}
		}
		return -1
	}

	removeAll() {
		this.instances = [this._defaultPage]
		this.active(this._defaultPage.id)
	}

	refresh(instance: IPageInstance<any> | string){
		if(typeof instance === 'string'){
			instance = this.getInstanceById(instance)
		}
		if(instance != null){
			this.trigger('refresh',instance)
		}
	}

	onRefresh(handler : IHandler<IPageInstance<any>>){
		return this.on('refresh', handler)
	}


	onUpdate(handler : IHandler<any>) {
		return this.on('update', handler)
	}

	triggerUpdate() {
		setTimeout(() => {
			this.trigger('update')
		}, 0)
	}
}

const pageStore = new PageStore()
export default pageStore
