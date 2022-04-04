
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/salescontract/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/salescontract',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/salescontract/' + id,
    method: 'get'
  })
}

// export function delObj(id) {
//   return request({
//     url: '/generator/org/' + id,
//     method: 'delete'
//   })
// }

export function putObj(obj) {
  return request({
    url: '/entity/salescontract',
    method: 'put',
    data: obj
  })
}
