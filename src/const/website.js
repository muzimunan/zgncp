export default {
  title: '中国农批大数据服务平台',
  subtitle: '中农批',
  copyright: '© 2021中国供销农产品批发市场控股有限公司',
  isFirstPage: true, // 配置首页不可关闭
  key: 'entity', // 配置主键,目前用于存储
  whiteList: ['/login', '/forgetPwd', '/404', '/401', '/lock'], // 配置无权限可以访问的页面
  whiteTagList: ['/login', '/forgetPwd', '/404', '/401', '/lock'], // 配置不添加tags页面 （'/advanced-router/mutative-detail/*'——*为通配符）
  // fistPage: {
  //   label: '首页',
  //   value: '/wel/index',
  //   params: {},
  //   query: {},
  //   group: [],
  //   close: false
  // },
  fistPage: {
    label: '物业档案',
    value: '/entity/estate/index',
    params: {},
    query: {},
    group: [],
    close: false
  },
  // 配置菜单的属性
  menu: {
    props: {
      label: 'label',
      path: 'path',
      icon: 'icon',
      children: 'children'
    }
  }
}
