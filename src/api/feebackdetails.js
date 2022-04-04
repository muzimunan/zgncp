
import request from '@/router/axios'
// 收费单明细
export function fetchList(query) {
  return request({
    url: '/entity/feebackdetails/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feebackdetails',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feebackdetails/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/feebackdetails/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feebackdetails',
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
    url: '/entity/feebackdetails/saveBath',
    method: 'post',
    data: obj
  })
}
// 退款登记
export function chargeRegistration(data) {
  return request({
    url: '/entity/feebackdetails/refundRegistration',
    method: 'post',
    data
  })
}
