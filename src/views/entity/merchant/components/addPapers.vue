<template>
  <div class="add-person">
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
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item
              label="证件类型"
              prop="paperType"
              :rules="[{ required: true, message: '请选择资质或证件类型', trigger: 'blur' }]"
            >
              <el-select v-model="inputForm.paperType" placeholder="请选择资质或证件类型" clearable style="width: 100%">
                <el-option
                  v-for="item in selectOptions.paperType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="证件编号" prop="paperRealcode">
              <el-input
                v-model="inputForm.paperRealcode"
                placeholder="请输入证件编号"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="证件有效期(起)" prop="valdateS">
              <el-date-picker
                v-model="inputForm.valdateS"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请输入证件的有效期起始日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="证件有效期(止)" prop="valdateE">
              <el-date-picker
                v-model="inputForm.valdateE"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请输入证件的有效期截止日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="证件照片" prop="paperPicture">
              <el-upload
                ref="imgUpload"
                :show-file-list="false"
                action="#"
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
              <div v-if="inputForm.paperPicture" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.paperPicture" />
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
import { addObj, putObj } from '@/api/merchant-paper'
import { remote } from '@/api/admin/dict'
export default {
  name: 'AddPapers',
  props: {
    dialogVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      selectOptions: {
        paperType: []
      },
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      inputForm: {
        merchantId: '',
        id: '', //
        paperType: '', // 证件类型
        paperRealcode: '', // 证件编号
        valdateS: '', // 证件有效期起始日期
        valdateE: '', // 证件有效期终止日期
        paperPicture: ''
      },
      baseForm: {
        merchantId: '',
        id: '',
        paperType: '', // 证件类型
        paperRealcode: '', // 证件编号
        valdateS: '', // 证件有效期起始日期
        valdateE: '', // 证件有效期终止日期
        paperPicture: ''
      },
      inputFormRules: {
        paperRealcode: [
          { required: true, message: '请输入证件编号', trigger: 'blur' }
        ],
        paperPicture: [
          { required: true, message: '请上传资质的照片', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    detailDisable() {
      return this.dialogVo.operateType === 'look'
    }
  },
  watch: {
    'dialogVo.vo': {
      handler(l) {
        if (this.dialogVo.operateType !== 'add') {
          this.inputForm = JSON.parse(JSON.stringify(l))
          this.inputForm.paperType = this.inputForm.paperType + ''
        } else {
          // 清除表单数据
          this.inputForm = Object.assign({}, this.baseForm)
          this.inputForm.merchantId = l.merchantId
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
      // 证件类型
      remote('paper_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.paperType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    saveBtn() {
      if (!this.inputForm.merchantId) {
        this.$message.error('请先创建商户信息')
        return
      }
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
