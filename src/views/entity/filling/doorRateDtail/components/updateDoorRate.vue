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
              <span v-if="item.property === 'changeCount'">
                <!-- 商铺数增减可为负数 -->
                <el-input-number
                  v-model="scope.row.weeklist[idx][item.property]"
                  step-strictly
                  :controls="false"
                  style="width: 100px"
                ></el-input-number>
              </span>
              <span v-else>
                <!-- 开门数最大值是商铺总数 -->
                <el-input-number
                  v-model="scope.row.weeklist[idx][item.property]"
                  step-strictly
                  :controls="false"
                  style="width: 100px"
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
import { fetchList, putObj } from '@/api/report/doorRate'
import { getYearByWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
export default {
  name: 'UpdateDoorRate',
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
    'dialogVo.formParams': {
      handler(l) {
        this.searchDataFun(getYearWeek())
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
        list: [
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
          this.tableData.splice(this.tableData.length - 1, 1)
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
    },
    numberChange(val, item) {
      if (item.totalCount !== 0 && item.openCount !== 0) {
        item.openRatio = (((item.openCount / item.totalCount) * 100).toFixed(2)) + '%'
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
