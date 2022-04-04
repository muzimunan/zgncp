/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/pay/payorder/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/pay/payorder',
    method: 'post',
    data: obj
  })
}

export function getObj(orderId) {
  return request({
    url: '/pay/payorder/' + orderId,
    method: 'get'
  })
}

export function delObj(orderId) {
  return request({
    url: '/pay/payorder/' + orderId,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/pay/payorder',
    method: 'put',
    data: obj
  })
}
// 收费编码获取缴费成功列表
export function queryListByFeeCode(feeCode) {
  return request({
    url: '/pay/payorder/listByFeeCode/' + feeCode,
    method: 'get'
  })
}
