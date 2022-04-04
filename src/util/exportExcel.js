import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import store from '@/store'
export function exportExcel(excelType, tableObj) {
  const excelName = getExcelTypeName(excelType)
  try {
    const $e = tableObj
    let $table = $e.querySelector('.el-table__fixed')
    if (!$table) {
      $table = $e
    }

    const wb = XLSX.utils.table_to_book($table, { raw: true })
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `${excelName}.xlsx`
    )
  } catch (e) {
    if (typeof console !== 'undefined') console.error(e)
  }
}
function getExcelTypeName(excelType) {
  const excelTypeMap = {
    'weekCar': '车辆型号流量统计',
    'doorRate': '开门率明细',
    'weekTrade': '交易统计',
    'incomeDetail': '收费统计',
    'salesReturn': '销售回款',
    'estateRent': '物业租赁跟踪报表',
    'weekSales0': '销售跟踪-合计',
    'weekSales1': '销售跟踪-商铺',
    'weekSales3': '销售跟踪-公寓',
    'weekSales2': '销售跟踪-办公',
    'standingBookDetail': '中国农批' + store.getters.userInfo.marketName + store.getters.userInfo.yearByWeek + '年物业租赁台账明细表',
    'standingBookReport': '中国农批' + store.getters.userInfo.marketName + store.getters.userInfo.yearByWeek + '年物业租赁台账汇总表'
  }
  return excelTypeMap[excelType] || ''
}
