import React from 'react'

import {ModalProps} from 'antd/lib/modal'
import { Modal} from 'antd'

export interface IModalOperatorOptions {
	close: () => void
}


export interface ICommonModalProps<T> extends ModalProps {
	operator?: IModalOperatorOptions
	params?: {
		[key: string]: any
		row?: Partial<T>
	}
}

const CommonModal = (props: ICommonModalProps<any>) => {
	return <Modal
		width={720}
		{...props}
	/>
}

export default CommonModal