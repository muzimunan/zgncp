
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/feepay/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feepay',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feepay/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/feepay/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feepay',
    method: 'put',
    data: obj
  })
}
// 打印收费单数据列表回显
export function putfeePayPrintObj(data) {
  return request({
    url: '/entity/feepay/feePayPrint',
    method: 'post',
    data
  })
}
// 收费单下拉框
export function getRemoteFeePayList(data) {
  return request({
    url: '/entity/feepay/getList',
    method: 'post',
    data
  })
}

// 合同下来框
export function queryListContract(contractType) {
  return request({
    url: '/entity/feepay/listContract/' + contractType,
    method: 'get'
  })
}
// 合同收费指定用户
export function feePayAssignUser(data) {
  return request({
    url: '/entity/feePayAssignUser',
    method: 'post',
    data
  })
}
// 查询合同收费列表，用于分配管理员
export function queryListByEstate(params) {
  return request({
    url: '/entity/feepay/listByEstate',
    method: 'get',
    params
  })
}
// 保证金管理
export function queryDepositList(params) {
  return request({
    url: '/entity/feepay/deposit/page',
    method: 'get',
    params
  })
}
// 欠费提醒管理
export function queryFeeDueList(params) {
  return request({
    url: '/entity/feepay/feedue/page',
    method: 'get',
    params
  })
}
