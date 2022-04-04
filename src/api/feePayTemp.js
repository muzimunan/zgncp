
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/feepaytmp/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feepaytmp',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feepaytmp/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/feepaytmp/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feepaytmp',
    method: 'put',
    data: obj
  })
}
// 打印收费单数据列表回显
export function putfeePayPrintObj(data) {
  return request({
    url: '/entity/feepaytmp/feePayPrint',
    method: 'post',
    data
  })
}
// 收费单下拉框
export function getRemoteFeePayList(data) {
  return request({
    url: '/entity/feepaytmp/getList',
    method: 'post',
    data
  })
}

// 合同下来框
export function queryListContract(contractType) {
  return request({
    url: '/entity/feepaytmp/listContract/' + contractType,
    method: 'get'
  })
}
// 查询合同收费单明细对象（打印数据展示）
export function queryPrintDetail(id) {
  return request({
    url: '/entity/feepaytmp/feePayPrint/' + id,
    method: 'post'
  })
}
// 根据临时收费单据明细编码查询临时收费单据明细详情
export function queryFeepayTempDetail(feePayDetailCode) {
  return request({
    url: '/entity/feepaytmp/feepaycode/' + feePayDetailCode,
    method: 'get'
  })
}
