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
        <el-table-column fixed label="项目名称" width="180">
          <template slot-scope="scope">
            {{ scope.row.saleType }}
            <span class="znp-red-sign">每周增减</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, idx) in tableHead" :key="idx">
          <template slot="header">
            <el-select
              v-model="tableData[0].marketPeriodCode"
              placeholder="请选择期"
              style="width: 100px"
              @change="
                val => {
                  periodChange(val, tableData[0].weeklist[idx].week)
                }
              "
              disabled
            >
              <el-option
                v-for="item in selectOptions.marketPeriodList"
                :key="item.periodCode"
                :label="item.periodName"
                :value="item.periodCode"
              />
            </el-select>
            &nbsp; {{ yearByWeek }}年&nbsp;
            <el-select
              v-model="tableData[0].weeklist[idx].week"
              placeholder="请选择周"
              style="width: 100px"
              @change="
                val => {
                  weekChange(val, tableData[0].marketPeriodCode)
                }
              "
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
          <template slot-scope="scope">
            <span v-if="parseInt(scope.row.saleTypeId) === 3">
              <el-input-number
                v-model="scope.row.weeklist[idx][item.property]"
                step-strictly
                :controls="false"
              ></el-input-number>
            </span>
            <span v-else>
              <el-input-number
                v-model="scope.row.weeklist[idx][item.property]"
                :precision="2"
                :controls="false"
              ></el-input-number>
            </span>
          </template>
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
import { fetchList, putObj } from '@/api/report/merchantSales'
import { getYearByWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
export default {
  name: 'UpdateSalesTypeData',
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
        marketPeriodList: [],
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
        if (l.visible) {
          this.selectOptions.marketPeriodList = l.marketPeriodList // [{ periodCode: 'P01', periodName: '一期' }, { periodCode: 'P02', periodName: '二期' }]
          this.searchDataFun(getYearWeek(), 'P01')
        }
      },
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
        width: 100,
        property: 'saleValue',
        label: '数量'
      }
      // 动态表头index
      this.tableHead.push(innerHead)
    },
    searchDataFun(currentWeek, periodCode) {
      const pageQueryVo = {
        year: this.dialogVo.formParams.year,
        startWeek: currentWeek,
        endWeek: currentWeek,
        estateTypeId: this.dialogVo.formParams.estateTypeId,
        marketPeriodCode: periodCode
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
          this.tableData.forEach(obj => {
            // 1. 过滤掉【obj.weeklist】数组中week为0或者-1的值
            obj.weeklist = obj.weeklist.filter(item => item.week !== 0 && item.week !== -1)
          })
          // 2.过滤掉不能修改的项
          this.tableData = this.tableData.filter(obj => obj.saleTypeId === 1 || obj.saleTypeId === 3 || obj.saleTypeId === 4 || obj.saleTypeId === 5)
          this.tableHead = []
          this.tableData[0].weeklist.forEach((i) => {
            this.updateHeader()
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    weekChange(val, period) {
      this.searchDataFun(val, period)
    },
    periodChange(val, week) {
      this.searchDataFun(week, val)
    },
    saveBtn() {
      // 添加type_id
      this.tableData.forEach(obj => {
        obj.typeId = this.dialogVo.type
        obj.typeName = parseInt(obj.typeId) === 1 ? '商铺' : (parseInt(obj.typeId) === 2 ? '办公' : '公寓')
      })
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
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
</style>
