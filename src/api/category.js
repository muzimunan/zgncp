import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/category/page',
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
    url: '/entity/category',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/category/' + id,
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
    url: '/entity/category',
    method: 'put',
    data: obj
  })
}

// 获取主营品类下拉列表
export function getSelectKindsList(level) {
  return request({
    url: '/entity/category/getList/' + level,
    method: 'get'
  })
}
// 获取主营品类下拉列表
export function getSelectKindsByParentId(parentId) {
  return request({
    url: '/entity/category/listByParentId/' + parentId,
    method: 'get'
  })
}
