
import request from '@/router/axios'
// 根据编码或者名称查询商户档案
export function getRemoteMerchantList(params) {
  return request({
    url: '/entity/merchant/queryByPO',
    method: 'get',
    params
  })
}
export function fetchList(query) {
  return request({
    url: '/entity/merchant/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/merchant',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/merchant/' + id,
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
    url: '/entity/merchant',
    method: 'put',
    data: obj
  })
}
