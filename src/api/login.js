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
import qs from 'qs'

const scope = 'server'

export const loginByUsername = (username, password, code, randomStr) => {
  const grant_type = 'password'
  const dataObj = qs.stringify({ 'username': username, 'password': password })

  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'MARKET-ID': '1',
      'Authorization': 'Basic ZW50aXR5OmVudGl0eQ=='
    },
    method: 'post',
    params: { randomStr, code, grant_type },
    data: dataObj
  })
}

export const refreshToken = (refresh_token) => {
  const grant_type = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'isToken': false,
      'MARKET-ID': '1',
      'Authorization': 'Basic ZW50aXR5OmVudGl0eQ=='
    },
    method: 'post',
    params: { refresh_token, grant_type, scope }
  })
}

export const loginByMobile = (mobile, code) => {
  const grant_type = 'mobile'
  return request({
    url: '/auth/mobile/token/sms',
    headers: {
      isToken: false,
      'MARKET-ID': '1',
      'Authorization': 'Basic ZW50aXR5OmVudGl0eQ=='
    },
    method: 'post',
    params: { mobile: 'SMS@' + mobile, code: code, grant_type }
  })
}

export const loginBySocial = (state, code) => {
  const grant_type = 'mobile'
  return request({
    url: '/auth/mobile/token/social',
    headers: {
      isToken: false,
      'MARKET-ID': '1',
      'Authorization': 'Basic ZW50aXR5OmVudGl0eQ=='
    },
    method: 'post',
    params: { mobile: state + '@' + code, grant_type }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}
// 发送短信验证码
export function verificationCode(data) {
  return request({
    url: '/admin/user/send/verificationCode',
    headers: {
      form: 'from'
    },
    method: 'post',
    data
  })
}
// 下一步
export function nextStep(data) {
  return request({
    url: '/admin/user/send/passWord',
    headers: {
      form: 'from'
    },
    method: 'post',
    data
  })
}
