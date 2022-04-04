
import request from '@/router/axios'

export function fetchList(params) {
  return request({
    url: '/entity/rentstandingbook/page',
    method: 'get',
    params
  })
}

export function fetchSumList() {
  return request({
    url: '/entity/rentstandingbook/list',
    method: 'get'
  })
}
