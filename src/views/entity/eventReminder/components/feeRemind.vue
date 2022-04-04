<template>
  <div class="fee-remind znp-filter-container">
    <div class="">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="处理状态" prop="handleStatus" style="display: block">
          <el-radio-group v-model="formParams.handleStatus" @change="handlerSearch(1)">
            <el-radio :label="0">未处理</el-radio>
            <el-radio :label="1">已处理</el-radio>
          </el-radio-group>
        </el-form-item>
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
            <el-option v-for="item in selectOptions.kindsList" :key="item.id" :label="item.kindsName" :value="item.id" />
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
    <div class="">
      <div style="margin-bottom: 16px; margin-top: 16px">
        <el-button
          type="primary"
          size="mini"
          v-if="permissions.entity_feeremind_edit && formParams.handleStatus === 0"
          @click="handleFeePay"
        >
          处理
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        border
        size="small"
        :row-key="getKeys"
        @selection-change="handleSelectChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="feePayDetailCode" label="收款单据编码" />
        <el-table-column prop="buildingNums" label="楼号" />
        <el-table-column prop="operationKindsName" label="业态" />
        <el-table-column prop="estateNames" label="物业名称" />
        <el-table-column prop="feeItemName" label="费用项目" />
        <el-table-column prop="feeBeginTime" label="费用开始时间" />
        <el-table-column prop="days" label="距离(天数)" />
        <el-table-column prop="payer" label="缴费人" />
        <el-table-column prop="assignedUsername" label="分配的任务人" />
        <el-table-column prop="handleStatusName" label="是否处理" />
        <el-table-column prop="handleTime" label="处理时间" />
        <el-table-column prop="handleUser" label="处理人" />
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
import { fetchList, handleFeePay } from '@/api/feeRemind'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'FeeRemind',
  components: {
    pagination
  },
  props: {
    selectOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formParams: {
        handleStatus: 0, // 默认查询未处理
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
      multipleSelection: [], // 选择需要处理的数据
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
        handleStatus: this.formParams.handleStatus === 0 ? '0' : '1', // 是否处理
        operationKindsId: this.formParams.operationKindsId || undefined, // 业态
        estateName: this.formParams.estateName || undefined, // 物业名称
        buildingNum: this.formParams.buildingNum || undefined // 楼号
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          // 查询第一条数据的收费单详情
          if (this.multipleSelection.length > 0) {
            this.$nextTick(() => {
              this.tableData.forEach(item => {
                if (this.multipleSelection.findIndex(res => res.id === item.id) !== -1) {
                  this.$refs.multipleTable.toggleRowSelection(item, true)
                }
              })
            })
          }
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
    getKeys(row) {
      return row.id
    },
    // 一个一个的选择或者全选
    handleSelectChange(selection) {
      this.multipleSelection = selection
    },
    handleFeePay() {
      if (this.multipleSelection.length <= 0) {
        this.$message.success('请至少选择一条')
        return
      }
      this.$confirm('是否确认处理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const paramData = {
          remindIds: this.multipleSelection.map((item) => { return item.id })
        }
        handleFeePay(paramData).then(res => {
          if (res && parseInt(res.data.code) === 0) {
            this.$nextTick(() => {
              this.$refs.multipleTable.clearSelection()
            })
            this.handlerSearch(1)
          } else {
            this.$message.success(res.data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.fee-remind {
  padding: 0px 20px 0px !important;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
