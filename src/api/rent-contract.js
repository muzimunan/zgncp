
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/rentcontract/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/rentcontract',
    method: 'post',
    data: obj
  })
}
// 续租
export function reRentObj(data) {
  return request({
    url: '/entity/rentcontract/renewal',
    method: 'post',
    data
  })
}

export function getObj(id) {
  return request({
    url: '/entity/rentcontract/' + id,
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
    url: '/entity/rentcontract',
    method: 'put',
    data: obj
  })
}
