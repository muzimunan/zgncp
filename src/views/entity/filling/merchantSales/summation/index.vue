<template>
  <div class="summation">
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button type="success" size="mini" @click="exportExcel()">导出</el-button>
      </div>
      <div>
        <el-descriptions title="" size="medium">
          <el-descriptions-item label="销售总额(元)">
            {{ totalSalesableData.saledIncome | numberToCurrency }}
          </el-descriptions-item>
          <el-descriptions-item label="已销售部分总成本(元)">
            {{ totalSalesableData.saleCost | numberToCurrency }}
          </el-descriptions-item>
          <el-descriptions-item label="利润总额(元)">
            {{ totalSalesableData.profit | numberToCurrency }}
          </el-descriptions-item>
          <el-descriptions-item label="项目总投资(元)">
            {{ totalSalesableData.investment | numberToCurrency }}
          </el-descriptions-item>
          <el-descriptions-item label="投资差异(元)">
            <span v-if="parseInt(totalSalesableData.investmentDiff) < 0" class="negative-reminder">
              {{ totalSalesableData.investmentDiff | numberToCurrency }}
            </span>
            <span v-else>
              {{ totalSalesableData.investmentDiff | numberToCurrency }}
            </span>
          </el-descriptions-item>
          <!-- <el-descriptions-item label="销售回款年度目标(元)">待定</el-descriptions-item>
            <el-descriptions-item label="销售回款达成率" style="width:200px">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
            </el-descriptions-item> -->
        </el-descriptions>
      </div>
      <el-table
        v-if="tableUpdate"
        ref="report-table"
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        border
        size="small"
      >
        <el-table-column fixed label="项目名称" prop="saleType" width="180" />
        <el-table-column v-for="(item, idx) in tableHead" :key="idx">
          <template slot="header">
            <span v-if="tableData[0].weeklist[idx].week === -1">总计</span>
            <span v-else-if="tableData[0].weeklist[idx].week === 0">上期结转</span>
            <span v-else-if="tableData[0].weeklist[idx].week > 0">第{{ tableData[0].weeklist[idx].week }}周</span>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.weeklist[idx][item.property] | numberToCurrency }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!tableUpdate" description="加载中" image="/img/loading.gif" :image-size="35" />
    </div>
  </div>
</template>

<script>
import { exportExcel } from '@/util/exportExcel'
export default {
  name: 'SummationPage',
  props: {
    formParams: {
      type: Object,
      default: () => { }
    },
    tableData: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    tableUpdate: {
      type: Boolean,
      default: false
    },
    totalSalesableData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      tableHead: []// 数据展示表格
    }
  },
  computed: {
  },
  watch: {
    tableData(l) {
      this.tableHead = []
      this.tableData[0].weeklist.forEach((i) => {
        // 表头
        this.updateHeader()
      })
    }
  },
  created() {
  },
  methods: {
    updateHeader() {
      const innerHead = {
        width: 100,
        property: 'saleValue',
        label: '数量'
      }
      // 动态表头index
      this.tableHead.push(innerHead)
    },
    exportExcel() {
      exportExcel('weekSales' + this.type, this.$refs['report-table'].$el)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.negative-reminder {
  background-color: yellow;
  display: inline-block;
  padding: 1px 11px;
  height: 22px;
  line-height: 19px;
  border: 1px #606266 solid;
}
</style>
