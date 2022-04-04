import request from '@/router/axios'
// 车辆
export function fetchCarList(query) {
  return request({
    url: '/entity/weekvan/list',
    method: 'get',
    params: query
  })
}
// 交易
export function fetchTradeList(query) {
  return request({
    url: '/entity/investor/page',
    method: 'get',
    params: query
  })
}
// 运营
export function fetchIncomeList(query) {
  return request({
    url: '/entity/investor/page',
    method: 'get',
    params: query
  })
}
// 开门
export function fetchOpenDoorList(query) {
  return request({
    url: '/entity/investor/page',
    method: 'get',
    params: query
  })
}
