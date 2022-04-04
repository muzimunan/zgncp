<template>
  <div class="user-list">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="支付状态" prop="status">
          <el-select v-model="formParams.status" style="width: 100%" placeholder="请选择支付状态" clearable>
            <el-option
              v-for="item in selectOptions.statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <!-- <el-button v-if="permissions.market_user_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button> -->
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
        <el-table-column prop="orderId" label="订单号" align="center" />
        <el-table-column prop="channelId" label="渠道ID" align="center" />
        <el-table-column prop="channelMchId" label="渠道商户" align="center" />
        <el-table-column prop="channelOrderNo" label="渠道订单" align="center" />
        <el-table-column prop="body" label="商品描述" align="center" />
        <el-table-column prop="amount" label="金额/元" align="center" />
        <el-table-column prop="currency" label="币种" align="center" />
        <el-table-column prop="statusName" label="支付状态" align="center" />
        <el-table-column prop="clientIp" label="客户端IP" align="center" />
        <el-table-column prop="paySuccTime" label="成功时间" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
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
  </div>
</template>

<script>
import { fetchList } from '@/api/pay/paytradeorder'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'OrdersList',
  components: {
    pagination
  },
  data() {
    return {
      dialog: {
        title: '退款',
        visible: false
      },
      formParams: {
        payOrderId: '',
        status: ''
      },
      selectOptions: {
        statusList: [] // 订单状态
      },
      listQuery: {
        size: 20, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // 列表loading
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 获取列表数据
    this.handlerSearch(1)
  },
  methods: {
    getSelectList() {
      // 订单状态
      remote('order_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.statusList = res.data.data
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
        descs: 'create_time',
        status: this.formParams.status || undefined
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
