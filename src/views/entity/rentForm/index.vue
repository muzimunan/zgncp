<template>
  <div class="rent-form">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="formCode">
          <el-input v-model="formParams.formCode" placeholder="登记单号" clearable />
        </el-form-item>
        <el-form-item label="" prop="merchantCodeOrName">
          <el-input v-model="formParams.merchantCodeOrName" placeholder="商户编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="estateCodeOrName">
          <el-input v-model="formParams.estateCodeOrName" placeholder="物业编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="formParams.status" placeholder="单据状态" filterable clearable>
            <el-option
              v-for="item in selectOptions.rentformStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="startDate">
          <el-date-picker v-model="formParams.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" />
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker v-model="formParams.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_rentform_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table ref="filterTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="formCode" label="单据编号" width="180" />
        <el-table-column prop="rentDate" label="出租日期" />
        <el-table-column prop="formStatusLabel" label="单据状态" />
        <el-table-column prop="merchantName" label="商户名称" />
        <el-table-column prop="estateName" label="物业名称" />
        <el-table-column prop="startDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_rentform_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_rentform_view"
              type="text"
              size="mini"
              @click.stop="operateData('look', scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="permissions.entity_rentform_cancel && scope.row.formStatus === 1"
              type="text"
              size="mini"
              @click.stop="operateData('cancel', scope.row)"
            >
              作废
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
      width="500px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="单据编号" prop="formCode">
              <el-input v-model="inputForm.formCode" placeholder="单据编号" clearable :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="作废原因" prop="invalidReason">
              <el-input
                v-model="inputForm.invalidReason"
                type="textarea"
                placeholder="请输入作废原因"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateStatus } from '@/api/rentform'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'RentForm',
  components: {
    pagination
  },
  data() {
    return {
      dialog: {
        title: '作废',
        visible: false
      },
      formParams: {
        formCode: '', // 登记单号
        merchantCodeOrName: '', // 商户编码或名称
        estateCodeOrName: '', // 物业编码/名称
        status: '', // 单据状态
        startDate: '', // 开始日期
        endDate: '' // 结束日期
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        rentformStatus: [] // 单据状态
      },
      operateType: 'add',
      inputForm: {
        formCode: '',
        invalidReason: '',
        id: ''
      },
      inputFormRules: {
        invalidReason: [
          { required: true, message: '请输入作废原因', trigger: 'blur' }
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
  watch: {
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 获取列表数据
    this.handlerSearch(1)
  },
  methods: {
    getSelectList() {
      // 单据状态
      remote('rent_form_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.rentformStatus = res.data.data
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
        formCode: this.formParams.formCode || undefined,
        merchantCodeOrName: this.formParams.merchantCodeOrName || undefined,
        estateCodeOrName: this.formParams.estateCodeOrName || undefined,
        status: this.formParams.status || undefined,
        startDate: this.formParams.startDate || undefined,
        endDate: this.formParams.endDate || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          const dataList = res.data.data.records
          this.tableData = dataList
          this.total = res.data.data.total
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
    // 状态变更
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          this.$confirm('作废后，将影响物业档案状态，是否执行此操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateStatus(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('状态变更成功')
                this.dialog.visible = false
                this.handlerSearch(1)
              } else {
                this.$message.error('状态变更失败')
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else {
          return false
        }
      })
    },
    cancelDialog() {
      this.dialog.visible = false
    },
    // 新增/编辑/查看 打开页面
    operateData(type, item) {
      if (type === 'cancel') {
        // 作废
        this.dialog.visible = true
        this.$nextTick(() => {
          this.$refs['inputFormRef'].clearValidate()
        })
        this.inputForm.formCode = item.formCode
        this.inputForm.invalidReason = item.invalidReason
        this.inputForm.id = item.id
      } else {
        this.$router.push({
          path: '/rentform/detail',
          query: {
            operateType: type,
            id: (type === 'edit' || type === 'look') ? item.id : undefined
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.rent-form {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 5px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
}
</style>
