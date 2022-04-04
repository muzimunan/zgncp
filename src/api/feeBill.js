import request from '@/router/axios'

export function fetchDataByPage(query) {
  return request({
    url: '/entity/feebill/page',
    method: 'get',
    params: query
  })
}

export function fetchDataByList() {
  return request({
    url: '/entity/feebill/getList',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feebill',
    method: 'post',
    data: obj
  })
}

export function fetchDataById(id) {
  return request({
    url: '/entity/feebill/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/feebill/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feebill',
    method: 'put',
    data: obj
  })
}

export function deactiveFeebill(id) {
  return request({
    url: '/entity/feebill/setStateFailure/' + id,
    method: 'get'
  })
}

export function fetchDetailByPage(query) {
  return request({
    url: '/entity/feebilldetails/page',
    method: 'get',
    params: query
  })
}

export function fetchDetailByList() {
  return request({
    url: '/entity/feebilldetails/getList',
    method: 'get'
  })
}

export function addDetail(obj) {
  return request({
    url: '/entity/feebilldetails',
    method: 'post',
    data: obj
  })
}

export function fetchDetailById(id) {
  return request({
    url: '/entity/feebilldetails/' + id,
    method: 'get'
  })
}

export function delDetailById(id) {
  return request({
    url: '/entity/feebilldetails/' + id,
    method: 'delete'
  })
}

export function putDetail(obj) {
  return request({
    url: '/entity/feebilldetails',
    method: 'put',
    data: obj
  })
}
// 校验费用账单是否和收费单或者退费单关联
export function checkStateFailure(data) {
  return request({
    url: '/entity/feebill/checkStateFailure',
    method: 'post',
    data
  })
}

