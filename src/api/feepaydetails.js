
import request from '@/router/axios'
// 收费单明细
export function fetchList(query) {
  return request({
    url: '/entity/feepaydetails/page',
    method: 'get',
    params: query
  })
}
export function fetchfeePayDetailList(query) {
  return request({
    url: '/entity/feepaydetails/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feepaydetails',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feepaydetails/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/feepaydetails/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feepaydetails',
    method: 'put',
    data: obj
  })
}
// 通过费用单带入收费单明细
export function getListByFeeItem(data) {
  return request({
    url: '/entity/feebilldetails/getList',
    method: 'post',
    data
  })
}
// 批量新增收费单明细
export function addObjBath(obj) {
  return request({
    url: '/entity/feepaydetails/saveBath',
    method: 'post',
    data: obj
  })
}
// 收款登记
export function chargeRegistration(data) {
  return request({
    url: '/entity/feepaydetails/chargeRegistration',
    method: 'post',
    data
  })
}
// 查询合同收费单明细对象（打印数据展示）
export function queryPrintDetail(data) {
  return request({
    url: '/entity/feepaydetails/feePayDetailPrint',
    method: 'post',
    data
  })
}
// 根据收费单据明细编码查询收费单据明细详情
export function queryFeepayDetail(params) {
  return request({
    url: '/entity/feepaydetails/listCharged',
    method: 'get',
    params
  })
}
