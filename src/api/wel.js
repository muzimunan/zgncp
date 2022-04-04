import request from '@/router/axios'
// 收费概况
export function getFeeIncomeList() {
  return request({
    url: '/entity/home/feeIncome/list',
    method: 'get'
  })
}
// 按租赁面积十大商户
export function getMerchantTopList() {
  return request({
    url: '/entity/home/merchantTop/list',
    method: 'get'
  })
}
// 商户业主概况
export function getMerchantinvestorList() {
  return request({
    url: '/entity/home/merchantinvestor/list',
    method: 'get'
  })
}
// 提醒列表
export function getRemindList(type) {
  return request({
    url: '/entity/home/remind/list/' + type,
    method: 'get'
  })
}
// 交易概况
export function getTradeList() {
  return request({
    url: '/entity/home/trade/list',
    method: 'get'
  })
}
