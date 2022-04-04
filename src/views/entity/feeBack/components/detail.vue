<template>
  <div class="fee-back-info">
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
          <el-col v-if="detailDisable" :xs="24" :sm="12" :md="12" :lg="12" class="go-back">
            <el-link type="primary" :underline="false" @click="goBack">
              <i class="el-icon-d-arrow-left" />
              返 回
            </el-link>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <p class="form-title">{{ addDisable ? '新增退款单' : editDisable ? '修改退款单' : '查看退款单' }}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="退费类型" prop="backType">
              <el-radio-group
                v-model="inputForm.backType"
                @change="backTypeChange"
                :disabled="detailDisable || editDisable"
              >
                <el-radio :label="1">合约收费</el-radio>
                <el-radio :label="2">临时收费</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="收款单据编码" prop="feePayDetailCode">
              <el-autocomplete
                v-model="inputForm.feePayDetailCode"
                class="inline-input"
                style="width: 350px"
                :fetch-suggestions="queryFeePayByCode"
                placeholder="请输入收款单据编码"
                :trigger-on-focus="false"
                @select="handleSelectFeePay"
                :disabled="editDisable || detailDisable"
              >
                <!-- <el-button slot="append" type="primary" icon="el-icon-search">搜索</el-button> -->
                <template slot-scope="{ item }">
                  <span class="feepayCode">{{ item.feepayCode }}({{ item.feeItemName }})</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" v-if="inputForm.backType === 1">
            <el-form-item>
              <el-descriptions title="" size="medium">
                <el-descriptions-item label="收费项目">
                  {{ inputForm.obj.feeItemName }}
                </el-descriptions-item>
                <el-descriptions-item label="收费方式">
                  {{ inputForm.obj.payTypeName }}
                </el-descriptions-item>
                <el-descriptions-item label="收费周期">
                  {{ inputForm.obj.payCycleName }}
                </el-descriptions-item>
                <el-descriptions-item label="计费开始日期">
                  {{ inputForm.obj.startDate }}
                </el-descriptions-item>
                <el-descriptions-item label="计费结束日期">
                  {{ inputForm.obj.endDate }}
                </el-descriptions-item>
                <el-descriptions-item label="计费方式">
                  {{ inputForm.obj.chargeTypeName }}
                </el-descriptions-item>
                <el-descriptions-item label="数量">
                  {{ inputForm.obj.count }}
                </el-descriptions-item>
                <el-descriptions-item label="收款金额/单价">
                  {{ inputForm.obj.refPrice }}
                </el-descriptions-item>
                <el-descriptions-item label="应收金额">
                  {{ inputForm.obj.payPrice }}
                </el-descriptions-item>
                <el-descriptions-item label="实收金额">
                  {{ inputForm.obj.realPrice }}
                </el-descriptions-item>
                <el-descriptions-item label="建账时间">
                  {{ inputForm.obj.createTime }}
                </el-descriptions-item>
                <el-descriptions-item label="收费状态">
                  {{ inputForm.obj.feepayStatusName }}
                </el-descriptions-item>
              </el-descriptions>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" v-else>
            <el-form-item>
              <el-descriptions title="" size="medium">
                <el-descriptions-item label="运营科目">
                  {{ inputForm.obj.operationKindsName }}
                </el-descriptions-item>
                <el-descriptions-item label="收费项目">
                  {{ inputForm.obj.feeItemName }}
                </el-descriptions-item>
                <el-descriptions-item label="计费方式">
                  {{ inputForm.obj.chargeTypeName }}
                </el-descriptions-item>
                <el-descriptions-item label="数量">
                  {{ inputForm.obj.count }}
                </el-descriptions-item>
                <el-descriptions-item label="收款金额/单价">
                  {{ inputForm.obj.refPrice }}
                </el-descriptions-item>
                <el-descriptions-item label="单据日期">
                  {{ inputForm.obj.fillpayTime }}
                </el-descriptions-item>
                <el-descriptions-item label="收款人">
                  {{ inputForm.obj.payee }}
                </el-descriptions-item>
                <el-descriptions-item label="付款人">
                  {{ inputForm.obj.payer }}
                </el-descriptions-item>
                <el-descriptions-item label="付款人手机号">
                  {{ inputForm.obj.payerPhone }}
                </el-descriptions-item>
                <el-descriptions-item label="应收金额">
                  {{ inputForm.obj.payPrice }}
                </el-descriptions-item>
                <el-descriptions-item label="实收金额">
                  {{ inputForm.obj.realPrice }}
                </el-descriptions-item>
              </el-descriptions>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="实退金额" prop="realPrice">
              <el-input-number
                :min="0.0"
                :controls="false"
                :precision="2"
                v-model="inputForm.realPrice"
                :disabled="detailDisable"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="退费时间" prop="fillbackTime">
              <el-date-picker
                v-model="inputForm.fillbackTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择退费时间"
                :disabled="detailDisable"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="上传图片" prop="">
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
              <div v-if="inputForm.feebackPic" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.feebackPic" />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="退款原因" prop="remark">
              <el-input
                v-model="inputForm.remark"
                :disabled="detailDisable"
                type="textarea"
                placeholder="请输入退款原因"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>

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
import { addObj, getObj, putObj } from '@/api/feeBack'
import { queryFeepayDetail } from '@/api/feepaydetails'
import { queryFeepayTempDetail } from '@/api/feePayTemp'
import { importFile } from '@/api/upload'
import { dateFormat } from '@/filters/'
export default {
  name: 'FeeBackDetailPage',
  data() {
    return {
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '选填',
      selectOptions: {
        merchantList: [], // 商户档案列表
        feePayList: [] // 退款单号编码
      },
      inputForm: {
        backType: 1, // 合约
        feePayDetailCode: '', // 收款单编码
        feePayDetailId: 0,
        feebackPic: '',
        feebackPicId: 0,
        fillbackTime: dateFormat(new Date()),
        realPrice: 0, // 实退金额
        remark: '',
        obj: {}
      },
      inputFormRules: {
        feePayDetailCode: [
          { required: true, message: '请选择需要退款的收款单据', trigger: 'change' }
        ],
        realPrice: [
          { required: true, message: '请输入实退金额', trigger: 'blur' }
        ],
        fillbackTime: [
          { required: true, message: '请填写退费日期', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入退款原因', trigger: 'blur' }
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
    }
  },
  watch: {
    '$route.id': {
      handler() {
        if (this.$route.path === '/feeBack/detail') {
          this.$refs['inputFormRef'].clearValidate()
          const info = this.$route.query
          if (info.id) {
            // 加载商品详细信息
            this.queryVoById(info)
          }
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    },
    $route(to, from) {
      if (from.query.operateType !== 'add' && to.path !== '/feeBack/detail') {
        this.$refs['inputFormRef'].resetFields()
        this.inputForm.obj = {}
      }
    }
  },
  created() {
    const info = this.$route.query
    if (info.id) {
      // 加载商品详细信息
      this.queryVoById(info)
    }
  },
  methods: {
    backTypeChange(val) {
      this.inputForm.obj = {}
      this.inputForm.feePayDetailCode = ''
      this.inputForm.feePayDetailId = ''
    },
    queryFeePayByCode(queryStr, cb) {
      if (this.inputForm.backType === 1) {
        // 查询合约收费接口
        queryFeepayDetail({ feePayDetailCode: queryStr }).then(res => {
          if (res && parseInt(res.data.code) === 0) {
            cb(res.data.data)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        // 查询临时收费接口
        queryFeepayTempDetail(queryStr).then(res => {
          if (res && parseInt(res.data.code) === 0) {
            cb(res.data.data)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
    },
    handleSelectFeePay(item) {
      this.inputForm.feePayDetailCode = item.feepaydetailsCode
      this.inputForm.feePayDetailId = item.id
      this.inputForm.obj = item
    },
    // 查看
    queryVoById() {
      getObj(this.$route.query.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm = res.data.data
          if (this.inputForm.backType === 1) {
            this.inputForm.obj = res.data.data.feeObj
          } else {
            this.inputForm.obj = res.data.data.feeTempObj
          }
        } else {
          this.$message.error('查询失败，请联系系统管理员')
        }
      })
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          this.inputForm.obj = undefined
          if (this.addDisable) {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.goBack()
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.goBack()
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
    // 返回
    goBack() {
      // this.$router.go(-1)// 返回上一层
      this.$router.push({ path: '/entity/feeBack/index' })
    },
    // 上传图片相关 begin
    uploadRequest(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.file)
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm.feebackPic = res.data.data.url
          this.inputForm.feebackPicId = res.data.data.fileId
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
    }
    // 上传图片 end
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.fee-back-info {
  ::v-deep .el-form-item__content {
    line-height: 30px !important;
  }
  .print-item {
    text-align: right;
  }
}
</style>
