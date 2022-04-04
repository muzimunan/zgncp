<template>
  <div class="week-trade">
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
        <el-button v-if="permissions.entity_weektrade_add" type="primary" size="mini" @click="operateData('add')">
          填报
        </el-button>
        <el-button
          v-if="permissions.entity_weektrade_edit"
          type="primary"
          size="mini"
          plain
          @click="operateData('update')"
        >
          修改
        </el-button>
        <el-button type="success" size="mini" @click="exportExcel()">导出</el-button>
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
        <el-table-column fixed label="业态名称" prop="kindsName" width="180" />
        <el-table-column>
          <template slot="header">合计</template>
          <el-table-column fixed label="年累计交易量(吨)" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.manualCount | numberToCurrency }}</span>
            </template>
          </el-table-column>
          <el-table-column label="统计手段(地磅系统/人工)" prop="tradeType" width="180" />
          <el-table-column label="年累计交易金额(万元)" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.manualMoney | numberToCurrency }}</span>
            </template>
          </el-table-column>
          <el-table-column label="统计手段(电子交易/人工)" prop="tradeType" width="180" />
          <el-table-column label="交易均价(万元/吨)" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.averagePrice | numberToCurrency }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column v-for="(innerHead, idx) in tableHead" :key="idx">
          <template slot="header">
            <span v-if="tableData[0].weeklist[idx].week === 0">前期结转</span>
            <span v-else-if="tableData[0].weeklist[idx].week > 0">第{{ tableData[0].weeklist[idx].week }}周</span>
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
              <span>{{ scope.row.weeklist[idx][item.property] | numberToCurrency }}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-empty v-if="!tableUpdate" description="加载中" image="/img/loading.gif" :image-size="35" />
    </div>
    <!-- 填报数据 -->
    <AddTrade :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
    <!-- 修改数据 -->
    <UpdateWeekTrade :dialog-vo="editDialogVo" @setDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script>
import { fetchList } from '@/api/report/weekTrade'
import { mapGetters } from 'vuex'
import AddTrade from './components/addTrade'// 【填报车辆型号流量统计数据】
import UpdateWeekTrade from './components/updateWeekTrade'// 【修改车辆型号流量统计数据】
import { getSelectKindsList } from '@/api/category'
import { reportCurrentYear, beforeWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
import { exportExcel } from '@/util/exportExcel'
export default {
  name: 'WeekTrade',
  components: { AddTrade, UpdateWeekTrade },
  data() {
    return {
      tableUpdate: true, // 强制刷新vuetable组件，否则切换周的时候不显示正确的数据
      isAllowFilling: false,
      dialogVo: {
        title: '交易量数据填报',
        visible: false,
        kindsList: []
      },
      editDialogVo: {
        title: '交易量数据修改',
        visible: false,
        formParams: {}
      },
      formParams: {
        year: reportCurrentYear(),
        startWeek: beforeWeek(),
        endWeek: getYearWeek()
      },
      tableLoading: true,
      tableData: [],
      selectOptions: {
        weekList: selectWeekList(), // 周的下拉框
        kindsList: [] // 主营品类
      },
      tableHeadAll: [{
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
      }], // 合计表头
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
    getSelectList() {
      // 主营品类(level = 0 只查询第1级)
      getSelectKindsList('0').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.kindsList = res.data.data
          this.dialogVo.kindsList = res.data.data
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
      exportExcel('weekTrade', this.$refs['report-table'].$el)
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

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.week-trade {
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
