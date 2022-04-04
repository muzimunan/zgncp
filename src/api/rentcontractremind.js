import request from '@/router/axios'
// 合约收费提醒
export function fetchList(params) {
  return request({
    url: '/entity/rentcontractremind/page',
    method: 'get',
    params
  })
}
// 合约收费提醒处理
export function handleRentcontractremind(data) {
  return request({
    url: '/entity/rentcontractremind',
    method: 'put',
    data
  })
}
