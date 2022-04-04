<template>
  <div class="more-dialog">
    <el-dialog
      :visible="moreDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      width="1000px"
    >
      <div v-if="moreDialog.detailType === 'estate'">
        <EstateDetail />
      </div>
      <div v-else-if="moreDialog.detailType === 'investor'">
        <InvestorDetail />
      </div>
      <div v-else-if="moreDialog.detailType === 'merchant'">
        <MerchantDetail />
      </div>
      <div v-else-if="moreDialog.detailType === 'salecontract'">
        <SalesContractDetail />
      </div>
      <div v-else>
        <RentContractDetail />
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import EstateDetail from '@/views/entity/estate/components/detail'// 物业详情
import InvestorDetail from '@/views/entity/investor/components/detail'// 业主详情
import SalesContractDetail from '@/views/entity/salesContract/components/detail'// 销售合同详情
import MerchantDetail from '@/views/entity/merchant/components/detail'// 商户详情
import RentContractDetail from '@/views/entity/rentContract/components/detail'// 租赁合同详情
export default {
  name: 'MoreDialog',
  components: { EstateDetail, InvestorDetail, SalesContractDetail, MerchantDetail, RentContractDetail },
  props: {
    moreDialog: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
    }
  },
  watch: {
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
    cancelDialog() {
      this.$emit('cancelMoreDialog', false)
    }
  }
}
</script>

<style scoped lang="scss">
.more-dialog {
  ::v-deep .el-dialog__body {
    padding: 0px !important;
  }
  ::v-deep .znp-form-wraper {
    padding-top: 0px !important;
  }
  ::v-deep .go-back {
    display: none !important;
  }
}
</style>
