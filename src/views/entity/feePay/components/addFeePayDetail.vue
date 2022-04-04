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
            <el-form-item label="收费方式" prop="payType">
              <el-select
                v-model="inputForm.payType"
                placeholder="收费方式"
                style="width: 100%"
                :disabled="editDisable"
                @change="payTypechange"
              >
                <el-option
                  v-for="item in selectOptions.payType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收费周期" prop="payCycle" v-if="inputForm.payType !== '1'">
              <el-select
                v-model="inputForm.payCycle"
                placeholder="周期"
                style="width: 100%"
                :disabled="inputForm.payType === '1'"
              >
                <el-option
                  v-for="item in selectOptions.feeFormCycle"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="inputForm.startDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择开始日期"
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收费项目" prop="feeItemId">
              <el-select
                v-model="inputForm.feeItemId"
                placeholder="收费项目"
                style="width: 100%"
                :disabled="editDisable"
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
            <el-form-item label="计费方式" prop="chargeType">
              <el-select
                v-model="inputForm.chargeType"
                placeholder="计费方式"
                style="width: 100%"
                @change="chargeTypechange"
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
            <el-form-item label="数量">
              <el-input-number
                :min="0.0"
                :controls="false"
                :precision="2"
                v-model="inputForm.count"
                :disabled="inputForm.chargeType === '0' || inputForm.payType === '1'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收费金额/单价" prop="refPrice">
              <el-input-number :min="0.0" :controls="false" :precision="2" v-model="inputForm.refPrice" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { addObj, putObj } from '@/api/feepaydetails'
import { remote } from '@/api/admin/dict'
import { getListByKindsType } from '@/api/feeItems'
export default {
  name: 'AddFeePayDetail',
  props: {
    dialogVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      selectOptions: {
        payType: [], // 收费方式
        feeFormCycle: [], // 收费周期
        feeItemList: [], // 科目
        chargeType: [] // 计费方式
      },
      inputForm: {
        feepayId: '', // 收费单id
        startDate: '',
        endDate: '',
        feeItemId: '', // 科目
        feeItemName: '', // 收费项目
        payType: '', // 计费方式
        refPrice: '', // 收费金额/单价
        count: '', // 数量
        realPrice: '',
        payCycle: '',
        chargeType: '' // 计费方式
      },
      baseForm: {
        feepayId: '', // 收费单id
        startDate: '',
        endDate: '',
        feeItemId: '', // 科目
        feeItemName: '', // 收费项目
        payType: '', // 计费方式
        refPrice: '', // 收费金额/单价
        count: '', // 数量
        realPrice: '',
        payCycle: '',
        chargeType: '' // 计费方式'
      },
      inputFormRules: {
        count: [
          { required: true, message: '请输入具体使用数量', trigger: 'blur' }
        ],
        feeItemId: [
          { required: true, message: '请选择收费项目', trigger: 'change' }
        ],
        payType: [
          { required: true, message: '请选择收费方式', trigger: 'change' }
        ],
        chargeType: [
          { required: true, message: '请选择计费方式', trigger: 'change' }
        ],
        payCycle: [
          { required: true, message: '请选择收费周期', trigger: 'change' }
        ],
        refPrice: [
          { required: true, message: '请输入收费金额/单价', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请填写开始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请填写结束日期', trigger: 'blur' }
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
      handler(l) {
        if (this.dialogVo.operateType !== 'add') {
          this.inputForm = JSON.parse(JSON.stringify(l))
          this.inputForm.payType = this.inputForm.payType + ''
          this.inputForm.chargeType = this.inputForm.chargeType + ''
          this.inputForm.payCycle = this.inputForm.payCycle !== null ? this.inputForm.payCycle + '' : ''
        } else {
          // 清除表单数据
          this.inputForm = Object.assign({}, this.baseForm)
          this.inputForm.feepayId = l.feePayId
        }
        this.$nextTick(() => {
          this.$refs['inputFormRef'].clearValidate()
        })
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
      // 收费周期
      remote('fee_form_cycle').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeFormCycle = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 收费方式
      remote('pay_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.payType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 收费项目(1:运营科目 2:财务科目)
      getListByKindsType('1').then(res => {
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
    feeItemChange(val) {
      const obj = this.selectOptions.feeItemList.find((item) => {
        return item.id === val
      })
      this.inputForm.feeItemName = obj.itemName
    },
    // 收费科目选择的时候给名称赋值
    chargeTypechange(val) {
      this.inputForm.count = 1
    },
    // 收费方式变更交互
    payTypechange(val) {
      if (val === '1') {
        // 收费方式为一次性
        this.inputForm.payCycle = '' // 清空周期
        this.inputForm.count = 1 // 清空数量
        this.$nextTick(() => {
          this.$refs['inputFormRef'].clearValidate()
        })
      } else {
        this.inputForm.count = 1
      }
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
      this.$refs['inputFormRef'].clearValidate()
      this.$emit('cancelDialog')
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
