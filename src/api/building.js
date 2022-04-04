import request from '@/router/axios'
// 获取楼层的下拉框（level：楼层的级次最多3级(0楼,1层,2块)）
export function getSelectBuildingList(level) {
  return request({
    url: '/entity/building/getList/' + level,
    method: 'get'
  })
}
// 分页查询
export function fetchList(query) {
  return request({
    url: '/entity/building/page',
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
    url: '/entity/building',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/building/' + id,
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
    url: '/entity/building',
    method: 'put',
    data: obj
  })
}

