<template>
  <div class="add-person">
    <el-dialog
      :title="contactDialog.title"
      :visible="contactDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="700px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item
              label="联系人姓名"
              prop="contactName"
              :rules="[{ required: true, message: '请输入联系人姓名', trigger: 'blur' }]"
            >
              <el-input
                v-model="inputForm.contactName"
                placeholder="请输入联系人姓名"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="inputForm.phone" placeholder="请输入正确手机号" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="微信号" prop="wechat">
              <el-input v-model="inputForm.wechat" placeholder="请输入微信号" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="inputForm.email" placeholder="请输入邮箱" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="常住地址" prop="address">
              <el-input v-model="inputForm.address" placeholder="请填写地址" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="身份证号">
              <el-input
                v-model="inputForm.idNum"
                placeholder="请输入正确的身份证号"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="身份证照片">
              <div class="id-num-wrapper">
                <div class="id-front">
                  <el-upload
                    ref="imgUpload1"
                    class="avatar-uploader"
                    :show-file-list="false"
                    action="#"
                    :before-upload="beforeUpload"
                    :http-request="
                      file => {
                        return uploadRequest(file, 'front')
                      }
                    "
                    :limit="1"
                    :disabled="detailDisable"
                  >
                    <img v-if="inputForm.idFront" :src="url + inputForm.idFront" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
                  </el-upload>
                  <div class="bg-image">（个人信息面）</div>
                </div>
                <div class="id-back">
                  <el-upload
                    ref="imgUpload2"
                    class="avatar-uploader"
                    :show-file-list="false"
                    action="#"
                    :before-upload="beforeUpload"
                    :http-request="uploadRequest"
                    :limit="1"
                    :disabled="detailDisable"
                  >
                    <img v-if="inputForm.idBack" :src="url + inputForm.idBack" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
                  </el-upload>
                  <div class="bg-image">（国徽 有效期限面）</div>
                </div>
              </div>
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
import { addObj, putObj } from '@/api/investor-contact'
export default {
  name: 'AddPerson',
  props: {
    contactDialog: {
      type: Object,
      default: () => null
    }
  },
  data() {
    var checkIdNumValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号码'))
      } else {
        // 校验身份证号码的准确性
        if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
          callback(new Error('输入身份证号码不合法'))
        }
      }
      callback()
    }
    var checkIdPictureValid = (rule, value, callback) => {
      if (value.length !== 2) {
        callback(new Error('请上传身份证正反面照片'))
      }
      callback()
    }
    return {
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      inputForm: {
        investorId: '',
        id: '', //
        contactName: '', // 联系人姓名
        phone: '', // 手机号
        wechat: '', // 微信号
        email: '', // 邮箱
        address: '', // 常住地址
        idNum: '', // 身份证号
        idPicture: [], // 身份证正反面集合
        idFront: '', // 身份证照片正面
        idBack: '' // 身份证照片反面
      },
      baseForm: {
        investorId: '',
        id: '', //
        contactName: '', // 联系人姓名
        phone: '', // 手机号
        wechat: '', // 微信号
        email: '', // 邮箱
        address: '', // 常住地址
        idNum: '', // 身份证号
        idPicture: [], // 身份证正反面集合
        idFront: '', // 身份证照片正面
        idBack: '' // 身份证照片反面
      },
      inputFormRules: {
        phone: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        idNum: [
          { required: true, validator: checkIdNumValid, trigger: 'blur' }
        ],
        idPicture: [
          { required: true, validator: checkIdPictureValid, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    detailDisable() {
      return this.contactDialog.operateType === 'look'
    }
  },
  watch: {
    'contactDialog.vo': {
      handler(l) {
        if (this.contactDialog.operateType !== 'add') {
          this.inputForm = JSON.parse(JSON.stringify(l))
          this.inputForm.idPicture = []
          if (this.inputForm.idFront) {
            this.inputForm.idPicture.push(this.inputForm.idFront)
          }
          if (this.inputForm.idBack) {
            this.inputForm.idPicture.push(this.inputForm.idBack)
          }
        } else {
          // 清除表单数据
          this.inputForm = Object.assign({}, this.baseForm)
          this.inputForm.investorId = l.investorId
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
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
    // 保存联系人信息
    saveBtn() {
      if (!this.inputForm.investorId) {
        this.$message.error('请先创建业主信息')
        return
      }
      const _that = this
      _that.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.contactDialog.operateType === 'add') {
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
    uploadRequest(file, type) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('bucket', 'idphoto') // 上传身份证照片
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          if (type === 'front') {
            this.inputForm.idFront = res.data.data.url
            // 上传成功之后清除历史记录
            this.$refs.imgUpload1.clearFiles()
          } else {
            this.inputForm.idBack = res.data.data.url
            // 上传成功之后清除历史记录
            this.$refs.imgUpload2.clearFiles()
          }
          // 存储身份证正反面的照片链接用于校验
          this.inputForm.idPicture = []
          if (this.inputForm.idFront) {
            this.inputForm.idPicture.push(this.inputForm.idFront)
          }
          if (this.inputForm.idBack) {
            this.inputForm.idPicture.push(this.inputForm.idBack)
          }
          if (this.inputForm.idFront && this.inputForm.idBack) {
            this.$refs['inputFormRef'].clearValidate(['idPicture'])
          }
        } else {
          this.$message.error(res.data.msgg)
        }
      })
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
