<template>
  <div class="bring-fee-item">
    <el-dialog
      :visible="printDialogVo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="1000px"
    >
      <div id="printFeePayDetail">
        <div class="print-fee-pay-title">【{{ feePayObj.marketName }}】- &nbsp;{{ printDialogVo.title }}</div>
        <div class="nomarl-table-title-descriptions div-desc">
          <span>单据编号:{{ feePayObj.feepayCode }}</span>
          <span>单据日期:{{ feePayObj.fillpayTime }}</span>
          <span>商户名称:{{ feePayObj.merchantName }}</span>
        </div>
        <table class="nomarl-table">
          <thead>
            <tr class="nomarl-table-title">
              <th style="width: 40px">序号</th>
              <th style="width: 200px">科目名称</th>
              <th>计费开始日期</th>
              <th>计费结束日期</th>
              <th>计费方式</th>
              <th>数量</th>
              <th>单价</th>
              <th>收费金额</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in feePayObj.feepayDetailsPrintResponseList">
              <tr :key="index" class="fee-pay-content">
                <td style="width: 40px">{{ index + 1 }}</td>
                <td style="width: 200px">{{ item.feeItemName }}</td>
                <td>{{ item.startDate }}</td>
                <td>{{ item.endDate }}</td>
                <td>{{ item.payTypeName }}</td>
                <td>{{ item.count }}</td>
                <td>{{ item.unitPrice }}</td>
                <td>{{ item.chargeAmount }}</td>
              </tr>
            </template>
          </tbody>
        </table>
        <div style="text-align: right; color: red" class="div-desc">
          <span>应收总额:{{ feePayObj.chargeTotalAmount }}</span>
        </div>
        <div style="text-align: left" class="div-desc">
          <span>说明:{{ feePayObj.remark }}</span>
        </div>
        <div class="nomarl-table-title-descriptions div-desc">
          <span>操作员:{{ feePayObj.operation }}</span>
          <span>打印时间:{{ feePayObj.printDate }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button v-print="printObj" type="primary">打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { putfeePayPrintObj } from '@/api/feePay'
export default {
  name: 'PrintFeePayDetail',
  props: {
    printDialogVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      printObj: {
        id: 'printFeePayDetail', // 这里是要打印元素的ID
        popTitle: '', // 页眉标题
        extraCss: 'www.sdhmbim.com',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>,<style>  #printFeePayDetail { width: 100%; !important; } <style>',
        endCallBack: (e) => {
          console.log(e, 555)
        }
      },
      feePayObj: {
        feepayDetailsPrintResponseList: [],
        merchantName: '', // 商户名称
        marketName: '', // 市场名称
        feepayCode: '', // 收费单编号
        remark: '', // 描述 收费单备注信息
        operation: '', // 操作员
        printDate: '', // 打印时间
        fillpayTime: '', // 单据日期
        chargeTotalAmount: '' // 应收总额
      }
    }
  },
  computed: {
  },
  watch: {
    'printDialogVo': {
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
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
    handlerSearch() {
      putfeePayPrintObj({
        id: this.printDialogVo.id
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.feePayObj = res.data.data
          this.printObj.popTitle = this.feePayObj.marketName + '-' + this.printDialogVo.title
        } else {
          this.$message.error('查询失败，请联系系统管理员')
        }
      })
    },
    cancelDialog() {
      this.$emit('setPringDialogVisiable', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
::v-deep .znp-crud-dialog .el-dialog__body {
  padding-top: 0px !important;
}
.nomarl-table {
  margin-left: 0;
  table-layout: fixed;
  width: 100%;
  line-height: 14px;
  font-size: 14px;
  text-align: left;
  border: 1px solid black;
}
.nomarl-table-title th {
  border: 1px solid black;
  font-size: 12px;
}
.fee-pay-content td {
  border: 1px solid black;
  font-size: 12px;
}
.nomarl-table-title {
  text-align: left;
  font-size: 12px;
  line-height: 20px;
}
.nomarl-table-title-descriptions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.print-fee-pay-title {
  text-align: center;
  margin: 10px auto 20px;
  font-size: 13px;
}
.div-desc {
  font-size: 12px;
  margin-bottom: 5px;
}
</style>

<style media="printFeePayDetail">
/*去除页眉页脚*/
@page {
  margin: 3mm 10mm;
}
</style>
