import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/merchantpaper/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/merchantpaper',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/merchantpaper/' + id,
    method: 'get'
  })
}
// 删除联系人
export function delObj(id) {
  return request({
    url: '/entity/merchantpaper/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/merchantpaper',
    method: 'put',
    data: obj
  })
}
