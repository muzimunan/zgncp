<template>
  <div class="fee-pay">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="feepayCode">
          <el-input v-model="formParams.feepayCode" placeholder="请输入单据编号" clearable />
        </el-form-item>
        <el-form-item prop="startFillpayTime">
          <el-date-picker
            v-model="formParams.startFillpayTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="单据开始日期"
          />
        </el-form-item>
        <el-form-item prop="endFillpayTime">
          <el-date-picker
            v-model="formParams.endFillpayTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="单据结束日期"
          />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_feepaytmp_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="tableLoading"
        :data="tableData"
        class="more_btn"
        style="width: 100%"
        border
        size="small"
      >
        <el-table-column prop="feepayCode" label="单据编号" width="200" />
        <el-table-column prop="fillpayTime" label="单据日期" />
        <el-table-column prop="operationKindsName" label="运营科目" />
        <el-table-column prop="feeItemName" label="收费项目" />
        <el-table-column prop="chargeTypeName" label="计费方式" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="refPrice" label="收款金额/单价" />
        <el-table-column prop="payee" label="收款人" />
        <el-table-column prop="payer" label="付款人" />
        <el-table-column prop="payerPhone" label="付款人手机号" />
        <el-table-column prop="payPrice" label="应收金额" />
        <el-table-column prop="realPrice" label="实收金额" />
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feepaytmp_print"
              size="mini"
              type="text"
              @click="printReceipt(scope.row)"
            >
              补打收据
            </el-button>
            <el-button
              v-if="permissions.entity_feepaytmp_edit"
              size="mini"
              type="text"
              @click="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feepaytmp_view"
              size="mini"
              type="text"
              @click="operateData('look', scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="permissions.entity_feepaytmp_del"
              size="mini"
              type="text"
              @click="operateData('del', scope.row)"
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
    <!--收据 -->
    <PrintFeePayDetail :print-dialog-vo="printDialogVo" @cancelDialog="cancelDialog" />
  </div>
</template>

<script>
import { fetchList, delObj, queryPrintDetail } from '@/api/feePayTemp'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
import PrintFeePayDetail from '@/components/PrintFeePay'// 【收据】
export default {
  name: 'FeePayTemp',
  components: {
    pagination, PrintFeePayDetail
  },
  data() {
    return {
      printDialogVo: {
        title: '收据',
        visible: false,
        obj: {} // 要打印的数据
      },
      formParams: {
        feepayCode: '', // 单据编号
        startFillpayTime: '',
        endFillpayTime: ''
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    $route(to, from) {
      // 获取列表数据
      if (to.path === '/entity/feePayTemp/index') {
        this.handlerSearch(1)
      }
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
        feepayCode: this.formParams.feepayCode || undefined,
        startFillpayTime: this.formParams.startFillpayTime || undefined,
        endFillpayTime: this.formParams.endFillpayTime || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          this.tableLoading = false
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增 /编辑 /查看 打开页面
    operateData(type, item) {
      if (type === 'del') {
        // 删除
        this.$confirm('删除后将不能恢复，是否要删除当前记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.handlerSearch(1)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$router.push({
          path: '/feePayTemp/detail',
          query: {
            operateType: type,
            id: (type === 'edit' || type === 'look') ? item.id : undefined
          }
        })
      }
    },
    cancelDialog() {
      this.printDialogVo.visible = false
      this.handlerSearch(1)
    },
    // 打印收据
    printReceipt(item) {
      queryPrintDetail(item.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.printDialogVo.obj = res.data.data
          this.printDialogVo.visible = true
        } else {
          this.$message.error('查询打印信息失败,失败原因' + res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.fee-pay {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 5px !important;
    }
  }
}
</style>
