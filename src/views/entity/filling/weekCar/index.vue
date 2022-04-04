<template>
  <div class="week-car">
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
        <el-form-item label="" prop="fromWeek">
          <el-select v-model="formParams.fromWeek" placeholder="请选择" style="width: 150px">
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
        <el-button v-if="permissions.entity_weekvan_add" type="primary" size="mini" @click="operateData('add')">
          填报
        </el-button>
        <el-button
          v-if="permissions.entity_weekvan_edit"
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
        <el-table-column fixed label="车辆类型" prop="vehicleType" width="180" />
        <el-table-column v-for="(innerHead, idx) in tableHead" :key="idx">
          <template slot="header">第{{ tableData[0].weeklist[idx].week }}周</template>
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
    <AddWeekCar :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
    <!-- 修改数据-->
    <UpdateWeekCar :dialog-vo="editDialogVo" @setDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script>
import { fetchList } from '@/api/report/weekCar'
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex'
import AddWeekCar from './components/addWeekCar'// 【填报车辆型号流量统计数据】
import UpdateWeekCar from './components/updateWeekCar'// 【修改车辆型号流量统计数据】
import { reportCurrentYear, beforeWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
import { exportExcel } from '@/util/exportExcel'
export default {
  name: 'WeekCar',
  components: { AddWeekCar, UpdateWeekCar },
  data() {
    return {
      tableUpdate: true, // 强制刷新vuetable组件，否则切换周的时候不显示正确的数据
      isAllowFilling: false,
      dialogVo: {
        title: '车辆型号流量数据填报',
        visible: false,
        vehicleType: []
      },
      editDialogVo: {
        title: '车辆型号流量数据修改',
        visible: false,
        formParams: {}
      },
      formParams: {
        year: reportCurrentYear(),
        fromWeek: beforeWeek(),
        endWeek: getYearWeek()
      },
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        weekList: selectWeekList(), // 周的下拉框
        vehicleType: [] // 车辆类型
      },
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
            property: 'buyerCarCount',
            label: '采购商数量'
          },
          {
            width: 80,
            property: 'merchantCarCount',
            label: '商户数量'
          }
        ]
      }
      // 动态表头index
      this.tableHead.push(innerHead)
    },
    getSelectList() {
      // 车辆类型
      remote('van_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.vehicleType = res.data.data
          this.dialogVo.vehicleType = this.selectOptions.vehicleType.map((item) => {
            return {
              id: item.value,
              itemName: item.label + `(${item.description})`
            }
          })
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
      if (this.formParams.fromWeek > this.formParams.endWeek) {
        this.$message.error('请选择正确周区间')
        return false
      }
      this.tableUpdate = false
      this.tableLoading = true
      const dtt = new Date(this.formParams.year)
      const year = dtt.getFullYear()
      const pageQueryVo = {
        year: year,
        fromWeek: this.formParams.fromWeek,
        endWeek: this.formParams.endWeek
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.isAllowFilling = res.data.data.isAllowFilling
          this.tableData = res.data.data.records
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
    // 填报
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
      exportExcel('weekCar', this.$refs['report-table'].$el)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.week-car {
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
