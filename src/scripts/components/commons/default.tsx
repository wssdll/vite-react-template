import {PaginationProps} from 'antd/lib/pagination'
import {ProTableProps, RequestData} from '@ant-design/pro-table'
import {ModalProps} from 'antd/lib/modal'
import {UploadProps} from 'antd/lib/upload/interface'

export interface IProTableFormType {
	pageSize: number;
	current: number;
	_timestamp: number
}

export const defaultUpload: UploadProps = {
	listType: 'picture-card',
	className: 'custom-uploader'
}

export const defaultPagination: PaginationProps = {
	showSizeChanger: true,
	showQuickJumper: true,
	pageSizeOptions: ['10', '30', '50'],
	// showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
}

export const defaultTable: ProTableProps<any, any> = {
	scroll: {
		x: 1000,
		// y: 500
	},
	columnEmptyText:'',
	search: {
		collapsed: false,
		collapseRender: () => false
	}
}

export const defaultModal: ModalProps = {
	getContainer:false,
	destroyOnClose: true,
	width: 720
}

export const getEmpty: () => Promise<RequestData<any>> = () => {
	return new Promise((resolve) => {
		resolve({
			data: [],
			success: true,
			total: 0
		})
	})
}
