
import request from '@/router/axios'
// 根据编码或者名称查询业主档案
export function getRemoteFeekindsfinanceList() {
  return request({
    url: '/entity/financekinds/getList',
    method: 'get'
  })
}
export function fetchList(query) {
  return request({
    url: '/entity/financekinds/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/financekinds',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/financekinds/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/financekinds/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/financekinds',
    method: 'put',
    data: obj
  })
}
