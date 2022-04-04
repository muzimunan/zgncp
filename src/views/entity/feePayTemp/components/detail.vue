<template>
  <div class="rent-contract-info">
    <div class="znp-form-wraper">
      <el-form
        ref="inputFormRef"
        label-position="right"
        label-width="150px"
        :rules="inputFormRules"
        :model="inputForm"
        class="dialog-add-course"
        size="small"
      >
        <el-row>
          <el-col v-if="detailDisable" :xs="24" :sm="24" :md="24" :lg="24" class="go-back">
            <el-link type="primary" :underline="false" @click="goBack">
              <i class="el-icon-d-arrow-left" />
              返 回
            </el-link>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <p class="form-title">{{ addDisable ? '新增临时收费' : editDisable ? '修改临时收费' : '查看临时收费' }}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="运营科目" prop="operationKindsId">
              <el-select
                v-model="inputForm.operationKindsId"
                placeholder="请选择运营科目"
                style="width: 100%"
                clearable
                :disabled="detailDisable"
                @change="operationKindsChange"
              >
                <el-option
                  v-for="item in selectOptions.feekindsoperationList"
                  :key="item.id"
                  :label="item.operationKindsName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="收费项目" prop="feeItemId">
              <el-select
                v-model="inputForm.feeItemId"
                placeholder="请选择收费项目"
                style="width: 100%"
                clearable
                :disabled="detailDisable"
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
          <!--  <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="收费日期" prop="feeDate">
              <el-date-picker
                v-model="inputForm.feeDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="收费日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="计费方式" prop="chargeType">
              <el-select
                v-model="inputForm.chargeType"
                placeholder="计费方式"
                style="width: 100%"
                clearable
                :disabled="detailDisable"
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
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="数量" prop="count">
              <el-input-number
                :min="0.0"
                :controls="false"
                :precision="2"
                v-model="inputForm.count"
                :disabled="inputForm.chargeType === '0' || detailDisable"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="收款金额/单价" prop="refPrice">
              <el-input-number
                :min="0.0"
                :controls="false"
                :precision="2"
                v-model="inputForm.refPrice"
                :disabled="detailDisable"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="付款方式" prop="paymentMethod">
              <el-select
                v-model="inputForm.paymentMethod"
                placeholder="请选择付款方式"
                style="width: 100%"
                clearable
                :disabled="detailDisable"
                @change="paymentMethodChange"
              >
                <el-option
                  v-for="item in selectOptions.paymentMethod"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="实收金额" prop="realPrice">
              <el-input-number
                :min="0.0"
                :controls="false"
                :precision="2"
                v-model="inputForm.realPrice"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="收款人">
              <el-input v-model="inputForm.payee" placeholder="请输入收款人" :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="付款人">
              <el-input v-model="inputForm.payer" placeholder="请输入付款人" :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="付款人联系方式">
              <el-input v-model="inputForm.payerPhone" placeholder="请输入付款人联系方式" :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="上传图片" prop="f15">
              <el-upload
                ref="imgUpload"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadRequest"
                :limit="1"
                :disabled="detailDisable"
              >
                <el-button size="small" :disabled="detailDisable" type="primary">
                  上传图片
                  <i class="el-icon-upload el-icon--right" />
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
              </el-upload>
              <div v-if="inputForm.payPicUrl" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.payPicUrl" />
                </div>
              </div>
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
        <div v-if="detailDisable">
          <el-divider />
          <el-row>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建人">
                <el-input v-model="inputForm.createBy" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建时间">
                <el-input v-model="inputForm.createTime" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改人">
                <el-input v-model="inputForm.updateBy" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改时间">
                <el-input v-model="inputForm.updateTime" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col v-if="!detailDisable" style="text-align: right">
            <el-button type="primary" plain @click="goBack">返 回</el-button>
            <el-button type="primary" @click="saveBtn">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addObj, getObj, putObj } from '@/api/feePayTemp'
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex'
import { getFeeItemListByKindsId } from '@/api/feeItems'
import { getRemoteFeekindsoperationList } from '@/api/feekindsoperation'
import { importFile } from '@/api/upload'
export default {
  name: 'FeePayTempDetail',
  data() {
    return {
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '',
      selectOptions: {
        paymentMethod: [], // 付款方式
        feekindsoperationList: [], // 运营科目
        chargeType: [], // 计费方式
        feeItemList: [] // 收费项目
      },
      inputForm: {
        operationKindsId: '', // 运营科目
        operationKindsName: '', // 运营科目名称
        paymentMethod: '', // 付款方式
        paymentMethodName: '', // 付款方式名称
        feeItemId: '', // 收费项目
        //   feeitemName: '', // 收费项目名称
        feeDate: '', // 收费日期
        chargeType: '', // 计费方式
        count: 1, // 数量
        refPrice: '', // 收款金额（参考单价）
        fillpayTime: '', // 收费日期
        realPrice: '', // 实收金额
        payee: '', // 收款人
        payer: '', // 付款人
        payPicUrl: ''
      },
      inputFormRules: {
        operationKindsId: [
          { required: true, message: '请选择运营科目', trigger: 'change' }
        ],
        paymentMethod: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ],
        feeItemId: [
          { required: true, message: '请选择收费项目', trigger: 'change' }
        ],
        chargeType: [
          { required: true, message: '请选择计费方式', trigger: 'change' }
        ],
        count: [
          { required: true, message: '请填写数量', trigger: 'blur' }
        ],
        merchantId: [
          { required: true, message: '请选择商户档案', trigger: 'change' }
        ],
        feeDate: [
          { required: true, message: '请选择收费日期', trigger: 'blur' }
        ],
        fillpayTime: [
          { required: true, message: '请选择单据日期', trigger: 'blur' }
        ],
        refPrice: [
          { required: true, message: '请输入收款金额（参考单价）', trigger: 'blur' }
        ],
        realPrice: [
          { required: true, message: '请输入实收金额', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    detailDisable() {
      return this.$route.query.operateType === 'look'
    },
    editDisable() {
      return this.$route.query.operateType === 'edit'
    },
    addDisable() {
      return this.$route.query.operateType === 'add'
    },
    ...mapGetters(['userInfo']),
    computeRealData() {
      let realData = 0.00
      if (this.inputForm.paymentMethod === '0') {
        // 固定金额
        realData = this.inputForm.refPrice
      } else {
        // 单价数量
        realData = Number(Number(this.inputForm.refPrice) * Number(this.inputForm.count)).toFixed(2)
      }

      return realData
    }
  },
  watch: {
    computeRealData: {
      deep: true,
      handler(newVal) {
        this.inputForm.realPrice = newVal
      }
    },
    '$route.id': {
      handler() {
        if (this.$route.path === '/feePayTemp/detail') {
          this.$refs['inputFormRef'].clearValidate()
          // 获取下拉框数据
          this.getSelectList()
          // 修改产品进来的话
          const info = this.$route.query
          if (info.id) {
            // 加载商品详细信息
            this.queryVoById(info)
          } else {
            this.inputForm.payee = this.userInfo.trueName
          }
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    },
    $route(to, from) {
      if (from.query.operateType !== 'add' && to.path !== '/feePayTemp/detail') {
        this.$refs['inputFormRef'].resetFields()
      }
    }
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 修改产品进来的话
    const info = this.$route.query
    if (info.id) {
      // 加载商品详细信息
      this.queryVoById(info)
    } else {
      this.inputForm.payee = this.userInfo.trueName
    }
  },
  methods: {
    getSelectList() {
      // 运营科目
      getRemoteFeekindsoperationList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feekindsoperationList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 收费项目(1:运营科目 2:财务科目)
      /* getListByKindsType('1').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeItemList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      }) */
      // 计费方式
      remote('charge_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.chargeType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 付款方式
      remote('payment_method').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.paymentMethod = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    paymentMethodChange(val) {
      const obj = this.selectOptions.paymentMethod.find((item) => {
        return item.value === val
      })
      this.inputForm.paymentMethodName = obj.label
    },
    // 计费方式变更交互
    chargeTypechange(val) {
      this.inputForm.count = 1
    },
    operationKindsChange(val) {
      // 根据所选运营科目查询收费项目下拉列表
      getFeeItemListByKindsId(val).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeItemList = res.data.data
          if (res.data.data.length <= 0) {
            this.inputForm.feeItemId = ''
            this.inputForm.feeItemName = ''
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 查看
    queryVoById() {
      getObj(this.$route.query.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm = res.data.data
          this.inputForm.paymentMethod = this.inputForm.paymentMethod + ''
          this.inputForm.chargeType = this.inputForm.chargeType + ''
          this.operationKindsChange(this.inputForm.operationKindsId)
        } else {
          this.$message.error('查询临时收费失败，请联系系统管理员')
        }
      })
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.addDisable) {
            // 把rentformId塞到表单中
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
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
    // 上传图片相关 begin
    uploadRequest(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.file)
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm.payPicUrl = res.data.data.url
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
      if (fileSize / 1024 / 1024 > 10) {
        this.$notify.error('图片大小不超过10M')
        return false
      }
    },
    // 上传图片 end
    // 返回
    goBack() {
      // this.$router.go(-1)// 返回上一层
      this.$router.push({ path: '/entity/feePayTemp/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.rent-contract-info {
  ::v-deep .el-form-item__content {
    line-height: 30px !important;
  }
}
</style>
