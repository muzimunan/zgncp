<template>
  <div class="fee-pay">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="merchantName">
          <el-input v-model="formParams.merchantName" placeholder="请输入商户名称" clearable />
        </el-form-item>
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
        <el-button v-if="permissions.entity_feepay_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table ref="filterTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="feepayCode" label="单据编码" />
        <el-table-column prop="fillpayTime" label="单据日期" />
        <el-table-column prop="merchantName" label="商户名称" />
        <el-table-column prop="payPrice" label="应收金额" />
        <el-table-column prop="realPrice" label="实收金额" />
        <el-table-column prop="printCount" label="打印次数" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feepay_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feepay_view"
              type="text"
              size="mini"
              @click.stop="operateData('look', scope.row)"
            >
              查看
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
  </div>
</template>

<script>
import { fetchList } from '@/api/feePay'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'FeePay',
  components: {
    pagination
  },
  data() {
    return {
      formParams: {
        merchantName: '', // 商户名称
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
      tableData: [],
      selectOptions: {
      },
      operateType: 'add'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
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
        merchantName: this.formParams.merchantName || undefined,
        feepayCode: this.formParams.feepayCode || undefined,
        startFillpayTime: this.formParams.startFillpayTime || undefined,
        endFillpayTime: this.formParams.endFillpayTime || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
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
    },
    // 新增/编辑/查看 打开页面
    operateData(type, item) {
      this.$router.push({
        path: '/feePay/detail',
        query: {
          operateType: type,
          id: (type === 'edit' || type === 'look') ? item.id : undefined
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
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
}
</style>
