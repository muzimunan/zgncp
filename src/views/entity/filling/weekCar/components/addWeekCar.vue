<template>
  <div class="filling-car-data">
    <el-dialog
      :title="dialogVo.title"
      :visible="dialogVo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="800px"
    >
      <el-table
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        border
        size="small"
      >
        <el-table-column fixed label="车辆类型" prop="vehicleType" width="250" />
        <el-table-column v-for="(innerHead, idx) in tableHead" :key="idx">
          <template slot="header">
            {{ yearByWeek }}年
            <el-select v-model="tableData[0].weeklist[idx].week" placeholder="请选择周" style="width: 100px" disabled>
              <el-option
                v-for="item in selectOptions.weekList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
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
                <!-- {{scope.row.weeklist[idx][item.property]}} -->
                <el-input-number
                  v-model="scope.row.weeklist[idx][item.property]"
                  :min="0"
                  step-strictly
                  :controls="false"
                />
              </span>
            </template>
          </el-table-column>
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
import { addObj } from '@/api/report/weekCar'
import { getYearByWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
export default {
  name: 'AddWeekCar',
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
        list: [
          {
            width: 100,
            property: 'buyerCarCount',
            label: '采购商数量'
          },
          {
            width: 80,
            property: 'merchantCarCount',
            label: '商户数量'
          }
        ]
      }]// 数据展示表格
    }
  },
  watch: {
    'dialogVo.vehicleType': {
      handler(l) {
        const vehickeList = _.cloneDeep(l)
        this.tableData = vehickeList.map((item) => {
          return {
            vehicleTypeId: item.id,
            vehicleType: item.itemName,
            weeklist: [
              {
                week: getYearWeek(),
                buyerCarCount: '',
                merchantCarCount: ''
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
