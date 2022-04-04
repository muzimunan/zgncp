<template>
  <div class="summation">
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_weeksales_add" type="primary" size="mini" @click="operateData('add')">
          填报
        </el-button>
        <el-button v-if="permissions.entity_weeksales_edit" type="primary" size="mini" @click="operateData('update')">
          修改
        </el-button>
        <el-button type="success" size="mini" @click="exportExcel()">导出</el-button>
      </div>
      <div>
        <el-descriptions title="" size="medium">
          <el-descriptions-item label="可销售面积(平米)">
            {{ totalSalesableData.saleableAcr | numberToCurrency }}
          </el-descriptions-item>
          <el-descriptions-item label="销售面积(平米)">
            {{ totalSalesableData.saledAcr | numberToCurrency }}
          </el-descriptions-item>
          <el-descriptions-item label="销售面积进度">
            <el-progress
              v-if="
                Number(totalSalesableData.saleableAcr) !== 0 &&
                Number(((totalSalesableData.saledAcr / totalSalesableData.saleableAcr) * 100).toFixed(2))
              "
              :text-inside="true"
              :stroke-width="26"
              :percentage="Number(((totalSalesableData.saledAcr / totalSalesableData.saleableAcr) * 100).toFixed(2))"
            />
            <el-progress v-else :text-inside="true" :stroke-width="26" :percentage="0.0" />
          </el-descriptions-item>
          <el-descriptions-item label="可销售套数(间)">
            {{ totalSalesableData.saleableRoom | numberToCurrency }}
          </el-descriptions-item>
          <el-descriptions-item label="销售套数(间)">
            {{ totalSalesableData.saledRoom | numberToCurrency }}
          </el-descriptions-item>
          <el-descriptions-item label="销售套数进度">
            <el-progress
              v-if="
                Number(totalSalesableData.saleableRoom) !== 0 &&
                Number(((totalSalesableData.saledRoom / totalSalesableData.saleableRoom) * 100).toFixed(2))
              "
              :text-inside="true"
              :stroke-width="26"
              :percentage="Number(((totalSalesableData.saledRoom / totalSalesableData.saleableRoom) * 100).toFixed(2))"
            />
            <el-progress v-else :text-inside="true" :stroke-width="26" :percentage="0.0" />
          </el-descriptions-item>
          <el-descriptions-item label="套均面积(平米/套)">
            {{
              Number(totalSalesableData.saleableRoom) !== 0
                ? (totalSalesableData.saleableAcr / totalSalesableData.saleableRoom).toFixed(2)
                : 0.0
            }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-table
        v-if="tableUpdate"
        ref="report-table"
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        :data="tableData"
        border
        size="small"
      >
        <el-table-column fixed label="项目名称" prop="saleType" width="180" />
        <el-table-column v-for="(item, idx) in tableHead" :key="idx">
          <template slot="header">
            <span v-if="tableData[0].weeklist[idx].week === -1">总计</span>
            <span v-else-if="tableData[0].weeklist[idx].week === 0">上期结转</span>
            <span v-else-if="tableData[0].weeklist[idx].week > 0">第{{ tableData[0].weeklist[idx].week }}周</span>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.weeklist[idx][item.property] | numberToCurrency }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!tableUpdate" description="加载中" image="/img/loading.gif" :image-size="35" />
    </div>
    <!-- 填报数据 -->
    <AddSalesTypeData :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
    <!-- 修改数据 -->
    <UpdateSalesTypeData :dialog-vo="editDialogVo" @setDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script>
import AddSalesTypeData from './components/addSalesTypeData'
import UpdateSalesTypeData from './components/updateSalesTypeData'
import { mapGetters } from 'vuex'
import { exportExcel } from '@/util/exportExcel'
export default {
  name: 'SalesType',
  components: { AddSalesTypeData, UpdateSalesTypeData },
  props: {
    formParams: {
      type: Object,
      default: () => { }
    },
    tableData: {
      type: Array,
      default: () => []
    },
    itemList: {
      type: Array,
      default: () => []
    },
    marketPeriodList: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    totalSalesableData: {
      type: Object,
      default: () => { }
    },
    tableUpdate: {
      type: Boolean,
      default: false
    },
    isAllowFilling: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const _that = this
    return {
      dialogVo: {
        title: '销售跟踪数据填报',
        visible: false,
        itemList: _that.itemList,
        type: _that.type,
        marketPeriodList: []
      },
      editDialogVo: {
        title: '销售跟踪数据修改',
        visible: false,
        formParams: {},
        type: '',
        marketPeriodList: []
      },
      tableHead: []// 数据展示表格
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    tableData(l) {
      this.dialogVo.marketPeriodList = this.marketPeriodList
      this.editDialogVo.marketPeriodList = this.marketPeriodList
      this.tableHead = []
      this.tableData[0].weeklist.forEach((i) => {
        // 表头
        this.updateHeader()
      })
    }
  },
  created() {
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
    // 填报
    operateData(operateType) {
      if (operateType === 'add') {
        this.dialogVo.visible = true
      } else {
        this.editDialogVo.visible = true
        this.editDialogVo.formParams = this.formParams
        this.editDialogVo.type = this.type
      }
    },
    // 子组件控制弹框展示或者隐藏
    setDialogVisiable(data) {
      this.dialogVo.visible = data
      this.editDialogVo.visible = data
      this.$emit('searchDataFun')
    },
    exportExcel() {
      exportExcel('weekSales' + this.type, this.$refs['report-table'].$el)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
</style>
