
import request from '@/router/axios'
// 查询该市场下所有的楼号和层号
export function fetchBuildingNumList() {
  return request({
    url: '/entity/market-svg/buildingnum',
    method: 'get'
  })
}
// 查询区域下或者楼号下所有的层
export function fetchFloorInfoList(params) {
  return request({
    url: '/entity/market-svg/floordata',
    method: 'get',
    params
  })
}
