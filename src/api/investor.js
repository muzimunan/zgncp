
import request from '@/router/axios'
// 根据编码或者名称查询业主档案
export function getRemoteInvestorList(params) {
  return request({
    url: '/entity/investor/queryByPO',
    method: 'get',
    params
  })
}
export function fetchList(query) {
  return request({
    url: '/entity/investor/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/investor',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/investor/' + id,
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
    url: '/entity/investor',
    method: 'put',
    data: obj
  })
}
