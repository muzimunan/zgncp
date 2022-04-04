import request from '@/router/axios'
export function fetchList(query) {
  return request({
    url: '/entity/van/list',
    method: 'get',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/entity/van',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/van/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/van/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/van',
    method: 'put',
    data: obj
  })
}
export function getOwnerType(ownerType) {
  return request({
    url: '/entity/van/listUser/' + ownerType,
    method: 'get'
  })
}

