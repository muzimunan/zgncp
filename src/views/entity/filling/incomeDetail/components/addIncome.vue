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
        size="small"
      >
        <el-table-column label="费用名称" prop="feeitemName" width="180" />
        <el-table-column v-for="(item, idx) in tableHead" :key="idx">
          <template slot="header">
            {{ yearByWeek }}年
            <el-select v-model="tableData[0].weeklist[idx].week" placeholder="请选择周" style="width: 100px" disabled>
              <el-option
                v-for="week in selectOptions.weekList"
                :key="week.value"
                :label="week.label"
                :value="week.value"
              />
            </el-select>
          </template>
          <template slot-scope="scope">
            <span>
              <el-input-number v-model="scope.row.weeklist[idx][item.property]" :precision="2" :controls="false" />
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash'
import { addObj } from '@/api/report/income'
import { getYearByWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
export default {
  name: 'AddIncome',
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
      tableHead: [{
        width: 100,
        property: 'income',
        label: '数量'
      }]// 数据展示表格
    }
  },
  watch: {
    'dialogVo.feeTypeList': {
      handler(l) {
        const feeTypeList = _.cloneDeep(l)
        this.tableData = feeTypeList.map((item) => {
          return {
            feeitemId: item.id,
            feeitemName: item.operationKindsName,
            weeklist: [
              {
                week: getYearWeek(),
                income: ''
              }
            ]
          }
        })
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
    saveBtn() {
      const weekStr = this.tableData[0].weeklist[0].week
      for (let i = 0; i < this.tableData.length; i++) {
        for (let k = 0; k < this.tableData[i].weeklist.length; k++) {
          this.tableData[i].weeklist[k].week = weekStr
        }
      }
      addObj(this.tableData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.$message.success('新增成功')
          this.cancelDialog()
        } else {
          this.$message.error('新增失败,' + res.data.msg)
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
