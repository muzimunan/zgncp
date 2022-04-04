<template>
  <div class="filling-car-data">
    <el-dialog
      :title="dialogVo.title"
      :visible="dialogVo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="700px"
    >
      <el-table
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        border
        size="mini"
      >
        <el-table-column fixed label="业态名称" prop="kindsName" width="180" />
        <el-table-column v-for="(innerHead, idx) in tableHead" :key="idx">
          <template slot="header">
            {{ yearByWeek }}年
            <el-select
              v-model="tableData[0].weeklist[idx].week"
              placeholder="请选择周"
              style="width: 100px"
              @change="weekChange"
              disabled
            >
              <el-option
                v-for="item in selectOptions.weekList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <el-table-column
            v-for="(item, index) in innerHead.list"
            :key="index"
            :prop="item.property"
            :min-width="item.width"
          >
            <template slot="header">
              {{ item.label }}
            </template>
            <template slot-scope="scope">
              <span>
                <el-input-number
                  v-model="scope.row.weeklist[idx][item.property]"
                  :min="0"
                  :precision="2"
                  :controls="false"
                ></el-input-number>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button @click="saveBtn" type="primary">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { fetchList, putObj } from '@/api/report/weekTrade'
import { getYearByWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
export default {
  name: 'UpdateWeekTrade',
  props: {
    dialogVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      yearByWeek: getYearByWeek(),
      selectOptions: {
        weekList: selectWeekList() // 周的下拉框
      },
      tableData: [], // 填报表格
      tableHead: []// 数据展示表格
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    'dialogVo': {
      handler(l) {
        this.searchDataFun(getYearWeek())
      },
      immediate: true,
      // 对象内部的属性监听，深度监听
      deep: true
    }
  },
  mounted() {
  },
  created() {
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
    updateHeader() {
      const innerHead = {
        list: [
          {
            width: 100,
            property: 'manualCount',
            label: '交易量(吨)'
          },
          {
            width: 80,
            property: 'manualMoney',
            label: '交易金额(万元)'
          }
        ]
      }
      // 动态表头index
      this.tableHead.push(innerHead)
    },
    searchDataFun(currentWeek) {
      const pageQueryVo = {
        year: this.dialogVo.formParams.year,
        startWeek: currentWeek,
        endWeek: currentWeek
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
          const objFirst = this.tableData.splice(0, 1)
          const objEnd = this.tableData.splice(this.tableData.length - 1, 1)
          this.tableData.forEach(obj => {
            // 1.先找到【obj.weeklist】数组中周为-1的索引【weekindex】和对象【weekObj】
            const weekindex = obj.weeklist.findIndex(item => item.week === -1)
            const weekObj = obj.weeklist[weekindex]
            // 2.将周为-1的对象值添加的外层【obj】对象属性上
            this.$set(obj, 'manualCount', weekObj.manualCount) // 年累计交易量(吨)
            this.$set(obj, 'manualMoney', weekObj.manualMoney) // 年累计交易金额(万元)
            this.$set(obj, 'tradeType', weekObj.tradeType === 0 ? '人工' : '') // 统计手段(地磅系统/人工)
            this.$set(obj, 'averagePrice', weekObj.averagePrice) // 交易均价(吨/万元)
            // 3.删除【obj.weeklist】中周为-1的对象
            obj.weeklist.splice(weekindex, 1)
            // 4.对【obj.weeklist】中的周进行从小到大的排序
            sortByKey(obj.weeklist, 'week')
          })
          // 整理合计行数据
          // 删除
          objFirst[0].weeklist.splice(objFirst[0].weeklist.findIndex(item => item.week === -1), 1)
          // 排序
          sortByKey(objFirst[0].weeklist, 'week')
          const objEndWeekObj = objEnd[0].weeklist[0]
          this.$set(objFirst[0], 'manualCount', objEndWeekObj.manualCount) // 年累计交易量(吨)
          this.$set(objFirst[0], 'manualMoney', objEndWeekObj.manualMoney) // 年累计交易金额(万元)
          this.$set(objFirst[0], 'tradeType', objEndWeekObj.tradeType === 0 ? '人工' : '') // 统计手段(地磅系统/人工)
          this.$set(objFirst[0], 'averagePrice', objEndWeekObj.averagePrice) // 交易均价(吨/万元)
          this.tableData.push(objFirst[0])
          this.tableData.splice(this.tableData.length - 1, 1)

          // 删除weeklist中的week为-1和0的周
          this.tableData.forEach(obj => {
            obj.weeklist.splice(obj.weeklist.findIndex(item => item.week === 0), 1)
          })

          this.tableHead = []
          this.tableData[0].weeklist.forEach((i) => {
            // 表头
            this.updateHeader()
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    weekChange(val) {
      this.searchDataFun(val)
    },
    saveBtn() {
      putObj(this.tableData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.$message.success('修改成功')
          this.cancelDialog()
        } else {
          this.$message.error('修改失败,' + res.data.msg)
        }
      })
    },
    cancelDialog() {
      this.$emit('setDialogVisiable', false)
    }
  }
}
function sortByKey(array, key) {
  return array.sort((a, b) => {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
</style>
