<template>
  <div class="user-list">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formParams.username" placeholder="用户名" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <!--v-if="permissions.market_area_add"-->
        <el-button v-if="permissions.market_user_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table
        ref="filterTable"
        v-loading="tableLoading"
        :data="tableData"
        row-key="id"
        style="width: 100%"
        border
        size="small"
      >
        <el-table-column type="index" label="序号" align="center" width="45" />
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="trueName" label="真实姓名" align="center" />
        <el-table-column prop="deptName" label="部门" align="center" />
        <el-table-column prop="phone" label="手机号" align="center" />
        <el-table-column prop="name" label="角色" align="center">
          <template slot-scope="scope">
            <span v-for="(role, index) in scope.row.roleList" :key="index">
              <el-tag>{{ role.roleName }}</el-tag>
              &nbsp;&nbsp;
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="lockFlag" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.lockFlag ? '有效' : '锁定' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.market_user_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.market_user_del"
              size="mini"
              type="text"
              @click.stop="operateData('del', scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 24px; display: flex; align-items: center; justify-content: flex-end">
        <pagination
          :total="total"
          :page.sync="listQuery.current"
          :limit.sync="listQuery.size"
          @pagination="handleFilter"
        />
      </div>
    </div>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="600px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="inputForm.username"
                placeholder="请输入用户名"
                maxlength="20"
                clearable
                show-word-limit
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24" v-if="addDisable">
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                v-model="inputForm.password"
                placeholder="请输入密码"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="真实姓名" prop="trueName">
              <el-input
                v-model="inputForm.trueName"
                placeholder="请输入用户真实姓名"
                maxlength="20"
                clearable
                show-word-limit
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="所属部门" prop="deptId">
              <el-select v-model="inputForm.deptId" style="width: 100%" placeholder="请选择所属部门" clearable>
                <el-option
                  v-for="item in selectOptions.deptList"
                  :key="item.deptId"
                  :label="item.name"
                  :value="item.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="inputForm.phone" placeholder="请输入正确手机号" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="角色" prop="role">
              <el-select
                v-model="inputForm.role"
                style="width: 100%"
                multiple
                placeholder="请选择角色"
                clearable
                @change="$forceUpdate()"
              >
                <el-option
                  v-for="item in selectOptions.roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="状态" prop="lockFlag">
              <el-radio-group v-model="inputForm.lockFlag" size="small">
                <el-radio label="0" border>有效</el-radio>
                <el-radio label="9" border>锁定</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="detailDisable">
          <el-divider />
          <el-row>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="创建人">
                <el-input v-model="inputForm.createBy" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="创建时间">
                <el-input v-model="inputForm.createTime" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="修改人">
                <el-input v-model="inputForm.updateBy" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="修改时间">
                <el-input v-model="inputForm.updateTime" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">{{ detailDisable ? '关 闭' : '取 消' }}</el-button>
        <el-button v-if="!detailDisable" type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj, getDetails } from '@/api/admin/user'
import { queryDeptSelectList } from '@/api/admin/dept'
import { deptRoleList } from '@/api/admin/role'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'UserList',
  components: {
    pagination
  },
  data() {
    const _that = this
    var validateUsername = (rule, value, callback) => {
      getDetails(value).then(res => {
        if (_that.operateType === 'edit') callback()
        const result = res.data.data
        if (result !== null) {
          callback(new Error('用户名已经存在'))
        } else {
          callback()
        }
      })
    }
    var validateRole = (rule, value, callback) => {
      if (_that.inputForm.role.length === 0) {
        callback(new Error('请选择岗位'))
      } else {
        callback()
      }
    }
    return {
      dialog: {
        title: '新增',
        visible: false
      },
      formParams: {
        username: ''
      },
      selectOptions: {
        deptList: [], // 部门
        roleList: [] // 角色
      },
      listQuery: {
        size: 20, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // 列表loading
      tableData: [],
      operateType: 'add',
      inputForm: {
        userId: '',
        username: '',
        password: '',
        trueName: '',
        deptId: '', // 所属部门
        phone: '',
        role: [],
        lockFlag: ''
      },
      baseForm: {
        userId: '',
        username: '',
        password: '',
        trueName: '',
        deptId: '', // 所属部门
        phone: '',
        role: [],
        lockFlag: ''
      },
      inputFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          },
          { validator: validateUsername, trigger: 'blur' }],
        password: [
          // { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }],
        trueName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        phone: [
          {
            validator: (rule, value, callback) => {
              if (value && !(_that.inputForm.phone.indexOf('*') > 0 && _that.editDisable) && /^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        role: [
          { required: true, validator: validateRole, trigger: 'change' }
        ],
        lockFlag: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    addDisable() {
      return this.operateType === 'add'
    },
    detailDisable() {
      return this.operateType === 'look'
    },
    editDisable() {
      return this.operateType === 'edit'
    }
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 获取列表数据
    this.handlerSearch(1)
  },
  methods: {
    getSelectList() {
      // 所属部门
      queryDeptSelectList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.deptList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 角色
      deptRoleList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.roleList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 条件查询
    handlerSearch(page) {
      this.listQuery.current = page
      this.searchDataFun()
    },
    // 翻页
    handleFilter(page) {
      this.listQuery.current = page.page
      this.searchDataFun()
    },
    // 查询列表
    searchDataFun() {
      this.tableLoading = true
      const pageQueryVo = {
        current: this.listQuery.current, // 当前页
        size: this.listQuery.size, // 每页显示条数
        username: this.formParams.username || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          const dataList = res.data.data
          this.tableData = dataList.records
          this.total = dataList.total
        } else {
          this.$message.error(res.data.msg)
        }
        this.tableLoading = false
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.handlerSearch(1)
    },
    // 新增/编辑/查看 打开弹框
    operateData(type, item) {
      this.dialog.visible = true
      this.operateType = type
      this.$nextTick(() => {
        this.$refs['inputFormRef'].clearValidate()
      })
      if (this.operateType === 'add') {
        this.dialog.title = '新增用户'
        this.inputForm = Object.assign({}, this.baseForm)
      } else if (this.operateType === 'edit') {
        this.dialog.title = '修改用户'
        this.inputForm = JSON.parse(JSON.stringify(item))
        this.inputForm.password = undefined
        this.inputForm.role = this.inputForm.roleList.map(o => { return o.roleId })
      } else {
        this.dialog.visible = false
        this.$confirm('此操作将永久删除该用户(用户名:' + item.username + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).then(() => {
          delObj(item.userId)
            .then(() => {
              this.handlerSearch(1)
              this.$message.success('删除成功')
            }).catch(() => {
              this.$message.error('删除失败')
            })
        })
      }
    },
    // 新增/编辑/查看 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.operateType === 'add') {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.dialog.visible = false
                this.handlerSearch(1)
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            if (this.inputForm.phone && this.inputForm.phone.indexOf('*') > 0) {
              this.inputForm.phone = undefined
            }
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.dialog.visible = false
                this.handlerSearch(1)
              } else {
                this.$message.error('修改失败,' + res.data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 关闭弹框
    cancelDialog() {
      this.dialog.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.user-list {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  ::v-deep .el-input-number__increase,
  ::v-deep .el-input-number__decrease {
    right: 1px !important;
  }
  ::v-deep .el-radio {
    margin-right: 0px;
  }
}
</style>
