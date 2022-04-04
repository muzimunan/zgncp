import Layout from '@/page/index/'

export default [
  {
    path: '/entity/estate/index',
    component: Layout,
    redirect: '/entity/estate/index',
      children: [
        {
          path: '/entity/estate/index',
          name: '物业档案',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/estate/index')
        },
        {
          path: '/eatate/detail',
          name: '物业息详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/estate/components/detail'),
        }]
  },
  {
    path: '/entity/merchant/index',
    component: Layout,
    redirect: '/entity/merchant/index',
      children: [
        {
          path: '/entity/merchant/index',
          name: '商户档案',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/merchant/index')
        },
        {
          path: '/merchant/detail',
          name: '商户详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/merchant/components/detail'),
        }]
  },
  {
    path: '/entity/investor/index',
    component: Layout,
    redirect: '/entity/investor/index',
      children: [
        {
          path: '/entity/investor/index',
          name: '业主档案',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/investor/index')
        },
        {
          path: '/investor/detail',
          name: '业主详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/investor/components/detail'),
        }]
  },
  {
    path: '/entity/trader/index',
    component: Layout,
    redirect: '/entity/trader/index',
      children: [
        {
          path: '/entity/trader/index',
          name: '采购商管理',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/trader/index')
        },
        {
          path: '/trader/detail',
          name: '采购商详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/trader/components/detail'),
        }]
  },
  {
    path: '/entity/salesContract/index',
    component: Layout,
    redirect: '/entity/salesContract/index',
      children: [
        {
          path: '/entity/salesContract/index',
          name: '销售合同管理',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/salesContract/index')
        },
        {
          path: '/salesContract/detail',
          name: '销售合同详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/salesContract/components/detail'),
        }]
  },
{
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    component: () =>
      import(/* webpackChunkName: "views" */ '@/views/admin/user/info')
  }]
}, {
  path: '/activti',
  component: Layout,
  redirect: '/activti/detail',
  children: [{
    path: 'detail/:id',
    component: () =>
      import(/* webpackChunkName: "views" */ '@/views/activiti/detail')
  }]
}, 
// 物业档案管理(crud页面)
// {
//   path: '/eatate/detail',
//   component: Layout,
//   redirect: '/eatate/detail',
//   children: [{
//     path: '/eatate/detail',
//     //name: '物业档案信息',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/estate/components/detail')
//   }]
// },
// 业主管理(crud页面)
// {
//   path: '/investor/detail',
//   component: Layout,
//   redirect: '/investor/detail',
//   children: [{
//     path: '/investor/detail',
//    // name: '业主档案信息',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/investor/components/detail')
//   }]
// },
// 商户管理(crud页面)
// {
//   path: '/merchant/detail',
//   component: Layout,
//   redirect: '/merchant/detail',
//   children: [{
//     path: '/merchant/detail',
//     meta: {
//       keepAlive: true,
//       isTab: true,
//       isAuth: false
//     },
//    // name: '商户档案信息',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/merchant/components/detail')
//   }]
// },
// 采购商管理(crud页面)
// {
//   path: '/trader/detail',
//   component: Layout,
//   redirect: '/trader/detail',
//   children: [{
//     path: '/trader/detail',
//    // name: '采购商档案信息',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/trader/components/detail')
//   }]
// },
// 销售合同(crud页面)
// {
//   path: '/salesContract/detail',
//   component: Layout,
//   redirect: '/salesContract/detail',
//   children: [{
//     path: '/salesContract/detail',
//    // name: '销售合同信息',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/salesContract/components/detail')
//   }]
// },
// 出租登记(crud页面)
// {
//   path: '/rentForm/detail',
//   component: Layout,
//   redirect: '/rentForm/detail',
//   children: [{
//     path: '/rentForm/detail',
//    // name: '出租登记信息',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/rentForm/components/detail')
//   }]
// },
// 租赁合同(crud页面)
// {
//   path: '/rentContract/detail',
//   component: Layout,
//   redirect: '/rentContract/detail',
//   children: [{
//     path: '/rentContract/detail',
//     //name: '租赁合同信息',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/rentContract/components/detail')
//   }]
//   },
  {
    path: '/entity/rentContract/index',
    component: Layout,
    redirect: '/entity/rentContract/index',
      children: [
        {
          path: '/entity/rentContract/index',
          name: '出租合同管理',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/rentContract/index')
        },
        {
          path: '/rentContract/detail',
          name: '出租合同详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/rentContract/components/detail'),
        }]
  },
// 收费管理 - 费用账单
// {
//   path: '/feeBill/detail',
//   component: Layout,
//   redirect: '/feeBill/detail',
//   children: [{
//     path: '/feeBill/detail',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/feeBill/components/detail')
//   }]
// },
// 收费管理 - 合约收费
// {
//   path: '/feePay/detail',
//   component: Layout,
//   redirect: '/feePay/detail',
//   children: [{
//     path: '/feePay/detail',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/feePay/components/detail')
//   }]
//   },
  {
    path: '/entity/feePay/index',
    component: Layout,
    redirect: '/entity/feePay/index',
      children: [
        {
          path: '/entity/feePay/index',
          name: '合约收费管理',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/feePay/index')
        },
        {
          path: '/feePay/detail',
          name: '合约收费详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/feePay/components/detail'),
        }]
  },
// 收费管理 - 临时收费
// {
//   path: '/feePayTemp/detail',
//   component: Layout,
//   redirect: '/feePayTemp/detail',
//   children: [{
//     path: '/feePayTemp/detail',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/feePayTemp/components/detail')
//   }]
//   },
  {
    path: '/entity/feePayTemp/index',
    component: Layout,
    redirect: '/entity/feePayTemp/index',
      children: [
        {
          path: '/entity/feePayTemp/index',
          name: '临时收费管理',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/feePayTemp/index')
        },
        {
          path: '/feePayTemp/detail',
          name: '临时收费详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/feePayTemp/components/detail'),
        }]
  },
// 收费管理 - 退费单
// {
//   path: '/feeBack/detail',
//   component: Layout,
//   redirect: '/feeBack/detail',
//   children: [{
//     path: '/feeBack/detail',
//     component: () =>
//       import(/* webpackChunkName: "views" */ '@/views/entity/feeBack/components/detail')
//   }]
//   },
  {
    path: '/entity/feeBack/index',
    component: Layout,
    redirect: '/entity/feeBack/index',
      children: [
        {
          path: '/entity/feeBack/index',
          name: '退费单管理',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */ '@/views/entity/feeBack/index')
        },
        {
          path: '/feeBack/detail',
          name: '退费单详情',
          meta: {
            keepAlive: true,
          },
          component: () =>
            import(/* webpackChunkName: "views" */'@/views/entity/feeBack/components/detail'),
        }]
  },
// 租赁看板 - 详情
{
  path: '/floorDetail',
  component: Layout,
  redirect: '/floorDetail',
  children: [{
    path: '/floorDetail',
    component: () =>
      import(/* webpackChunkName: "views" */ '@/components/FloorDetail')
  }]
},
// svg在线编辑页面
{
  path: '/building/editsvg',
  component: Layout,
  redirect: '/building/editsvg',
  children: [{
    path: '/building/editsvg',
    component: () =>
      import(/* webpackChunkName: "views" */ '@/views/entity/building/components/editsvg')
  }]
}
]
