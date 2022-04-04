
import request from '@/router/axios'
export function fetchList(query) {
  return request({
    url: '/entity/trader/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/trader',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/trader/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/trader/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/trader',
    method: 'put',
    data: obj
  })
}
