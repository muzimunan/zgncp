import store from '@/store'

export function beforeWeek() {
  return getYearWeek() - 3 <= 0 ? 1 : getYearWeek() - 3
}
// 获取运营部的当前年
export function getYearByWeek() {
  return store.getters.userInfo.yearByWeek
}
// 获取当前日期是当年的第几周
export function getYearWeek() {
  return store.getters.userInfo.week
}
// 获取报表中的周对应的年
export function reportCurrentYear() {
  return store.getters.userInfo.yearByWeek + ''
}
export function selectWeekList() {
  const weelList = []
  for (let i = 0; i < 52; i++) {
    weelList.push({
      value: i + 1,
      label: '第' + (i + 1) + '周'
    })
  }
  return weelList
}
export function formatDate(value) {
  const date = new Date(value)
  const y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? ('0' + MM) : MM
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let m = date.getMinutes()
  m = m < 10 ? ('0' + m) : m
  let s = date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
}
