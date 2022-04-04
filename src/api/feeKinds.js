import request from '@/router/axios'

export function fetchDataByPage(query) {
  return request({
    url: '/entity/feekinds/page',
    method: 'get',
    params: query
  })
}

export function fetchDataByList() {
  return request({
    url: '/entity/feekinds/getList',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feekinds',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feekinds/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/org/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feekinds',
    method: 'put',
    data: obj
  })
}

