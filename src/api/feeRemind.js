import request from '@/router/axios'
// 合约收费提醒
export function fetchList(params) {
  return request({
    url: '/entity/feeremind/page',
    method: 'get',
    params
  })
}
// 合约收费提醒处理
export function handleFeePay(data) {
  return request({
    url: '/entity/feeremind',
    method: 'put',
    data
  })
}

