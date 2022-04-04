<template>
  <div class="shop-detail-dialog">
    <el-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      append-to-body
      class="znp-crud-dialog"
      width="1000px"
    >
      <el-descriptions title="基本信息" :column="2">
        <template slot="extra">
          <el-button type="text" size="mini" @click="openMoreDialog('estate', detailVo.estate.id)">
            更多
            <i class="el-icon-d-arrow-right"></i>
          </el-button>
        </template>
        <el-descriptions-item label="物业名称">
          {{ detailVo.estate.estateName }}
        </el-descriptions-item>
        <el-descriptions-item label="租赁面积">{{ detailVo.estate.buidingAcr }}</el-descriptions-item>
        <el-descriptions-item label="物业类型">{{ detailVo.estate.estateTypeName }}</el-descriptions-item>
        <el-descriptions-item label="所属区域">
          {{ detailVo.estate.areaName }}
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ detailVo.estate.remark }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :title="parseInt(detailVo.resultType) === 2 ? '商户信息' : '业主信息'" :column="2" v-if="detailVo.personnelInfo.id">
        <template slot="extra">
          <el-button type="text" size="mini" @click="openMoreDialog('personnelInfo', detailVo.personnelInfo.id)">
            更多
            <i class="el-icon-d-arrow-right"></i>
          </el-button>
        </template>
        <el-descriptions-item :label="parseInt(detailVo.resultType) === 2 ? '商户名' : '业主名'">
          {{ detailVo.personnelInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人姓名">{{ detailVo.personnelInfo.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailVo.personnelInfo.contactPhone }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="合同信息" :column="2" v-if="detailVo.contractInfo.id">
        <template slot="extra">
          <el-button type="text" size="mini" @click="openMoreDialog('contractInfo', detailVo.contractInfo.id)">
            更多
            <i class="el-icon-d-arrow-right"></i>
          </el-button>
        </template>
        <el-descriptions-item label="合同编码">
          {{ detailVo.contractInfo.contractCode }}
          <el-tag type="danger" effect="plain" v-if="parseInt(detailVo.resultType) === 2">还有{{ detailVo.contractInfo.toExpireDay }}天到期</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="合同名称">{{ detailVo.contractInfo.contractName }}</el-descriptions-item>
        <el-descriptions-item label="起始日期">{{ detailVo.contractInfo.startDate }}</el-descriptions-item>
        <el-descriptions-item label="截止日期">{{ detailVo.contractInfo.endDate }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">关 闭</el-button>
      </span>
    </el-dialog>
    <MoreDialog :more-dialog="moreDialog" @cancelMoreDialog="cancelMoreDialog" />
  </div>
</template>

<script type="text/ecmascript-6">
import { kanbanView } from '@/api/kanban'
import MoreDialog from './moreDialog'
export default {
  name: 'ShopDetailDialog',
  components: { MoreDialog },
  props: {
    dialog: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      moreDialog: {
        title: '查看详情',
        visible: false,
        detailType: '' // 0物业 1:销售 2:租赁
      }, // 更多弹框
      detailVo: {
        resultType: '', // 1:销售 2:租赁
        estate: {},
        personnelInfo: {},
        contractInfo: {}
      } // 弹框对象
    }
  },
  watch: {
    dialog: {
      handler(l) {
        if (l.visible) {
          this.queryDetailVo()
        }
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
    queryDetailVo() {
      kanbanView({
        estateCode: this.dialog.estateCode,
        type: this.dialog.type === 'rent' ? '0' : (this.dialog.type === 'sale' ? '1' : (this.dialog.type === 'opendoor' ? '2' : '3'))
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.detailVo = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    cancelDialog() {
      this.$emit('cancelDialog', false)
    },
    // 点击更多显示弹框
    openMoreDialog(type, id) {
      this.moreDialog.visible = true
      // 逻辑说明: 如果type是estate 就查询物业详情
      // 如果type是personnelInfo  根据【this.detailVo.resultType 1:销售 2:租赁】 如果是1就是业主investor如果是2就是商户merchant
      // 如果type是contractInfo  根据【this.detailVo.resultType 1:销售 2:租赁】 如果是1就是销售合同salecontract如果是2就是商户rentcontract
      this.moreDialog.detailType = type === 'estate' ? 'estate' : (type === 'personnelInfo' ? (parseInt(this.detailVo.resultType) === 1 ? 'investor' : 'merchant') : (parseInt(this.detailVo.resultType) === 1 ? 'salecontract' : 'rentcontract'))
      this.$router.replace({
        query: {
          ...this.$route.query,
          operateType: 'look',
          id: id
        }
      })
    },
    cancelMoreDialog() {
      this.moreDialog.visible = false
      const newQuery = JSON.parse(JSON.stringify(this.$route.query)) // 深拷贝
      delete newQuery.operateType
      delete newQuery.id
      // 如果有引入 lodash, 可以写成: let newQuery = _.omit(this.$route.query, 'code')
      this.$router.replace({ query: newQuery })
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
