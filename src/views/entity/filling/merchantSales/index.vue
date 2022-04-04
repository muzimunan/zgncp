<template>
  <div class="merchant-sales">
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
        <el-form-item label="" prop="marketPeriodCode">
          <el-select v-model="formParams.marketPeriodCode" :clearable="false" placeholder="请选择期">
            <el-option
              v-for="item in selectOptions.marketPeriodList"
              :key="item.periodCode"
              :label="item.periodName"
              :value="item.periodCode"
            />
          </el-select>
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
          <el-button type="primary" size="small" @click="searchDataFun(tabsValue)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <el-tabs v-model="tabsValue" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
          <div v-if="item.name === '0'">
            <Summation
              :form-params="formParams"
              :table-data="tableData"
              :type="item.name"
              :total-salesable-data="totalSalesableData"
              :table-update="tableUpdate"
            />
          </div>
          <div v-else>
            <SalesType
              :form-params="formParams"
              :table-data="tableData"
              :type="item.name"
              :item-list="selectOptions.itemList"
              :total-salesable-data="totalSalesableData"
              :table-update="tableUpdate"
              :is-allow-filling="isAllowFilling"
              :market-period-list="selectOptions.marketPeriodList"
              @searchDataFun="querySearchDataFun"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/report/merchantSales'
import { reportCurrentYear, beforeWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
import Summation from './summation'
import SalesType from './salesType'
import { getMarketPeriod } from '@/api/market'
import { mapGetters } from 'vuex'
export default {
  name: 'MerchantSales',
  components: { Summation, SalesType },
  data() {
    return {
      tableUpdate: true, // 强制刷新vuetable组件，否则切换周的时候不显示正确的数据
      isAllowFilling: false,
      tabsValue: '0',
      editableTabs: [{
        title: '合计',
        name: '0'
      },
      {
        title: '商铺销售',
        name: '1'
      },
      {
        title: '公寓销售',
        name: '3'
      },
      {
        title: '办公销售',
        name: '2'
      }],
      formParams: {
        year: reportCurrentYear(),
        marketPeriodCode: 'P01', // 默认选择第一期
        startWeek: beforeWeek(new Date()),
        endWeek: getYearWeek(new Date()),
        estateTypeId: ''
      },
      selectOptions: {
        marketPeriodList: [], // 市场期数
        weekList: selectWeekList() // 周的下拉框
      },
      tableData: [],
      totalSalesableData: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 获取列表数据
    this.searchDataFun(this.tabsValue)
  },
  methods: {
    getSelectList() {
      // 获取市场期数
      getMarketPeriod(this.userInfo.marketId).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.marketPeriodList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleTabClick(tab, event) {
      this.searchDataFun(tab.name)
    },
    // 子组件查询
    querySearchDataFun() {
      this.searchDataFun(this.tabsValue)
    },
    // 查询列表
    searchDataFun(typeId) {
      if (!this.formParams.year) {
        this.$message.error('请选择年')
        return false
      }
      if (this.formParams.startWeek > this.formParams.endWeek) {
        this.$message.error('请选择正确周区间')
        return false
      }
      this.tableUpdate = false
      this.formParams.estateTypeId = typeId
      const pageQueryVo = {
        marketPeriodCode: this.formParams.marketPeriodCode,
        estateTypeId: typeId,
        year: this.formParams.year,
        startWeek: this.formParams.startWeek,
        endWeek: this.formParams.endWeek
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.isAllowFilling = res.data.data.isAllowFilling
          this.tableData = res.data.data.records
          // this.selectOptions.itemList = res.data.data.fillAllowedList
          this.totalSalesableData = res.data.data.totalSalesableData
        } else {
          this.$message.error(res.data.msg)
        }
        this.tableUpdate = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.merchant-sales {
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
