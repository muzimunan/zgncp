<template>
  <div class="znp-filter-container fee-wrapper" ref="getFeeDivheight">
    <h4>收费概况</h4>
    <div class="znp-table-container fee-table-wrapper">
      <el-descriptions size="medium">
        <el-descriptions-item label="年度总目标">{{ yearTargetIncome }}</el-descriptions-item>
        <el-descriptions-item label="运营总收入">{{ income }}</el-descriptions-item>
        <el-descriptions-item label="达成进度">
          <el-progress
            class="my-progress"
            :text-inside="true"
            :stroke-width="26"
            :percentage="concludeRatio"
          ></el-progress>
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        ref="report-table"
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        border
        size="mini"
        class="wel-table"
      >
        <el-table-column label="收费项目" prop="feeItemName" />
        <el-table-column label="年累计" prop="yearFeeIncome" />
        <el-table-column label="当前周" prop="weekFeeIncome" />
      </el-table>
    </div>
    <div id="myChart" class="znp-index-echarts"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getFeeIncomeList } from '@/api/wel'
export default {
  name: 'FeePage',
  components: {
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      tableHeight: '',
      feeIncome: {
        feeIncomeList: [],
        weekList: []
      },
      yearTargetIncome: '0.00',
      income: '0.00',
      concludeRatio: 0.00
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.getFeeIncomeList()
    // 动态计算表格高度
    const divWrapHeight = document.documentElement.clientHeight || document.bodyclientHeight
    console.log(divWrapHeight)
    this.tableHeight = divWrapHeight < 940 ? '390px' : '67%'
  },
  methods: {
    getFeeIncomeList() {
      getFeeIncomeList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.currentFeeList
          this.feeIncome = res.data.data.recentWeekFee
          this.yearTargetIncome = res.data.data.yearTargetIncome
          this.income = res.data.data.income
          this.concludeRatio = res.data.data.concludeRatio
          this.drawBar()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '近12周收费统计',
          left: 'left',
          textStyle: {
            fontWeight: 'normal',
            fontSize: '12'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['收入合计'],
          itemHeight: 10
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              formatter: (value) => {
                return value.split('').join('\n')
              }
            },
            spiltLine: {
              show: true // 想要不显示网格线，改为false
            },
            // prettier-ignore
            data: this.feeIncome.weekList
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left',
            axisLine: {
              show: true
            },
            axisLabel: {
              margin: 2
            }
          }
        ],
        series: [
          {
            name: '收入合计',
            type: 'bar',
            data: this.feeIncome.feeIncomeList,
            color: '#5aa0ff',
            barMaxWidth: 15 // 柱图宽度
          }
        ]
      })
      // 建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.fee-wrapper {
  height: 100%;
  h4 {
    margin: 0;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .znp-index-echarts {
    width: 100%;
    height: 33%;
    margin: 0 auto;
    display: inline-block;
  }
  ::v-deep .my-progress {
    width: 100px !important;
    .el-progress-bar__outer {
      height: 20px !important;
    }
  }
}
</style>
