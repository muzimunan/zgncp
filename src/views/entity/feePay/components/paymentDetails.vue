<template>
  <div class="payment-detail-dialog">
    <el-dialog
      :title="paymentDetailsVo.title"
      :visible="paymentDetailsVo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="1000px"
    >
      <!--  <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="楼号" prop="buildingNum">
          <el-input v-model="formParams.buildingNum" placeholder="请输入楼号信息" clearable />
        </el-form-item>
        <el-form-item label="层号" prop="floor">
          <el-input v-model="formParams.floor" placeholder="请输入层号信息" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form> -->
      <div class="">
        <div style="margin-bottom: 10px">收费单据编码:{{ paymentDetailsVo.feepaydetailsCode }}</div>
        <el-table :data="tableData" style="width: 100%" border size="small" v-loading="tableLoading">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="payOrderId" label="订单号" />
          <el-table-column prop="feeName" label="收费项目" />
          <el-table-column prop="amount" label="收款金额" />
          <el-table-column prop="paySuccTime" label="付款时间" />
          <el-table-column prop="statusName" label="订单状态" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="printReceipt(scope.row)"
                v-if="parseInt(scope.row.status) === 2 || parseInt(scope.row.status) === 5"
              >
                补打收据
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--  <div style="margin-top: 24px; display: flex; align-items: center; justify-content: flex-end">
          <pagination
            :total="total"
            :page.sync="listQuery.current"
            :limit.sync="listQuery.size"
            @pagination="handleFilter"
          />
        </div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">关 闭</el-button>
      </span>
    </el-dialog>
    <!--收据 -->
    <PrintFeePayDetail :print-dialog-vo="printDialogVo" @cancelDialog="cancelPrintDialog" />
  </div>
</template>

<script type="text/ecmascript-6">
import { queryListByFeeCode } from '@/api/pay/payorder'
import PrintFeePayDetail from '@/components/PrintFeePay'// 【收据】
import { queryPrintDetail } from '@/api/feepaydetails'
// import pagination from '@/components/Pagination' // 分页
export default {
  name: 'PaymentDetails',
  components: { PrintFeePayDetail },
  props: {
    paymentDetailsVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      listQuery: {
        size: 100, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true,
      // formParams: {
      //   buildingNum: '', // 楼号
      //   floor: '' // 层号
      // },
      tableData: [],
      printDialogVo: {
        title: '收据',
        visible: false,
        obj: {} // 要打印的数据
      }
    }
  },
  computed: {
  },
  watch: {
    'paymentDetailsVo': {
      handler(l) {
        if (l.visible) {
          this.handlerSearch(1)
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    }
  },
  mounted() {
  },
  created() {
  },
  activated() {
  },
  destroyed() {
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
    searchDataFun() {
      this.tableLoading = true
      queryListByFeeCode(this.paymentDetailsVo.feepaydetailsCode).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data
        } else {
          this.$message.error('查询失败，失败原因' + res.msg)
        }
        this.tableLoading = false
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
    },
    cancelDialog() {
      this.$emit('cancelDialog', false)
    },
    cancelPrintDialog() {
      this.printDialogVo.visible = false
    },
    // 打印收据
    printReceipt(item) {
      queryPrintDetail({ feePayDetailCode: item.feeCode, payTime: item.paySuccTime, amount: item.amount }).then(res => {
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

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.payment-detail-dialog {
  .znp-crud-dialog[data-v-d96e1492] .el-dialog__body {
    padding: 20px 50px 5px 50px !important;
  }
}
</style>
