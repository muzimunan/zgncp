<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <avue-crud
        ref="crud"
        :option="tableOption"
        :data="list"
        :page.sync="page"
        v-model="form"
        :table-loading="listLoading"
        :before-open="handleOpenBefore"
        @on-load="getList"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="update"
        @row-save="create"
      >
        <template slot="menuLeft">
          <el-button
            v-if="roleManager_btn_add"
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="handleCreate"
          >
            新增
          </el-button>
        </template>
        <template slot="dsScopeForm">
          <div v-if="form.dsType == 1">
            <el-tree
              ref="scopeTree"
              :data="dsScopeData"
              :check-strictly="true"
              :props="defaultProps"
              :default-checked-keys="checkedDsScope"
              class="filter-tree"
              node-key="id"
              highlight-current
              show-checkbox
            />
          </div>
        </template>

        <template slot="menu" slot-scope="scope">
          <el-button
            v-if="roleManager_btn_edit"
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, scope.index)"
          >
            修改
          </el-button>
          <el-button
            v-if="roleManager_btn_del"
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row, scope.index)"
          >
            删除
          </el-button>
          <el-button
            v-if="roleManager_btn_perm"
            type="text"
            size="small"
            icon="el-icon-plus"
            @click="handlePermission(scope.row, scope.index)"
          >
            功能权限
          </el-button>
          <el-button
            v-if="roleManager_btn_data_perm"
            type="text"
            size="small"
            icon="el-icon-plus"
            @click="handleDataPermission(scope.row, scope.index)"
          >
            数据权限
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog :visible.sync="dialogPermissionVisible" :close-on-click-modal="false" title="分配功能权限">
      <div class="dialog-main-tree">
        <el-tree
          ref="menuTree"
          :data="treeData"
          :default-checked-keys="checkedKeys"
          :check-strictly="false"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          node-key="id"
          highlight-current
          show-checkbox
          default-expand-all
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="updatePermession(roleId)">更 新</el-button>
        <el-button type="default" size="small" @click="cancal()">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogDataPermissionVisible" :close-on-click-modal="false" title="分配数据权限">
      <div>
        <el-form ref="formParams" :model="formParams" label-position="right" label-width="100px">
          <el-row :gutter="20">
            <el-col :md="24" :lg="24">
              <el-form-item label="物业类型">
                <el-checkbox
                  :indeterminate="isEstateIndeterminate"
                  v-model="checkEstateAll"
                  @change="handleCheckEstateAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group v-model="formParams.estateTypeArr" @change="handleCheckedEstateChange">
                  <el-checkbox v-for="item in selectOptions.estateTypeList" :key="item.id" :label="item.id">
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="24">
              <el-form-item label="业态">
                <el-checkbox
                  :indeterminate="isKindsIndeterminate"
                  v-model="checkKindsAll"
                  @change="handleCheckKindsAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group v-model="formParams.kindsArr" @change="handleCheckedKindsChange">
                  <el-checkbox v-for="item in selectOptions.kindsList" :key="item.id" :label="item.id">
                    {{ item.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="24">
              <el-form-item label="楼层">
                <el-checkbox
                  :indeterminate="isBuildingIndeterminate"
                  v-model="checkBuildingAll"
                  @change="handleCheckBuildingAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox-group v-model="formParams.buildingArr" @change="handleCheckedBuildingChange">
                  <el-checkbox
                    v-for="(item, index) in selectOptions.buildingList"
                    :key="index"
                    :label="item.id"
                  >
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="updateDataPermession(roleId)">更 新</el-button>
        <el-button type="default" size="small" @click="cancal()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, fetchRoleTree, permissionUpd, putObj, getRoleDataScope, saveRoleDataScope } from '@/api/admin/role'
import { tableOption } from '@/const/crud/admin/role'
import { fetchTree } from '@/api/admin/dept'
import { fetchMenuTree } from '@/api/admin/menu'
import { mapGetters } from 'vuex'
import { getSelectKindsList } from '@/api/category'
import { getSelectBuildingList } from '@/api/building'
import { getEstateTypeList } from '@/api/estate-type'
export default {
  name: 'TableRole',
  data() {
    return {
      searchForm: {},
      tableOption: tableOption,
      dsScopeData: [],
      treeData: [],
      checkedKeys: [],
      checkedDsScope: [],
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      menuIds: '',
      list: [],
      listLoading: true,
      form: {},
      roleId: undefined,
      roleCode: undefined,
      rolesOptions: undefined,
      dialogPermissionVisible: false,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false,
      roleManager_btn_data_perm: false,
      dialogDataPermissionVisible: false,
      selectOptions: {
        estateTypeList: [], // 物业类型
        buildingList: [], // 楼号集合
        kindsList: [] // 业态数据列表
      },
      formParams: {
        estateTypeArr: [],
        buildingArr: [],
        kindsArr: []
      },
      checkEstateAll: false,
      isEstateIndeterminate: true,
      checkBuildingAll: false,
      isBuildingIndeterminate: true,
      checkKindsAll: false,
      isKindsIndeterminate: true
    }
  },
  created() {
    this.roleManager_btn_add = this.permissions['market_role_add']
    this.roleManager_btn_edit = this.permissions['market_role_edit']
    this.roleManager_btn_del = this.permissions['market_role_del']
    this.roleManager_btn_perm = this.permissions['market_role_perm']
    this.roleManager_btn_data_perm = this.permissions['market_role_data_perm']
    // 获取下拉列表的数据
    this.getSelectList()
  },
  computed: {
    ...mapGetters(['elements', 'permissions'])
  },
  methods: {
    getSelectList() {
      // 物业类型
      getEstateTypeList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.estateTypeList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 楼层 参数传0 代表只查询楼层
      getSelectBuildingList(0).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.buildingList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 主营品类(level = 0 只查询第1级)
      getSelectKindsList('0').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.kindsList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    getList(page, params) {
      this.listLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.list = response.data.data.records
        this.page.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    refreshChange() {
      this.getList(this.page)
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    handleCreate() {
      this.$refs.crud.rowAdd()
    },
    handleOpenBefore(show) {
      fetchTree().then(response => {
        this.dsScopeData = response.data.data
        if (this.form.dsScope) {
          this.checkedDsScope = (this.form.dsScope).split(',')
        } else {
          this.checkedDsScope = []
        }
      })
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    cancal() {
      this.dialogPermissionVisible = false
      this.dialogDataPermissionVisible = false
    },
    handlePermission(row) {
      fetchRoleTree(row.roleId)
        .then(response => {
          this.checkedKeys = response.data.data
          return fetchMenuTree()
        })
        .then(response => {
          this.treeData = response.data.data
          // 解析出所有的太监节点
          this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
          this.dialogPermissionVisible = true
          this.roleId = row.roleId
          this.roleCode = row.roleCode
        })
    },
    handleDataPermission(row) {
      this.dialogDataPermissionVisible = true
      this.roleId = row.roleId
      getRoleDataScope(row.roleId).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          const data = res.data.data
          if (data.dsBuildingScope) {
            if (data.dsBuildingScope === 'all') {
              this.formParams.buildingArr = this.selectOptions.buildingList.map(o => o.id)
            } else {
              this.formParams.buildingArr = data.dsBuildingScope.split(',')
              this.formParams.buildingArr = this.formParams.buildingArr.map(o => Number(o))
            }
          }
          if (data.dsEstateScope) {
            if (data.dsEstateScope === 'all') {
              this.formParams.estateTypeArr = this.selectOptions.estateTypeList.map(o => o.id)
            } else {
              this.formParams.estateTypeArr = data.dsEstateScope.split(',')
              this.formParams.estateTypeArr = this.formParams.estateTypeArr.map(o => Number(o))
            }
          }
          if (data.dsKindsScope) {
            if (data.dsKindsScope === 'all') {
              this.formParams.kindsArr = this.selectOptions.kindsList.map(o => o.id)
            } else {
              this.formParams.kindsArr = data.dsKindsScope.split(',')
              this.formParams.kindsArr = this.formParams.kindsArr.map(o => Number(o))
            }
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 添加或删除
    updateDataPermession(roleId) {
      const pageQueryVo = {
        dsBuildingScope: this.formParams.buildingArr.length > 0 && this.formParams.buildingArr.length === this.selectOptions.buildingList.length ? 'all' : this.formParams.buildingArr.join(),
        dsEstateScope: this.formParams.estateTypeArr.length > 0 && this.formParams.estateTypeArr.length === this.selectOptions.estateTypeList.length ? 'all' : this.formParams.estateTypeArr.join(),
        dsKindsScope: this.formParams.kindsArr.length > 0 && this.formParams.kindsArr.length === this.selectOptions.kindsList.length ? 'all' : this.formParams.kindsArr.join(),
        roleId: roleId
      }
      saveRoleDataScope(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.$message.success('数据权限分配成功')
          this.dialogDataPermissionVisible = false
        } else {
          this.$message.error('数据权限分配失败，失败原因' + res.data.msg)
        }
      })
    },
    // 物业全选
    handleCheckEstateAllChange(val) {
      this.formParams.estateTypeArr = val ? this.selectOptions.estateTypeList.map(o => o.id) : []
      this.isEstateIndeterminate = false
    },
    // 物业选择
    handleCheckedEstateChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.selectOptions.estateTypeList.length
      this.isEstateIndeterminate = checkedCount > 0 && checkedCount < this.selectOptions.estateTypeList.length
    },
    // 楼号全选
    handleCheckBuildingAllChange(val) {
      this.formParams.buildingArr = val ? this.selectOptions.buildingList.map(o => o.id) : []
      this.isBuildingIndeterminate = false
    },
    // 物业选择
    handleCheckedBuildingChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.selectOptions.buildingList.length
      this.isBuildingIndeterminate = checkedCount > 0 && checkedCount < this.selectOptions.buildingList.length
    },
    // 业态全选
    handleCheckKindsAllChange(val) {
      this.formParams.kindsArr = val ? this.selectOptions.kindsList.map(o => o.id) : []
      this.isKindsIndeterminate = false
    },
    // 业态选择
    handleCheckedKindsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.selectOptions.kindsList.length
      this.isKindsIndeterminate = checkedCount > 0 && checkedCount < this.selectOptions.kindsList.length
    },
    /**
       * 解析出所有的太监节点id
       * @param json 待解析的json串
       * @param idArr 原始节点数组
       * @param temp 临时存放节点id的数组
       * @return 太监节点id数组
       */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data, done) {
      done()
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"' + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delObj(row.roleId)
      }).then(() => {
        this.getList(this.page)
        this.$notify.success('删除成功')
      })
    },
    create(row, done, loading) {
      // if (this.form.dsType === 1) {
      //   this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      // }
      this.form.dsType = '0' // 默认全部
      addObj(this.form).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('创建成功')
      }).catch(() => {
        loading()
      })
    },
    update(row, index, done, loading) {
      if (this.form.dsType === 1) {
        this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      putObj(this.form).then(() => {
        this.getList(this.page)
        done()
        this.$notify.success('修改成功')
      }).catch(() => {
        loading()
      })
    },
    updatePermession(roleId) {
      this.menuIds = ''
      this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
      permissionUpd(roleId, this.menuIds).then(() => {
        this.dialogPermissionVisible = false
        this.$notify.success('修改成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;
    .dialog-main-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }
  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }
  .el-form-item__content {
    margin-left: 20% !important;
  }
}
::v-deep .is-circle {
  opacity: 0;
}
::v-deep .el-button i {
  display: none;
}
</style>
