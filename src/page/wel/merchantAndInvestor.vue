<template>
  <div class="znp-filter-container merchant-and-investor">
    <el-row>
      <el-col :span="24" class="row-first-child">
        <el-col :span="8">
          <h4>商户总数</h4>
          <h5>{{ merchant.total }}</h5>
        </el-col>
        <el-col :span="8">
          <h4>商铺总数</h4>
          <h5>{{ shop.total }}</h5>
        </el-col>
        <el-col :span="8">
          <h4>业主总数</h4>
          <h5>{{ investor.total }}</h5>
        </el-col>
      </el-col>
      <el-col :span="24" class="row-second-three-child">
        <div id="myChartBarByMerchanAndInvestor" class="znp-index-echarts"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import { getMerchantinvestorList } from '@/api/wel'
export default {
  name: 'MerchantinvestorList',
  components: {
  },
  data() {
    return {
      merchant: {
        addOfWeek: 1,
        addRatio: '',
        countEntity: {
          countList: [],
          monthList: []
        },
        total: ''
      },
      investor: {
        addOfWeek: 1,
        addRatio: '',
        countEntity: {
          countList: [],
          monthList: []
        },
        total: ''
      },
      shop: {
        addOfWeek: 1,
        addRatio: '',
        countEntity: {
          countList: [],
          monthList: []
        },
        total: ''
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.searchDataFun()
  },
  methods: {
    searchDataFun() {
      getMerchantinvestorList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.investor = res.data.data.investor
          this.merchant = res.data.data.merchant
          this.shop = res.data.data.shop
          this.drawBar('myChartBarByMerchanAndInvestor')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    drawBar(type) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById(type))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '各市场商户和商铺数量',
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
          data: ['商户', '商铺'],
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
            // prettier-ignore
            data: this.merchant.countEntity.monthList
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
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            position: 'right',
            axisLine: {
              show: true
            }
          }
        ],
        series: [
          {
            name: '商户',
            type: 'bar',
            data: this.merchant.countEntity.countList,
            color: '#5aa0ff',
            barMaxWidth: 15 // 柱图宽度
          },
          {
            name: '商铺',
            type: 'bar',
            yAxisIndex: 1,
            data: this.shop.countEntity.countList,
            color: '#ffb94a',
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
.merchant-and-investor {
  height: 100%;
  .el-row {
    height: 100%;
    .row-first-child {
      height: 25%;
      .el-col {
        text-align: center;
      }
      h4 {
        margin: 0;
        font-size: 18px;
        margin-bottom: 20px;
      }
      h5 {
        margin: 10px 0px;
        font-size: 20px;
      }
      .add-of-week-wrap {
        margin-top: 6px;
        .add-of-week {
          font-size: 13px;
        }
      }
    }
    .row-second-three-child {
      height: 72%;
      .znp-index-echarts {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: inline-block;
      }
    }
  }
}
</style>

