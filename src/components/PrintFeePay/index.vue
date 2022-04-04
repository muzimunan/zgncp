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
      <div>
        <el-form ref="form" label-width="100px">
          <el-form-item label="是否显示边框">
            <el-radio-group v-model="isExistBordr" @change="isExistBordrChange">
              <el-radio :label="1">有边框</el-radio>
              <el-radio :label="0">无边框</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div id="printFeePayDetail">
        <div class="print-fee-pay-title">{{ printDialogVo.title }}</div>
        <table class="nomarl-table">
          <tr class="fee-pay-content">
            <td class="value-desc-title tdBorder">公司全称:</td>
            <td colspan="3" class="value-des tdBorder">{{ userInfo.companyName }}</td>
          </tr>
          <tr class="fee-pay-content">
            <td class="value-desc-title value-desc-title-first-row tdBorder">单据编码:</td>
            <td class="value-des tdBorder">{{ feeObj.feePayDetailCode }}</td>
            <td class="value-desc-title tdBorder">缴费时间:</td>
            <td class="value-des tdBorder">{{ feeObj.payTime }}</td>
          </tr>
          <tr class="fee-pay-content">
            <td class="value-desc-title tdBorder">交款单位/个人:</td>
            <td class="value-des tdBorder">{{ feeObj.username }}</td>
            <td v-if="feeObj.estateName" class="value-desc-title tdBorder">物业名称:</td>
            <td v-if="feeObj.estateName" class="value-des tdBorder">{{ feeObj.estateName }}</td>
          </tr>
          <tr class="fee-pay-content">
            <td class="value-desc-title tdBorder">收款金额:</td>
            <td class="value-des tdBorder">{{ feeObj.chargeAmount }}</td>
            <td class="value-desc-title tdBorder">收费项目:</td>
            <td class="value-des tdBorder">{{ feeObj.feeItemName }}</td>
          </tr>
          <tr class="fee-pay-content">
            <td class="value-desc-title tdBorder">大写:</td>
            <td colspan="3" class="value-des tdBorder">{{ feeObj.chargeAmountUpper }}</td>
          </tr>
          <tr class="fee-pay-content">
            <td class="value-desc-title tdBorder">收款方式:</td>
            <td colspan="3" class="value-des tdBorder">{{ feeObj.paymentMethodName }}</td>
          </tr>
          <tr class="fee-pay-content">
            <td class="value-desc-title tdBorder">备注:</td>
            <td colspan="3" class="value-des tdBorder">{{ feeObj.remark }}</td>
          </tr>
        </table>
        <div class="nomarl-table-title-descriptions div-desc">
          <span style="width: 50%">记账人</span>
          <span style="width: 25%">出纳人</span>
          <span style="width: 25%">经办人</span>
        </div>
        <div class="print-date-desc">打印日期：{{ feeObj.printDate }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button v-print="printObj" type="primary">打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import * as d3 from 'd3'
import { mapGetters } from 'vuex'
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
      isExistBordr: 1, // 默认是有边框
      item: {},
      printObj: {
        id: 'printFeePayDetail', // 这里是要打印元素的ID
        popTitle: '', // 页眉标题
        extraCss: 'www.sdhmbim.com',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>,<style>  #printFeePayDetail { width: 100% !important; } html {background-color: #ffffff; height: auto;margin: 0px;}body {border: solid 1px #ffffff;margin: 0mm 35mm 0mm 0mm !important;} <style>'
      },
      feeObj: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    'printDialogVo': {
      handler(l) {
        if (l.visible) {
          this.feeObj = l.obj
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
    isExistBordrChange(val) {
      if (parseInt(val) === 1) {
        // 有边框
        d3.selectAll('.nomarl-table .fee-pay-content td').classed('tdBorder', true)
      } else {
        // 无边框
        d3.selectAll('.nomarl-table .fee-pay-content td').classed('tdBorder', false)
      }
    },
    cancelDialog() {
      this.$emit('cancelDialog', false)
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
}
.nomarl-table-title th {
  font-size: 12px;
}
.fee-pay-content td {
  font-size: 13px;
  height: 28px;
  line-height: 18px;
  text-align: left;
}
.fee-pay-content td.value-desc-title {
  width: 110px;
  padding-left: 9px;
}
.fee-pay-content td.value-desc-title-first-row {
  height: 60px;
}
.tdBorder {
  border: 1px solid black;
}
.nomarl-table-title {
  text-align: left;
  font-size: 12px;
  line-height: 20px;
}
.nomarl-table-title-descriptions span {
  display: inline-block;
}
.print-fee-pay-title {
  text-align: center;
  margin: 10px auto 10px;
  font-size: 20px;
  letter-spacing: 55px;
  padding-left: 55px;
}
.div-desc {
  font-size: 15px;
  text-align: left;
  margin: 10px 0px 10px;
}
.print-date-desc {
  width: 100%;
  text-align: right;
  font-size: 13px;
}
</style>

<style media="printFeePayDetail">
/*去除页眉页脚*/
@page {
  size: auto; /*24.1cm 9.31cm;*/
  height: auto;
  margin: 0mm 35mm 0mm 3mm !important;
}
</style>
