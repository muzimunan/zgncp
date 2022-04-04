import request from '@/router/axios'
// 区域下拉框
export function getSelectAreaList(level) {
  return request({
    url: '/entity/area/getList/' + level,
    method: 'get'
  })
}
export function fetchList(query) {
  return request({
    url: '/entity/area/page',
    method: 'get',
    params: query
  })
}
// 业务管理员
export function fetchUserList() {
  return request({
    url: '/admin/user/all',
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: '/entity/area',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/area/' + id,
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
    url: '/entity/area',
    method: 'put',
    data: obj
  })
}

