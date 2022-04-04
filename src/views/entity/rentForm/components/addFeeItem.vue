<template>
  <div class="add-person">
    <el-dialog
      :title="dialogVo.title"
      :visible="dialogVo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="1000px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="收费项编码" prop="feeformCode" class="znp-remove-start">
              <el-input
                v-model="inputForm.feeformCode"
                placeholder="自动生成，可自定义……"
                maxlength="17"
                show-word-limit
                clearable
                :disabled="detailDisable || editDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="收费项名称" prop="feeformName">
              <el-input
                v-model="inputForm.feeformName"
                placeholder="字数不能超过20个汉字"
                maxlength="20"
                show-word-limit
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="状态" prop="feeformStatus">
              <el-select
                v-model="inputForm.feeformStatus"
                placeholder="请选择收费项状态"
                :disabled="detailDisable || addDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.feeFromStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="收费科目" prop="feeitemId">
              <el-select
                v-model="inputForm.feeitemId"
                filterable
                remote
                placeholder="请选择,可按编码/名称检索"
                :remote-method="remotefeeItemMethod"
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
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
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
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="inputForm.endDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择开租日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="收费周期" prop="feeformCycle">
              <el-select
                v-model="inputForm.feeformCycle"
                placeholder="请选择收费周期"
                style="width: 100%"
                :disabled="detailDisable"
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
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
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

          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="参考单价" prop="unitPrice">
              <el-input v-model="inputForm.unitPrice" placeholder="单位（元）" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="备注">
              <el-input
                v-model="inputForm.remark"
                type="textarea"
                :placeholder="remarkPlaceHolder"
                maxlength="300"
                show-word-limit
                :disabled="detailDisable"
              />
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
import { importFile } from '@/api/upload'

import { addObj, putObj } from '@/api/feeform'
import { remote } from '@/api/admin/dict'
import { fetchFeeItemList } from '@/api/feeItems'
export default {
  name: 'AddFeeItem',
  props: {
    dialogVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.addDisable && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
      }
      callback()
    }
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
      remarkPlaceHolder: '选填',
      selectOptions: {
        feeFormCycle: [], // 收费周期
        chargeType: [], // 计费方式
        feeFromStatus: [], // 收费项状态
        feeItemList: [] // 收费科目
      },
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      inputForm: {
        rentformId: '', // 出租登记单id
        rentformName: '', // 出租登记单名称
        feeformCode: '', // 收费项目编码
        feeformName: '', // 收费项目名称
        feeformStatus: '1', // 收费项目状态
        feeitemId: '', // 收费科目id
        feeitemName: '', // 收费科目名称
        startDate: '',
        endDate: '',
        feeformCycle: '', // 收费周期
        payType: '', // 计费方式
        unitPrice: '', // 参考单价
        payee: '', // 收款方
        payer: '', // 付款方
        merchantId: '', // 所属商户id
        merchantName: '', // 所属商户名称
        remark: '' // 备注
      },
      baseForm: {
        rentformId: '', // 出租登记单id
        rentformName: '', // 出租登记单名称
        feeformCode: '', // 收费项目编码
        feeformName: '', // 收费项目名称
        feeformStatus: '1', // 收费项目状态
        feeitemId: '', // 收费科目id
        feeitemName: '', // 收费科目名称
        startDate: '',
        endDate: '',
        feeformCycle: '', // 收费周期
        payType: '', // 计费方式
        unitPrice: '', // 参考单价
        payee: '', // 收款方
        payer: '', // 付款方
        merchantId: '', // 所属商户id
        merchantName: '', // 所属商户名称
        remark: '' // 备注
      },
      inputFormRules: {
        feeformCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        feeformName: [
          { required: true, message: '请输入收费项目名称', trigger: 'blur' }
        ],
        feeformStatus: [
          { required: true, message: '请输入收费项目状态', trigger: 'blur' }
        ],
        feeitemId: [
          { required: true, message: '请选择收费科目', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请输入开始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, validator: checkEndDate, trigger: 'blur' }
        ],
        feeformCycle: [
          { required: true, message: '请选择收费周期', trigger: 'blur' }
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
      handler(l) {
        this.remarkPlaceHolder = '选填'
        if (this.dialogVo.operateType !== 'add') {
          this.inputForm = JSON.parse(JSON.stringify(l))
          this.inputForm.feeformStatus = this.inputForm.feeformStatus + ''
          this.inputForm.feeformCycle = this.inputForm.feeformCycle + ''
          this.inputForm.payType = this.inputForm.payType + ''
        } else {
          // 清除表单数据
          this.inputForm = Object.assign({}, this.baseForm)
          this.inputForm.rentformId = l.rentformId
          this.inputForm.merchantId = l.merchantId
          this.inputForm.merchantName = l.merchantName
        }
        if (this.dialogVo.operateType === 'look') {
          this.remarkPlaceHolder = ''
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
      // 收费周期
      remote('fee_form_cycle').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeFormCycle = res.data.data
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
      // 收费项状态
      remote('fee_form_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeFromStatus = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      this.remotefeeItemMethod()
    },
    // 根据编码或名称检索收费科目
    remotefeeItemMethod(query) {
      fetchFeeItemList({
        nameOrCode: query
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeItemList = res.data.data
        } else {
          this.$message.error('查询收费科目失败，请联系系统管理员')
          this.selectOptions.feeItemList = []
        }
      })
    },
    feeItemChange(val) {
      const obj = this.selectOptions.feeItemList.find((item) => {
        return item.id === val
      })
      this.inputForm.feeitemName = obj.feekindsName
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
    },
    // 上传图片相关 begin
    uploadRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm.paperPicture = res.data.data.url
        } else {
          this.$message.error(res.data.msgg)
        }
      })
      // 上传成功之后清除历史记录
      this.$refs.imgUpload.clearFiles()
    },
    // 文件上传之前校验
    beforeUpload(file) {
      const fileSize = file.size
      if (!file) {
        this.$message.error('请先选取上传的文件')
        return false
      }
      if (file.name.search(/(.jpg)$/) < 1 && file.name.search(/(.png)$/) < 1) {
        this.$message.error('图片格式只支持jpg或png')
        return false
      }
      if (fileSize / 1024 / 1024 > 2) {
        this.$notify.error('图片大小不超过2M')
        return false
      }
    }
    // 上传图片 end
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.add-person {
  .id-num-wrapper {
    display: flex;
    .id-front,
    .id-back {
      flex-grow: 1;
      width: 50%;
      .bg-image {
        text-align: center;
      }
      .avatar-uploader {
        text-align: center;
      }
      ::v-deep .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9 !important;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 112px;
        line-height: 112px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 112px;
        display: block;
      }
    }
  }
}
</style>
