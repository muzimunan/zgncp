import request from '@/router/axios'
export function fetchList(query) {
  return request({
    url: '/entity/weeksalesreturn/list',
    method: 'get',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/entity/weeksalesreturn',
    method: 'post',
    data: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/entity/weeksalesreturn',
    method: 'put',
    data: obj
  })
}
