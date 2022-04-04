<template>
  <div class="standing-book-report">
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button
          type="success"
          size="mini"
          @click="exportExcel()"
          v-if="permissions.entity_rentstandingbook_sum_expt"
        >
          导出
        </el-button>
      </div>
      <el-table
        ref="report-table"
        :data="tableData"
        style="width: 100%"
        v-loading="tableLoading"
        align="center"
        :summary-method="getSummaries"
        :span-method="arraySpanMethod"
        show-summary
      >
        <el-table-column :label="tableTitle" align="center">
          <el-table-column prop="areaName" label="区域" align="center"></el-table-column>
          <el-table-column prop="position" label="楼栋号" align="center"></el-table-column>
          <el-table-column prop="operationKindsName" label="业态/品类" align="center"></el-table-column>
          <el-table-column prop="rentPriceStandard" label="租金标准(元/㎡/月)" align="center"></el-table-column>
          <el-table-column prop="totalBoothCount" label="商铺摊位总数" align="center"></el-table-column>
          <el-table-column prop="totalRentAcr" label="总出租面积" align="center"></el-table-column>
          <el-table-column
            prop="totalRentPrice"
            label="总出租面积年应收金额(万元)"
            width="200"
            align="center"
          ></el-table-column>
          <el-table-column prop="totalRentedBoothCount" label="已出租商铺摊位数" align="center"></el-table-column>
          <el-table-column prop="totalRentedAcr" label="出租签约面积(㎡)" align="center"></el-table-column>
          <el-table-column prop="realPrice" label="已出租面积年实收金额(万元)" align="center"></el-table-column>
          <el-table-column prop="rentedRatio" label="出租率" align="center"></el-table-column>
          <el-table-column prop="deposit" label="保证金(万元)" align="center"></el-table-column>
          <el-table-column prop="propertyFee" label="年物业费(万元)" align="center"></el-table-column>
          <el-table-column prop="totalFee" label="年应计费合计(万元)" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchSumList } from '@/api/rentstandingbook'
import { mapGetters } from 'vuex'
import { exportExcel } from '@/util/exportExcel'
export default {
  name: 'StandingBookReport',
  components: {},
  data() {
    return {
      tableTitle: '',
      tableLoading: true, // loading
      tableData: [],
      areaIdArr: [], // 省份要合并数组 [2,0,1,3,0,0] 代表第一二行合并,第三行不变,第四五六行合并,0代表原本的那一行被合并,因此这个列被消除
      areaIdPos: 0 // 省份要合并数组内容的序号
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo'])
  },
  watch: {
  },
  created() {
    // 获取列表数据
    this.tableTitle = '中国农批' + this.userInfo.marketName + this.userInfo.yearByWeek + '年物业租赁台账汇总表'
    this.searchDataFun()
  },
  methods: {
    // 查询列表
    searchDataFun() {
      this.tableLoading = true
      const pageQueryVo = {
      }
      fetchSumList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = []
          const records = res.data.data.records
          records.forEach(item => {
            item.summaryList.forEach(obj => {
              obj.areaName = item.areaName
              obj.areaId = item.areaId
              this.tableData.push(obj)
            })
          })
          this.merage() // 合并的方法
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 第一列的合并方法
        const _row_1 = this.areaIdArr[rowIndex]
        const _col_1 = _row_1 > 0 ? 1 : 0 // 如果被合并了_row=0则它这个列需要取消
        return {
          rowspan: _row_1,
          colspan: _col_1
        }
      }
    },
    merage() {
      // 要合并的数组sw===
      this.merageInit()
      for (var i = 0; i < this.tableData.length; i++) {
        if (i === 0) {
          // 第一行必须存在
          this.areaIdArr.push(1)
          this.areaIdPos = 0
        } else {
          // 判断当前元素与上一个元素是否相同 this.areaIdPos是areaIdArr内容的序号
          if (this.tableData[i].areaId === this.tableData[i - 1].areaId) {
            this.areaIdArr[this.areaIdPos] += 1
            this.areaIdArr.push(0)
          } else {
            this.areaIdArr.push(1)
            this.areaIdPos = i
          }
        }
      }
    },
    merageInit() {
      // 初始化合并行的数组
      this.areaIdArr = []
      this.areaIdPos = 0
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = Number(sums[index]).toFixed(2)
          sums[3] = (sums[6] * 10000 / sums[5] / 12).toFixed(2) // 元/m2/月
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    },
    exportExcel() {
      exportExcel('standingBookReport', this.$refs['report-table'].$el)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.standing-book-report {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
}
</style>
