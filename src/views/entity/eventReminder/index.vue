<template>
  <div class="even-reminder znp-table-container content-p24">
    <el-tabs v-model="active">
      <el-tab-pane label="合同提醒" name="contract">
        <ContractRemind :select-options="selectOptions" />
      </el-tab-pane>
      <el-tab-pane label="收费提醒" name="fee">
        <FeeRemind :select-options="selectOptions" />
      </el-tab-pane>
      <el-tab-pane label="欠费提醒" name="arrears">
        <ArrearsRemind :select-options="selectOptions" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ContractRemind from './components/contractRemind'// 【合同提醒】
import FeeRemind from './components/feeRemind'// 【收费提醒】
import ArrearsRemind from './components/arrearsRemind'// 【欠费提醒】
import { getSelectKindsList } from '@/api/category'
import { getSelectBuildingList } from '@/api/building'
export default {
  name: 'EvenReminder',
  components: {
    ContractRemind, ArrearsRemind, FeeRemind
  },
  data() {
    return {
      selectOptions: {
        buildingList: [],
        kindsList: [] // 业态
      },
      active: 'contract'
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
  },
  methods: {
    getSelectList() {
      // 楼层 参数传0 代表只查询楼层
      getSelectBuildingList(0).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.buildingList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 主营品类(level = 0 只查询第1级)
      getSelectKindsList('0').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.kindsList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.area {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
}
</style>
