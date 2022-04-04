import request from '@/router/axios'

export function fetchDataByPage(query) {
  return request({
    url: '/entity/feeitem/page',
    method: 'get',
    params: query
  })
}

// 根据编码或者名称查询收费科目列表（淘汰）
export function getRemoteFeeitemList(params) {
  return request({
    url: '/entity/feeitem/getList',
    method: 'get',
    params
  })
}
// 获取收费项目的下拉列表
export function fetchFeeItemList() {
  return request({
    url: '/entity/feeitem/getList',
    method: 'get'
  })
}
// 获取收费项目的下拉列表(合约收费专用)
export function getListByKindsType(kindsType) {
  return request({
    url: '/entity/feeitem/getListByKindsType/' + kindsType,
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: '/entity/feeitem',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/feeitem/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/entity/feeitem/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/entity/feeitem',
    method: 'put',
    data: obj
  })
}
// 获取收费科目下拉列表（KF02车辆类型KF01费用名称）
export function getItemList(itemCode) {
  return request({
    url: '/entity/feeitem/getList/' + itemCode,
    method: 'get'
  })
}
// 获取收费科目下拉列表（用于：添加收/退费明细）
export function getSelectFeeitemList(data) {
  return request({
    url: '/entity/feeitem/getFeeitemList',
    method: 'post',
    data
  })
}
// 根据运营科目id查询收费项目下拉列表
export function getFeeItemListByKindsId(kindsId) {
  return request({
    url: '/entity/feeitem/getList/1/' + kindsId,
    method: 'get'
  })
}

