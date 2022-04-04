import request from '@/router/axios'
// 查询开门看板数据集合
export function getOpenList(params) {
  return request({
    url: '/entity/kanban/open',
    method: 'get',
    params
  })
}
export function updateOpenStatus(data) {
  return request({
    url: '/entity/kanban/open/status',
    method: 'post',
    data
  })
}
// 点击图片查看详情
export function kanbanView(params) {
  return request({
    url: '/entity/kanban/view/detail',
    method: 'get',
    params
  })
}
// 看板统计 begin
// 租赁统计
export function queryStatisticsByRent(params) {
  return request({
    url: '/entity/kanban/view/statistics/rent',
    method: 'get',
    params
  })
}
// 销售统计
export function queryStatisticsBySale(params) {
  return request({
    url: '/entity/kanban/view/statistics/sale',
    method: 'get',
    params
  })
}
// 开门统计
export function queryStatisticsByOpen(params) {
  return request({
    url: '/entity/kanban/view/statistics/open',
    method: 'get',
    params
  })
}
// 业态统计
export function queryStatisticsByKinds(params) {
  return request({
    url: '/entity/kanban/view/statistics/kinds',
    method: 'get',
    params
  })
}
// 看板统计 end
