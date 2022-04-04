import request from '@/router/axios'
// 交易统计查询
export function fetchList(query) {
  return request({
    url: '/entity/weektrade/list',
    method: 'get',
    params: query
  })
}
// 交易周数据填报
export function addObj(obj) {
  return request({
    url: '/entity/weektrade',
    method: 'post',
    data: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/entity/weektrade',
    method: 'put',
    data: obj
  })
}
