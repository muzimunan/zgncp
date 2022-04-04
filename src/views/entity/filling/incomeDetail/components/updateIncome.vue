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
        <el-table-column fixed label="费用名称" prop="feeitemName" width="180" />
        <el-table-column v-for="(item, idx) in tableHead" :key="idx">
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
          <template slot-scope="scope">
            <span>
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
import { fetchList, putObj } from '@/api/report/income'
import { getYearByWeek, getYearWeek, selectWeekList } from '@/util/dateUtil'
export default {
  name: 'UpdateIncome',
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
      handler: function(l) {
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
        width: 100,
        property: 'income',
        label: '数量'
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
          // 删除weeklist中的week为-1和0的周
          this.tableData.forEach(obj => {
            obj.weeklist.splice(obj.weeklist.findIndex(item => item.week === -1), 1)
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
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
</style>
