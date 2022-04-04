import request from '@/router/axios'

// 获取物业类型下拉框
export function getEstateTypeList() {
  return request({
    url: '/entity/estatetype/getList',
    method: 'get'
  })
}
// 物业类型分页
export function fetchList(query) {
  return request({
    url: '/entity/estatetype/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/entity/estatetype',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/entity/estatetype/' + id,
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
    url: '/entity/estatetype',
    method: 'put',
    data: obj
  })
}
// 查询计费项列表
export function fetchChargeList(id) {
  return request({
    url: '/entity/feeitemestatetype/getList/' + id,
    method: 'get'
  })
}
// 新增计费项
export function addChargeObj(obj) {
  return request({
    url: '/entity/feeitemestatetype',
    method: 'post',
    data: obj
  })
}
// 修改计费项
export function putChargeObj(obj) {
  return request({
    url: '/entity/feeitemestatetype',
    method: 'put',
    data: obj
  })
}
// 删除计费项
export function delChargeObj(id) {
  return request({
    url: '/entity/feeitemestatetype/' + id,
    method: 'delete'
  })
}
// 收费科目列表
export function fetchFeeItemList() {
  return request({
    url: '/entity/feeitem/getList',
    method: 'get'
  })
}
