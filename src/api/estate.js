import request from '@/router/axios'
// 根据编码或者名称查询物业档案
export function getRemoteEstateList(params) {
  return request({
    url: '/entity/estate/queryByPO',
    method: 'get',
    params
  })
}

export function fetchList(query) {
  return request({
    url: '/entity/estate/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/estate',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/estate/' + id,
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
    url: '/entity/estate',
    method: 'put',
    data: obj
  })
}
// 状态变更
export function updateStatus(obj) {
  return request({
    url: '/entity/estate/updateStatus',
    method: 'post',
    data: obj
  })
}
