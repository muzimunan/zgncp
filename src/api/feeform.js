
import request from '@/router/axios'
export function fetchList(query) {
  return request({
    url: '/entity/feeform/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feeform',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feeform/' + id,
    method: 'get'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feeform',
    method: 'put',
    data: obj
  })
}

// 根据商户获取收费项目
export function getRemoteFeeformList(params) {
  return request({
    url: '/entity/feeform/list/' + params,
    method: 'get'
  })
}
// 【出租登记-查看详情-校验是否生成费用账单】
export function billeCheck(data) {
  return request({
    url: '/entity/feeform/generate/billeCheck',
    method: 'post',
    data
  })
}

// 【出租登记-查看详情-生成费用账单】
export function createFeeBill(data) {
  return request({
    url: '/entity/feeform/generate/bille',
    method: 'post',
    data
  })
}

