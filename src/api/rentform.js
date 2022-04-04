
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/rentform/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/rentform',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/rentform/' + id,
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
    url: '/entity/rentform',
    method: 'put',
    data: obj
  })
}
// 作废
export function updateStatus(data) {
  return request({
    url: '/entity/rentform/invalid',
    method: 'put',
    data
  })
}
// 快速生成收费项目
export function genFeeForm(data) {
  return request({
    url: '/entity/feeform/genFeeForm',
    method: 'put',
    data
  })
}