import request from '@/router/axios'
export function fetchList(query) {
  return request({
    url: '/entity/weekrentstatus/list',
    method: 'get',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/entity/weekrentstatus',
    method: 'post',
    data: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/entity/weekrentstatus',
    method: 'put',
    data: obj
  })
}
