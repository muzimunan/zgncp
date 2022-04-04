<template>
  <div class="income-detail">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="year">
          <el-date-picker
            v-model="formParams.year"
            type="year"
            placeholder="选择年"
            format="yyyy"
            value-format="yyyy"
            :clearable="false"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="" prop="startWeek">
          <el-select v-model="formParams.startWeek" placeholder="请选择" style="width: 150px">
            <el-option
              v-for="item in selectOptions.weekList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          -
          <el-select v-model="formParams.endWeek" placeholder="请选择" style="width: 150px">
            <el-option
              v-for="item in selectOptions.weekList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="searchDataFun()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_weeksalesreturn_add" type="primary" size="mini" @click="operateData('add')">
          填报
        </el-button>
        <el-button
          v-if="permissions.entity_weeksalesreturn_edit"
          type="primary"
          size="mini"
          plain
          @click="operateData('update')"
        >
          修改
        </el-button>
        <el-button type="success" size="mini" @click="exportExcel()">导出</el-button>
      </div>
      <div>
        <el-descriptions title="统计/指标" size="medium">
          <el-descriptions-item label="年度销售回款总目标(元)">{{ totalObj.targetSalesReturn | numberToCurrency }}</el-descriptions-item>
          <el-descriptions-item label="销售回款合计">{{ totalObj.totalSalesReturn | numberToCurrency }}</el-descriptions-item>
          <el-descriptions-item label="达成进度" style="width: 200px">
            <el-progress
              v-if="
                parseInt(totalObj.targetSalesReturn) !== 0 &&
                Number(((totalObj.targetSalesReturn / totalObj.targetSalesReturn) * 100).toFixed(2))
              "
              :text-inside="true"
              :stroke-width="26"
              :percentage="Number(((totalObj.totalSalesReturn / totalObj.targetSalesReturn) * 100).toFixed(2))"
            />
            <el-progress v-else :text-inside="true" :stroke-width="26" :percentage="0.0" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-table
        v-if="tableUpdate"
        ref="report-table"
        v-loading="tableLoading"
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        border
        size="small"
      >
        <el-table-column fixed label="费用名称" prop="feeitemName" width="180" />
        <el-table-column v-for="(item, idx) in tableHead" :key="idx">
          <template slot="header">
            <span v-if="tableData[0].weeklist[idx].week === -1">年累计</span>
            <span v-else-if="tableData[0].weeklist[idx].week === 0">结转金额</span>
            <span v-else-if="tableData[0].weeklist[idx].week > 0">第{{ tableData[0].weeklist[idx].week }}周</span>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.weeklist[idx][item.property] | numberToCurrency }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!tableUpdate" description="加载中" image="/img/loading.gif" :image-size="35" />
    </div>
    <!-- 填报数据 -->
    <AddSaleReturn :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
    <!-- 修改数据 -->
    <UpdateSaleReturn :dialog-vo="editDialogVo" @setDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script>
import { fetchList } from '@/api/report/salesReturn'
import { mapGetters } from 'vuex'
import AddSaleReturn from './components/addSaleReturn' // 填报数据
import UpdateSaleReturn from './components/updateSaleReturn'// 【修改运营明细统计数据】
import { reportCurrentYear, beforeWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
import { getRemoteFeekindsoperationList } from '@/api/feekindsoperation'
import { exportExcel } from '@/util/exportExcel'
export default {
  name: 'WeekIncome',
  components: { AddSaleReturn, UpdateSaleReturn },
  data() {
    return {
      tableUpdate: true, // 强制刷新vuetable组件，否则切换周的时候不显示正确的数据
      isAllowFilling: false,
      dialogVo: {
        title: '销售回款数据填报',
        visible: false,
        feeTypeList: []
      },
      editDialogVo: {
        title: '销售回款数据修改',
        visible: false,
        formParams: {}
      },
      formParams: {
        year: reportCurrentYear(),
        startWeek: beforeWeek(),
        endWeek: getYearWeek()
      },
      tableLoading: true, // loading
      tableData: [],
      totalObj: {
        targetSalesReturn: '',
        totalSalesReturn: ''
      },
      selectOptions: {
        weekList: selectWeekList() // 周的下拉框
      },
      tableHead: []// 数据展示表格
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
    this.searchDataFun()
  },
  methods: {
    updateHeader() {
      const innerHead = {
        width: 100,
        property: 'salesReturn',
        label: '数量'
      }
      // 动态表头index
      this.tableHead.push(innerHead)
    },
    getSelectList() {
      // 费用名称list
      getRemoteFeekindsoperationList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeTypeList = res.data.data
          this.dialogVo.feeTypeList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 查询列表
    searchDataFun() {
      if (!this.formParams.year) {
        this.$message.error('请选择年')
        return false
      }
      if (this.formParams.startWeek > this.formParams.endWeek) {
        this.$message.error('请选择正确周区间')
        return false
      }
      this.tableUpdate = false
      this.tableLoading = true
      const pageQueryVo = {
        year: this.formParams.year,
        startWeek: this.formParams.startWeek,
        endWeek: this.formParams.endWeek
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.isAllowFilling = res.data.data.isAllowFilling
          this.tableData = res.data.data.records
          this.totalObj = {
            targetSalesReturn: res.data.data.targetSalesReturn,
            totalSalesReturn: res.data.data.totalSalesReturn
          }
          this.tableHead = []
          this.tableData[0].weeklist.forEach((i) => {
            // 表头
            this.updateHeader()
          })
        } else {
          this.$message.error(res.data.msg)
        }
        this.tableUpdate = true
        this.tableLoading = false
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增/编辑/查看 打开弹框
    operateData(type) {
      if (type === 'add') {
        this.dialogVo.visible = true
      } else {
        this.editDialogVo.visible = true
        this.editDialogVo.formParams = this.formParams
      }
    },
    // 子组件控制弹框展示或者隐藏
    setDialogVisiable(data) {
      this.dialogVo.visible = data
      this.editDialogVo.visible = data
      this.searchDataFun()
    },
    exportExcel() {
      exportExcel('salesReturn', this.$refs['report-table'].$el)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.income-detail {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
  ::v-deep .el-progress-bar {
    margin-right: 100px !important;
  }
  ::v-deep .el-progress-bar__outer {
    height: 15px !important;
  }
}
</style>
