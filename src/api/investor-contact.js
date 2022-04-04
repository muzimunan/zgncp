import request from '@/router/axios'

export function fetchContactList(query) {
  return request({
    url: '/entity/investorcontact/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/investorcontact',
    method: 'post',
    data: obj
  })
}

export function getContactObj(id) {
  return request({
    url: '/entity/investorcontact/' + id,
    method: 'get'
  })
}
// 删除联系人
export function delContactObj(id) {
  return request({
    url: '/entity/investorcontact/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/investorcontact',
    method: 'put',
    data: obj
  })
}
