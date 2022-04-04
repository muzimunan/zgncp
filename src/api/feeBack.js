
import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/entity/feeback/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/feeback',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feeback/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/feeback/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feeback',
    method: 'put',
    data: obj
  })
}
// 打印收费单数据列表回显
export function putfeeBackPrintObj(data) {
  return request({
    url: '/entity/feeback/feeBackPrint',
    method: 'post',
    data
  })
}
