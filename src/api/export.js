import download from '@/router/download'
// 台账明细全部导出
export function exportRentstandingbook(params) {
  return download({
    url: '/entity/rentstandingbook/export/detail',
    method: 'get',
    params
  })
}

// 下载模板（物业管理）
export function exportEstate() {
  return download({
    url: '/entity/template/download/estate',
    method: 'get'
  })
}
// 下载模板（物业出租合同大表关系）
export function exportEstateRentcontract() {
  return download({
    url: '/entity/template/download/estaterent',
    method: 'get'
  })
}
// 下载模板（物业销售合同大表关系管理）
export function exportEstateSalecontract() {
  return download({
    url: '/entity/template/download/estatesale',
    method: 'get'
  })
}
// 下载模板（业主管理）
export function exportInvestor() {
  return download({
    url: '/entity/template/download/investor',
    method: 'get'
  })
}
// 下载模板（销售合同管理）
export function exportSalesContract() {
  return download({
    url: '/entity/template/download/salescontract',
    method: 'get'
  })
}
// 下载模板（商户管理）
export function exportMerchant() {
  return download({
    url: '/entity/template/download/merchant',
    method: 'get'
  })
}
// 下载模板（租赁合同管理）
export function exportRentcontract() {
  return download({
    url: '/entity/template/download/rentcontract',
    method: 'get'
  })
}
// 导出商户数据
export function exportMerchantData(params) {
  return download({
    url: '/entity/merchant/export',
    method: 'get',
    params
  })
}
// 导出物业数据
export function exportEstateData(params) {
  return download({
    url: '/entity/estate/export',
    method: 'get',
    params
  })
}
export function exportExcelCb(content, fileName) {
  // 将二进制流转为blob
  // type:application/vnd.ms-excel对应的是xls
  // type:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 对应的是xlsx
  const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(fileName))
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(fileName))
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}
