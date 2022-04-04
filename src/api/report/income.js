import request from '@/router/axios'
export function fetchList(query) {
  return request({
    url: '/entity/weekincome/list',
    method: 'get',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/entity/weekincome',
    method: 'post',
    data: obj
  })
}
export function putObj(obj) {
  return request({
    url: '/entity/weekincome',
    method: 'put',
    data: obj
  })
}
