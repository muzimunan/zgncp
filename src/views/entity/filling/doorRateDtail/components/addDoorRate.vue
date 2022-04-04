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
        <el-table-column fixed label="业态名称" prop="kindsName" width="180" />
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
              <!-- <span v-if="item.property === 'openRatio'"> -->
              <!-- 开门率不允许修改，保留两位小数 -->
              <!-- <el-input-number
                  v-model="scope.row.weeklist[idx][item.property]"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  style="width: 100px"
                  disabled
                />
              </span> -->
              <span v-if="item.property === 'changeCount'">
                <!-- 商铺数增减可为负数 -->
                <el-input-number
                  v-model="scope.row.weeklist[idx][item.property]"
                  step-strictly
                  :controls="false"
                  style="width: 100px"
                />
              </span>
              <span v-else>
                <!-- 开门数最大值是商铺总数 20211217把商铺总数和开门率去掉了 不让市场端看和填说是 -->
                <el-input-number
                  v-model="scope.row.weeklist[idx][item.property]"
                  step-strictly
                  :controls="false"
                  style="width: 100px"
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
import { addObj } from '@/api/report/doorRate'
import _ from 'lodash'
import { getYearByWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
export default {
  name: 'AddDoorRate',
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
          // {
          //   width: 100,
          //   property: 'totalCount',
          //   label: '商铺总数量'
          // },
          {
            width: 100,
            property: 'changeCount',
            label: '商铺数增减'
          },
          {
            width: 80,
            property: 'openCount',
            label: '开门数量'
          }
          // {
          //   width: 80,
          //   property: 'openRatio',
          //   label: '开门率'
          // }
        ]
      }]// 数据展示表格
    }
  },
  watch: {
    'dialogVo.kindsList': {
      handler(l) {
        const kindsList = _.cloneDeep(l)
        this.tableData = kindsList.map((item) => {
          return {
            kindsId: item.id,
            kindsName: item.label,
            weeklist: [
              {
                week: getYearWeek(),
                changeCount: 0,
                openCount: 0
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
    },
    numberChange(val, item) {
      if (item.totalCount !== 0 && item.openCount !== 0) {
        item.openRatio = (item.openCount / item.totalCount) * 100
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}
</style>
