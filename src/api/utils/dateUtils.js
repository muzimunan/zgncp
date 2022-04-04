import request from '@/router/axios'
// zgnp运营需要计算的当前周、年、月
export function getZgnpData() {
  return request({
    url: '/entity/systemDate/zgnpData',
    method: 'get'
  })
}
