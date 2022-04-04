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

import { rule } from '@/util/validateRules'

// import { getObj } from '@/api/area'

// var validateParam = (rule, value, callback) => {
//   getObj(value).then(response => {
//     if (window.boxType === 'edit') callback()
//     const result = response.data.data
//     if (result !== null) {
//       callback(new Error('参数键已经存在'))
//     } else {
//       callback()
//     }
//   })
// }

export const tableOption = {
  title: '表格的标题',
  titleSize: 'h3',
  titleStyle: {
    color: 'red'
  },
  border: true,
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  editBtn: true,
  delBtn: false,
  viewBtn: true,
  saveBtnTitle: '新增机构',
  updateBtnTitle: '修改机构',
  column: [
    {
      label: '机构编码',
      prop: 'code',
      rules: [
        { required: true, message: '请输入机构编码', trigger: 'blur' }
      ]
    },
    {
      label: '机构名称',
      search: true,
      prop: 'codName',
      rules: [
        { required: true, message: '请输机构名称', trigger: 'blur' },
        { max: 20, message: '字数不能超过20个汉字', trigger: 'blur' },
        { validator: rule.validatorNameCn, trigger: 'blur' }
      ]
    },
    {
      label: '级别',
      prop: 'level',
      type: 'select',
      dicUrl: '/admin/dict/type/level_type',
      rules: [{
        required: true, message: '请选择级别', trigger: 'blur'
      }],
      search: true
    },
    {
      label: '所在地区',
      prop: 'region',
      type: 'cascader',
      dicUrl: '/admin/dict/type/level_type',
      rules: [{
        required: true, message: '请选择级别', trigger: 'blur'
      }],
      hide: true
    },
    {
      label: '详细地址',
      prop: 'address',
      span: 24,
      hide: true,
      rules: [{
        required: true, message: '请输入机构所在的详细地址', trigger: 'blur'
      }]
    },
    {
      label: '联系人',
      prop: 'contactor',
      rules: [{
        required: true, message: '请输入联系人姓名', trigger: 'blur'
      }]
    },
    {
      label: '联系电话',
      prop: 'phone',
      rules: [
        { required: true, message: '请输入正确的电话', trigger: 'blur' },
        { validator: function(rule, value, callback) {
          if (/^1[34578]\d{9}$/.test(value) === false) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        }, trigger: 'blur' }
      ]
    },
    {
      label: '备注',
      prop: 'remark',
      type: 'textarea',
      span: 24,
      hide: true
    },
    {
      label: '创建人',
      prop: 'createBy',
      hide: true,
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: '创建时间',
      prop: 'createTime',
      hide: true,
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: '修改人',
      prop: 'updateBy',
      hide: true,
      addVisdiplay: false,
      editVisdiplay: false
    },
    {
      label: '修改时间',
      prop: 'updateTime',
      hide: true,
      addVisdiplay: false,
      editVisdiplay: false
    }
  ]
}
