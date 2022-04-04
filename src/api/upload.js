import request from '@/router/axios'
// 文件上传
export function importFile(data) {
  return request({
    url: '/admin/sys-file/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq'
    }
  })
}
// 数据导入 file:excel文件; type:investor业主、merchant商户、salescontract销售合同、estate物业档案
export function importExcel(data) {
  return request({
    url: '/entity/template/import',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarynl6gT1BKdPWIejNq'
    }
  })
}
