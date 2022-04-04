<template>
  <div class="deposit">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="buildingNum">
          <el-select v-model="formParams.buildingNum" placeholder="楼号" filterable clearable>
            <el-option
              v-for="(item, index) in selectOptions.buildingList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="operationKindsId">
          <el-select v-model="formParams.operationKindsId" placeholder="业态" style="width: 100%">
            <el-option
              v-for="item in selectOptions.kindsList"
              :key="item.id"
              :label="item.kindsName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="estateName">
          <el-input v-model="formParams.estateName" placeholder="物业名称" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <el-table ref="filterTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="buildingNumName" label="楼号" />
        <el-table-column prop="operationtypesKindsName" label="业态" />
        <el-table-column prop="estateName" label="物业名称" />
        <el-table-column prop="contractName" label="合同名称" />
        <el-table-column prop="contractCode" label="合同编码" />
        <el-table-column prop="merchantName" label="合同乙方" />
        <el-table-column prop="rentStartDate" label="合同开始时间" />
        <el-table-column prop="rentEndDate" label="合同结束时间" />
        <el-table-column prop="deposit" label="保证金额" />
        <el-table-column prop="feepayStatusName" label="状态" />
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
import { queryDepositList } from '@/api/feePay'
import { getSelectKindsList } from '@/api/category'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
import { getSelectBuildingList } from '@/api/building'
export default {
  name: 'DepositManage',
  components: {
    pagination
  },
  props: {
    kindsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formParams: {
        operationKindsId: '', // 业态
        estateName: '', // 物业名称
        buildingNum: '' // 楼号
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        kindsList: []
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
        operationKindsId: this.formParams.operationKindsId || undefined, // 业态
        estateName: this.formParams.estateName || undefined, // 物业名称
        buildingNum: this.formParams.buildingNum || undefined // 楼号
      }
      queryDepositList(pageQueryVo).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.deposit {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
}
</style>
