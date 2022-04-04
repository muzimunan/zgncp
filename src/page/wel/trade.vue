<template>
  <div class="znp-filter-container trade-wrapper">
    <h4>交易概况</h4>
    <div id="myChartPieByTrade" class="znp-index-echarts"></div>
    <!-- <div id="myChartBarByTrade" class="znp-index-echarts"></div> -->
    <div id="myChartLineByTrade" class="znp-index-echarts line"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getTradeList } from '@/api/wel'
export default {
  name: 'TradePage',
  data() {
    return {
      kindsData: [],
      tradeCountData: {
        marketList: [],
        countList: [],
        moneyList: []
      },
      tradeData: {
        marketList: [],
        moneyList: []
      }
    }
  },
  watch: {
  },
  mounted() {
    this.drawPie()
    // this.drawBar()
    this.drawLine()
  },
  created() {
    this.searchDataFun()
  },
  methods: {
    searchDataFun() {
      getTradeList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.kindsData = res.data.data.kindsData
          this.tradeData = res.data.data.tradeData
          this.tradeCountData = res.data.data.tradeCountData
          this.drawPie()
          // this.drawBar()
          this.drawLine()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChartPieByTrade'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '各业态交易额分布',
          left: 'left',
          textStyle: {
            fontWeight: 'normal',
            fontSize: '12'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: false
        },
        grid: {
        },
        series: [
          {
            name: '交易额',
            type: 'pie',
            radius: ['30%', '50%'],
            labelLine: {
              length: 15
            },
            label: {
              formatter: '  {b|{b}：}{per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                b: {
                  color: '#4C5058',
                  fontSize: 12,
                  lineHeight: 24
                },
                per: {
                  color: '#4C5058'
                }
              }
            },
            data: this.kindsData
          }
        ]
      })
      // 建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
    drawLine() {
      const t = this
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChartLineByTrade'))
      // 绘制图表
      myChart.setOption({
        color: ['#00DDFF', '#80FFA5'],
        title: {
          text: '近12周交易统计',
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
          data: ['交易额', '交易量']
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '22%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              formatter: (value) => {
                return value.split('').join('\n')
              }
            },
            data: this.tradeCountData.weekList
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '交易额',
            position: 'left',
            axisLine: {
              show: true
            }
          },
          {
            type: 'value',
            name: '交易量',
            position: 'right',
            axisLine: {
              show: true
            }
          }
        ],
        series: [
          {
            name: '交易额',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new t.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(0, 221, 255)'
                },
                {
                  offset: 1,
                  color: 'rgba(77, 119, 255)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: this.tradeCountData.moneyList
          },
          {
            name: '交易量',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            yAxisIndex: 1,
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new t.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgba(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: this.tradeCountData.countList
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
.trade-wrapper {
  height: 100%;
  h4 {
    margin: 0;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .znp-index-echarts {
    width: 100%;
    height: 42%;
    margin: 0 auto;
    display: inline-block;
  }
  .line {
    width: 100%;
    height: 50%;
  }
}
</style>

