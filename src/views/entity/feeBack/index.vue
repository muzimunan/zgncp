<template>
  <div class="fee-back">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="feeBackCode">
          <el-input v-model="formParams.feeBackCode" placeholder="请输入退费单据编码" clearable />
        </el-form-item>
        <el-form-item label="" prop="feePayDetailCode">
          <el-input v-model="formParams.feePayDetailCode" placeholder="请输入收款单据编码" clearable />
        </el-form-item>
        <el-form-item prop="backBillBeginDate">
          <el-date-picker
            v-model="formParams.backBillBeginDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="退费开始日期"
          />
        </el-form-item>
        <el-form-item prop="backBillEndDate">
          <el-date-picker
            v-model="formParams.backBillEndDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="退费结束日期"
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
        <el-button v-if="permissions.entity_feeback_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table ref="filterTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="feebackCode" label="退费单据编码" />
        <el-table-column prop="feepaydetailsCode" label="收款单据编码" />
        <el-table-column prop="feeItemName" label="收款项目" />
        <el-table-column prop="backTypeName" label="退费类型" />
        <el-table-column prop="fillbackTime" label="退费时间" />
        <el-table-column prop="realPrice" label="实退金额" />
        <el-table-column prop="originalPayer" label="原付款人" />
        <el-table-column prop="backOperUsername" label="退款人" />
        <el-table-column prop="remark" label="退费原因" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feeback_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feeback_view"
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
import { fetchList } from '@/api/feeBack'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'FeeBack',
  components: {
    pagination
  },
  data() {
    return {
      formParams: {
        feeBackCode: '', // 退费单据编码
        feePayDetailCode: '', // 收款单据编码
        backBillBeginDate: '',
        backBillEndDate: ''
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
    $route(to, from) {
      // 获取列表数据
      if (to.path === '/entity/feeBack/index') {
        this.handlerSearch(1)
      }
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
        feePayDetailCode: this.formParams.feePayDetailCode || undefined,
        feeBackCode: this.formParams.feeBackCode || undefined,
        backBillBeginDate: this.formParams.backBillBeginDate || undefined,
        backBillEndDate: this.formParams.backBillEndDate || undefined
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
        path: '/feeBack/detail',
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
.fee-back {
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
