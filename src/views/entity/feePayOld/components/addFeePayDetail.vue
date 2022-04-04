<template>
  <div class="fee-pay-detail">
    <el-dialog
      :title="dialogVo.title"
      :visible="dialogVo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="600px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="inputForm.startDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="inputForm.endDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择结束日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="科目名称" prop="feeItemId">
              <el-select
                v-model="inputForm.feeItemId"
                placeholder="请选择科目"
                style="width: 100%"
                :disabled="detailDisable"
                @change="feeItemChange"
              >
                <el-option
                  v-for="item in selectOptions.feeItemList"
                  :key="item.id"
                  :label="item.itemName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计费方式" prop="payType">
              <el-select
                v-model="inputForm.payType"
                placeholder="请选择计费方式"
                style="width: 100%"
                :disabled="detailDisable"
              >
                <el-option
                  v-for="item in selectOptions.chargeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="数量" prop="count">
              <el-input-number
                v-model="inputForm.count"
                :disabled="detailDisable"
                placeholder="请输入"
                style="width: 100%"
                :min="0.00"
                :controls="false"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收费金额/单价" prop="unitPrice">
              <el-input v-model="inputForm.unitPrice" placeholder="单位（元）" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="detailDisable" label="实收金额" prop="realPrice">
              <el-input v-model="inputForm.realPrice" placeholder="单位（元）" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">{{ detailDisable ? '关 闭' : '取 消' }}</el-button>
        <el-button v-if="!detailDisable" type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { addObj, putObj } from '@/api/feepaydetails'
import { remote } from '@/api/admin/dict'
import { getSelectFeeitemList } from '@/api/feeItems'
export default {
  name: 'AddFeePayDetail',
  props: {
    dialogVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    const _that = this
    var checkunitPriceValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入参考单价'))
      } else {
        if (value && !(/(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value))) {
          callback(new Error('请输入大于等于0的数字，最多两位小数'))
        }
      }
      callback()
    }
    // 校验结束日期要大于等于开始日期
    var checkEndDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择结束日期'))
      } else {
        if (!_that.inputForm.startDate) {
          value = ''
          callback(new Error('请选择开始日期'))
        } else if (Date.parse(_that.inputForm.startDate) > Date.parse(value)) {
          callback(new Error('结束日期必须大于开始日期'))
        }
      }
      callback()
    }
    return {
      selectOptions: {
        feeItemList: [], // 科目
        chargeType: [] // 计费方式
      },
      inputForm: {
        feepayId: '', // 收费单id
        startDate: '',
        endDate: '',
        feeItemId: '', // 科目
        feeItemName: '', // 科目名称
        payType: '', // 计费方式
        unitPrice: '', // 收费金额/单价
        count: '', // 数量
        realPrice: ''
      },
      baseForm: {
        feepayId: '', // 收费单id
        startDate: '',
        endDate: '',
        feeItemId: '', // 科目
        feeItemName: '', // 科目名称
        payType: '', // 计费方式
        unitPrice: '', // 收费金额/单价
        count: '', // 数量
        realPrice: ''
      },
      inputFormRules: {
        startDate: [
          { required: true, message: '请输入开始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, validator: checkEndDate, trigger: 'blur' }
        ],
        feeItemId: [
          { required: true, message: '请选择科目', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '请输入具体使用数量', trigger: 'blur' }
        ],
        payType: [
          { required: true, message: '请选择计费方式', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, validator: checkunitPriceValid, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    detailDisable() {
      return this.dialogVo.operateType === 'look'
    },
    editDisable() {
      return this.dialogVo.operateType === 'edit'
    },
    addDisable() {
      return this.dialogVo.operateType === 'add'
    }
  },
  watch: {
    'dialogVo.vo': {
      handler: function(l) {
        if (this.dialogVo.operateType !== 'add') {
          this.inputForm = JSON.parse(JSON.stringify(l))
          this.inputForm.payType = this.inputForm.payType + ''
        } else {
          // 清除表单数据
          this.inputForm = Object.assign({}, this.baseForm)
          this.inputForm.feepayId = l.feePayId
        }
        if (this.$refs['inputFormRef']) {
          this.$refs['inputFormRef'].clearValidate()
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
      // 科目
      getSelectFeeitemList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeItemList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 计费方式
      remote('charge_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.chargeType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 收费科目选择的时候给名称赋值
    feeItemChange(val) {
      const obj = this.selectOptions.feeItemList.find((item) => {
        return item.id === val
      })
      this.inputForm.feeItemName = obj.itemName
    },
    saveBtn() {
      const _that = this
      _that.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.dialogVo.operateType === 'add') {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.cancelDialog()
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.cancelDialog()
              } else {
                this.$message.error('修改失败,' + res.data.msg)
              }
            })
          }
        } else {
          return false
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
.fee-pay-detail {
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>
