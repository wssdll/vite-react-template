
// import { ReactEventHandler } from "react";

/*
	function add(id){}
 keyHelper({'tab:bottom' : [add.bind(this,id),'table2Left'], enter : [save,'table2Left']})

 */
export const Keys = {
	up: 38,
	down: 40,
	enter: 13,
	esc: 27,
	tab: 9,
	left : 37,
	right : 39
}

const callHandlers = (handlers: Array<'table2Left' | (()=> void)>, e: any) => {
	if (handlers && handlers.length > 0 && handlers.forEach) {
		handlers.forEach((handler) => {
			if (typeof handler === 'function') {
				handler()
			} else if (handler === 'table2Left') {
				table2Left(e.target)
			}
		})
	}
}

const table2Left = (input: HTMLInputElement) => {
	let parent = input.parentNode
	while (parent && parent.nodeName.toLowerCase() !== 'table') {
		parent = parent.parentNode
	}
	if (parent && (parent as HTMLElement).className.indexOf('ant-table-fixed') >= 0 && parent.parentNode) {
		(parent.parentNode as HTMLElement).scrollLeft = 0
	}
}

const isAtBottom = (el: HTMLElement) => {
	let parent = el.parentNode
	while (parent && parent.nodeName.toLowerCase() !== 'tr') {
		parent = parent.parentNode
	}
	return parent && !(parent as HTMLElement).nextSibling
}

const isAtTop = (el: HTMLElement) => {
	let parent = el.parentNode
	while (parent && parent.nodeName.toLowerCase() !== 'tr') {
		parent = parent.parentNode
	}
	return parent && !(parent as HTMLElement).previousSibling
}

type IkeyHelpersOperator =  Array<'table2Left' | (()=>void) >

export interface IkeyHelpersParams {
	'enter' : IkeyHelpersOperator
	'enter:bottom': IkeyHelpersOperator,
	'enter:top': IkeyHelpersOperator,
	'tab': IkeyHelpersOperator,
	'tab:bottom': IkeyHelpersOperator,
	'tab:top': IkeyHelpersOperator,
}

export default function keyHelpers(keysHandlers: Partial<IkeyHelpersParams>) {

	return (e: React.KeyboardEvent<HTMLInputElement>) => {
		const target = e.currentTarget as HTMLElement
		switch (e.which) {
			case Keys.enter:
				callHandlers(keysHandlers.enter, e)
				isAtBottom(target) && callHandlers(keysHandlers['enter:bottom'], e)
				isAtTop(target) && callHandlers(keysHandlers['enter:top'], e)
				break
			case Keys.tab:
				!e.shiftKey && callHandlers(keysHandlers.tab, e)
				!e.shiftKey && isAtBottom(target) && callHandlers(keysHandlers['tab:bottom'], e)
				!e.shiftKey && isAtTop(target) && callHandlers(keysHandlers['tab:top'], e)
				break
		}
	}
}


export function focusInput(input: any) {
	setTimeout(() => {
		if (input && input.input && typeof input.input.focus === 'function') {
			input.input.focus()
		} else if (input && typeof input.focus === 'function') {
			input.focus()
		}
	}, 10)
}