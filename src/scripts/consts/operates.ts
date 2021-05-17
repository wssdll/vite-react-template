export const SAVE = '保存'
export const SAVE_AND_CLOSE = '保存并关闭'
export const SUBMIT = '提交'
export const SUBMIT_AND_ADD = '提交并新增'
export const OPEN = '开启'
export const CLOSE = '关闭'
export const ON = '启用'
export const OFF = '禁用'
export const MAINTAINED = '已维护'
export const UNMAINTAINED = '未维护'

export const OperateMap: { [key: string]: string } = {
    pass: '审核通过',
    refuse: '审核不通过',
    forbidden: '禁用',
    batchPass: '批量审核通过',
    batchRefuse: '批量审核不通过',
    batchEnable: '批量启用',
    batchDisable: '批量停用整改',
}

export const OperationMap: { [key: string]: string } = {
    create: '注册',
    update: '编辑',
}