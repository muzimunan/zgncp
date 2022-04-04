
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/feepaydetailsale/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feepaydetailsale',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feepaydetailsale/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/feepaydetailsale/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feepaydetailsale',
    method: 'put',
    data: obj
  })
}
