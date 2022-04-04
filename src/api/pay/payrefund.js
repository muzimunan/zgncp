import request from '@/router/axios'
// 收费编码获取缴费成功列表
export function payRefundHandle(data) {
  return request({
    url: '/pay/payrefund',
    method: 'post',
    data
  })
}
