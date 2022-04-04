<template>
  <div class="bring-fee-item">
    <el-dialog
      :title="bringDialogVo.title"
      :visible="bringDialogVo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="1000px"
    >
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="detailsTyp">
          <el-select v-model="formParams.detailsTyp" placeholder="计费方式" style="width: 100%" clearable>
            <el-option
              v-for="item in selectOptions.chargeType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="feebillCode">
          <el-input v-model="formParams.feebillCode" placeholder="请输入费用账单编号" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch()">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="">
        <el-table :data="tableData" style="width: 100%" border size="small" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" />
          <el-table-column prop="feebillCode" label="账单编号" width="150" />
          <el-table-column prop="feeformName" label="收费项目名称" width="200" />
          <el-table-column prop="startDate" label="开始日期" />
          <el-table-column prop="endDate" label="结束日期" />
          <el-table-column prop="payTypeName" label="计费方式" />
          <el-table-column prop="count" label="数量" />
          <el-table-column prop="unitPrice" label="收费金额/单价" width="100" />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getListByFeeItem, addObjBath } from '@/api/feepaydetails'
import { remote } from '@/api/admin/dict'
export default {
  name: 'BringFeeItem',
  props: {
    bringDialogVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      selectOptions: {
        chargeType: [] // 计费方式
      },
      formParams: {
        feebillCode: '', // 费用账单编号
        detailsTyp: '' // 计费方式
      },
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {
  },
  watch: {
    'bringDialogVo': {
      handler: function(l) {
        if (l.visible) {
          this.handlerSearch()
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    }
  },
  mounted() {
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
    getSelectList() {
      // 计费方式
      remote('charge_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.chargeType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handlerSearch() {
      getListByFeeItem({
        merchantId: this.bringDialogVo.merchantId,
        feebillCode: this.formParams.feebillCode || undefined, // 费用账单编号
        detailsTyp: this.formParams.detailsTyp || undefined // 计费方式
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data
        } else {
          this.$message.error('查询失败，请联系系统管理员')
        }
      })
    },
    saveBtn() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请选择数据')
        return
      }
      const feepayDetailsList = this.multipleSelection.map((item) => {
        return {
          feepayId: this.bringDialogVo.feepayId,
          unitPrice: item.unitPrice, // 单价/收费金额
          payType: item.payType, // 收费方式
          startDate: item.startDate, // 开始时间
          count: item.count, // 数量
          endDate: item.endDate, // 结束时间
          feeformId: item.feeformId, // 收费项id
          feebillId: item.feebillId, // 费用账单id
          feebilldetailsId: item.feebilldetailsId, // 费用单明细id
          feeItemId: item.feeItemId // 收费科目id
        }
      })
      const json = {
        merchantId: this.bringDialogVo.merchantId,
        feepayDetailsList: feepayDetailsList
      }
      addObjBath(json).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.$message.success('新增成功')
          this.cancelDialog()
        } else {
          this.$message.error('新增失败,' + res.data.msg)
        }
      })
    },
    cancelDialog() {
      this.$emit('setBringDialogVisiable', false)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
</style>
