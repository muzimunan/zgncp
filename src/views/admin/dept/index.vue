<template>
  <div class="dept-list">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="name">
          <el-input v-model="formParams.name" placeholder="请输入部门名称" clearable />
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
        <el-button v-if="permissions.market_dept_add" type="primary" size="mini" @click="operateData('add')">
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
        <el-table-column prop="sort" label="序号" align="center" />
        <el-table-column prop="name" label="部门名称" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.market_dept_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.market_dept_del"
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
            <el-form-item label="序号" prop="sort">
              <el-input-number
                v-model="inputForm.sort"
                :min="0"
                step-strictly
                style="width: 100%"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model="inputForm.name"
                placeholder="请输入部门名称"
                maxlength="50"
                clearable
                show-word-limit
                :disabled="detailDisable"
              />
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
import { fetchList, addObj, putObj, delObj } from '@/api/admin/dept'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'DeptList',
  components: {
    pagination
  },
  data() {
    return {
      dialog: {
        title: '新增',
        visible: false
      },
      formParams: {
        name: '',
        sort: ''
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
        name: '', // 部门名称
        sort: '', // 排序
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      baseForm: {
        name: '', // 部门名称
        sort: '', // 排序
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      inputFormRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    detailDisable() {
      return this.operateType === 'look'
    },
    editDisable() {
      return this.operateType === 'edit'
    }
  },
  created() {
    // 获取列表数据
    this.handlerSearch(1)
  },
  methods: {
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
        name: this.formParams.name || undefined
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
    },
    // 新增/编辑/查看 打开弹框
    operateData(type, item) {
      this.dialog.visible = true
      this.operateType = type
      this.$nextTick(() => {
        this.$refs['inputFormRef'].clearValidate()
      })
      if (this.operateType === 'add') {
        this.dialog.title = '新增部门'
        this.inputForm = Object.assign({}, this.baseForm)
      } else if (this.operateType === 'edit') {
        this.dialog.title = '修改部门'
        this.inputForm = JSON.parse(JSON.stringify(item))
      } else {
        this.dialog.visible = false
        this.$confirm('此操作将永久删除该部门(' + item.name + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).then(() => {
          delObj(item.deptId)
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
.dept-list {
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
}
</style>
