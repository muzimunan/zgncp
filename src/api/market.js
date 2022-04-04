import request from '@/router/axios'
// 登录页面获取市场信息的下拉列表
export function getSelectMarketList() {
  return request({
    url: '/entity/market/simpleList',
    method: 'get'
  })
}
// 查询市场期的下拉框
export function getMarketPeriod(id) {
  return request({
    url: '/entity/market/period/' + id,
    method: 'get'
  })
}
