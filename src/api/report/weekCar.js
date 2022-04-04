import request from '@/router/axios'
// 车辆统计查询
export function fetchList(query) {
  return request({
    url: '/entity/weekvan/list',
    method: 'get',
    params: query
  })
}
// 车辆周数据填报
export function addObj(obj) {
  return request({
    url: '/entity/weekvan',
    method: 'post',
    data: obj
  })
}
// 车辆周数据修改或者修改历史数据
export function putObj(obj) {
  return request({
    url: '/entity/weekvan',
    method: 'put',
    data: obj
  })
}
