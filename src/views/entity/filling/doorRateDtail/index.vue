<template>
  <div class="door-rate-detail">
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
        <el-button v-if="permissions.entity_weekopen_add" type="primary" size="mini" @click="operateData('add')">
          填报
        </el-button>
        <el-button
          v-if="permissions.entity_weekopen_edit"
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
        <!-- <el-table-column
          fixed
          label="商铺总数量"
          prop="sum"
          width="180"
        /> -->
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
              <span v-if="item.label !== '开门率'">
                {{ scope.row.weeklist[idx][item.property] | numberToCurrency }}
              </span>
              <span v-else>
                {{ scope.row.weeklist[idx][item.property] }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-empty v-if="!tableUpdate" description="加载中" image="/img/loading.gif" :image-size="35" />
    </div>
    <!-- 填报数据 -->
    <AddDoorRate :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
    <!-- 修改数据 -->
    <UpdateDoorRate :dialog-vo="editDialogVo" @setDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script>
import { fetchList } from '@/api/report/doorRate'
import { mapGetters } from 'vuex'
import AddDoorRate from './components/addDoorRate'// 填报数据
import UpdateDoorRate from './components/updateDoorRate'// 填报数据
import { reportCurrentYear, beforeWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
import { getSelectKindsList } from '@/api/category'
import { exportExcel } from '@/util/exportExcel'
export default {
  name: 'WeekCar',
  components: { AddDoorRate, UpdateDoorRate },
  data() {
    return {
      tableUpdate: true, // 强制刷新vuetable组件，否则切换周的时候不显示正确的数据
      isAllowFilling: false,
      dialogVo: {
        title: '开门率数据填报',
        visible: false,
        kindsList: []
      },
      editDialogVo: {
        title: '开门率数据修改',
        visible: false,
        kindsList: [],
        formParams: {}
      },
      formParams: {
        year: reportCurrentYear(),
        startWeek: beforeWeek(),
        endWeek: getYearWeek()
      },
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        kindsList: [],
        weekList: selectWeekList() // 周的下拉框
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
            property: 'totalCount',
            label: '商铺总数量'
          },
          {
            width: 100,
            property: 'changeCount',
            label: '商铺数增减'
          },
          {
            width: 80,
            property: 'openCount',
            label: '开门数量'
          },
          {
            width: 80,
            property: 'openRatio',
            label: '开门率'
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
      if (this.formParams.fromWeek > this.formParams.endWeek) {
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
      exportExcel('doorRate', this.$refs['report-table'].$el)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.door-rate-detail {
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
