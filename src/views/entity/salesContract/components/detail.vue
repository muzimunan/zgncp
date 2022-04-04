<template>
  <div class="sales-contract-info">
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
            <p class="form-title">{{ addDisable ? '新增合同' : editDisable ? '修改合同' : '查看合同' }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="合同编码" prop="contractCode" class="znp-remove-start" v-if="!addDisable">
              <el-input
                v-model="inputForm.contractCode"
                placeholder="自动生成，可自定义……"
                maxlength="17"
                show-word-limit
                clearable
                :disabled="detailDisable || editDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="合同名称" prop="contractName">
              <el-input
                v-model="inputForm.contractName"
                placeholder="字数不能超过20个汉字"
                maxlength="20"
                show-word-limit
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="合同状态" prop="contractStatus">
              <el-select
                v-model="inputForm.contractStatus"
                clearable
                placeholder="请选择合同状态"
                :disabled="detailDisable || addDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.contractStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="物业档案" prop="estateId">
              <el-select
                v-show="!detailDisable"
                v-model="inputForm.estateId"
                filterable
                remote
                placeholder="请选择,可按编码/名称检索"
                :remote-method="remoteEstateMethod"
                style="width: 100%"
                @change="estateChange"
              >
                <el-option
                  v-for="item in selectOptions.estateList"
                  :key="item.id"
                  :label="item.estateName"
                  :value="item.id"
                />
              </el-select>
              <el-link v-show="detailDisable" :underline="false" type="primary" @click="goto('estate')">
                &nbsp;{{ inputForm.estateCodename }}
              </el-link>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="业主档案" prop="investorId">
              <el-select
                v-show="!detailDisable"
                v-model="inputForm.investorId"
                filterable
                remote
                placeholder="请选择,可按编码/名称检索"
                :remote-method="remoteInvestorMethod"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.investorList"
                  :key="item.id"
                  :label="item.investorName"
                  :value="item.id"
                />
              </el-select>
              <el-link v-show="detailDisable" :underline="false" type="primary" @click="goto('investor')">
                &nbsp;{{ inputForm.investorName }}
              </el-link>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="签订日期" prop="signDate">
              <el-date-picker
                v-model="inputForm.signDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择签订日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="生效日期" prop="startDate">
              <el-date-picker
                v-model="inputForm.startDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择生效日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12">
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
          </el-col> -->
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="合同金额" prop="contractPrice">
              <el-input v-model="inputForm.contractPrice" placeholder="单位（元）" clearable :disabled="detailDisable">
                <template slot="suffix">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="付款方式" prop="payType">
              <el-select
                v-model="inputForm.payType"
                clearable
                placeholder="请选择付款方式"
                :disabled="detailDisable"
                style="width: 100%"
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
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="原合同编号" prop="contractNum">
              <el-input
                v-model="inputForm.contractNum"
                placeholder="请输入原合同编号"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="合同附件" prop="pictureArr">
              <el-upload
                ref="imgUpload"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadRequest"
                :disabled="detailDisable"
                :multiple="true"
              >
                <el-button size="small" :disabled="detailDisable" type="primary">
                  上传文件
                  <i class="el-icon-upload el-icon--right" />
                </el-button>
                <div slot="tip" class="el-upload__tip">支持多个附件，每个附件不超过10M</div>
              </el-upload>
              <div v-if="inputForm.pictureArr.length > 0">
                <el-tag
                  v-for="(item, index) in inputForm.pictureArr"
                  :key="index"
                  class="znp-multiple-files"
                  closable
                  @close="delPicture(item)"
                >
                  <svg class="znp-file-icon" aria-hidden="true">
                    <use :xlink:href="'#' + judgeFileType(item.ext)" />
                  </svg>
                  <el-link @click="downLoadFile(item.path, 'download')">
                    <i class="el-icon-download" />
                    下载
                  </el-link>
                </el-tag>
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
import { addObj, getObj, putObj } from '@/api/sales-contract'
import { getRemoteEstateList } from '@/api/estate'
import { getRemoteInvestorList } from '@/api/investor'
import { importFile } from '@/api/upload'
import { remote } from '@/api/admin/dict'
import '@/assets/css/fileIcon/iconfont.js' // 自定义生成的文件icon
import { rule } from '@/util/validateRules'
export default {
  name: 'SalesContractDetail',
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.operateType === 'add' && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
      }
      callback()
    }
    // 校验合同附件必填
    // var checkPictureArrValid = (rule, value, callback) => {
    //   if (value.length <= 0) {
    //     callback(new Error('请上传合同附件'))
    //   }
    //   callback()
    // }
    // // 校验结束日期要大于等于开始日期
    // var checkEndDate = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请选择结束日期'))
    //   } else {
    //     if (value && !_that.inputForm.startDate) {
    //       value = ''
    //       callback(new Error('请选择开始日期'))
    //     } else if (Date.parse(_that.inputForm.startDate) > Date.parse(value)) {
    //       callback(new Error('结束日期必须大于开始日期'))
    //     }
    //   }
    //   callback()
    // }
    return {
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '选填',
      selectOptions: {
        contractStatus: [], // 合同状态
        payType: [], // 付款方式
        estateList: [], // 物业档案
        investorList: []// 业主档案
      },
      inputForm: {
        contractCode: '', // 合同编码
        contractName: '', // 合同名称
        contractStatus: '1', // 合同状态 //新增默认是生效
        estateId: '', // 物业档案
        investorId: '', // 业主档案
        signDate: _that.getNowDate(), // 签订日期
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        contractPrice: '', // 合同金额
        payType: '', // 付款方式
        pictureArr: [], // 多个附件
        attachLists: [], // 传给后端的参数 图片地址数组集合
        remark: '' // 备注
      },
      inputFormRules: {
        contractCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        contractName: [
          { required: true, message: '请输入合同名称', trigger: 'blur' }
        ],
        contractStatus: [
          { required: true, message: '请选择合同状态', trigger: 'blur' }
        ],
        estateId: [
          { required: true, message: '请选择物业档案', trigger: 'change' }
        ],
        investorId: [
          { required: true, message: '请选择业主档案', trigger: 'change' }
        ],
        signDate: [
          { required: true, message: '请选择签订日期', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择生效日期', trigger: 'blur' }
        ],
        // endDate: [
        //   { required: true, validator: checkEndDate, trigger: 'blur' }
        // ],
        contractPrice: [
          { required: true, message: '请输入合同金额', trigger: 'blur' },
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ],
        payType: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ]
        // pictureArr: [
        //   { required: true, validator: checkPictureArrValid, trigger: 'blur' }
        // ]
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
        if (this.$route.path === '/salesContract/detail') {
          this.$refs['inputFormRef'].clearValidate()
          // 获取下拉框数据
          this.getSelectList()
          // 修改产品进来的话
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
      if (from.query.operateType !== 'add' && to.path !== '/salesContract/detail') {
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
    }
  },
  methods: {
    getSelectList() {
      // 合同状态
      remote('contract_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.contractStatus = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 付款方式
      remote('pay_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.payType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      this.remoteEstateMethod()
      this.remoteInvestorMethod()
    },
    // 根据编码或名称检索物业档案
    remoteEstateMethod(query) {
      // 查询物业档案中的【所有权】为“自持”且【是否可售】为“是”
      getRemoteEstateList({
        estateCodeOrName: query,
        isSale: 1, // 是否可售 是:1 否:0
        owner: 0 // 所有权自持:0 已售:1 已售回租:2
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.estateList = res.data.data
        } else {
          this.$message.error('查询物业列表失败，请联系系统管理员')
          this.selectOptions.estateList = []
        }
      })
    },
    estateChange(val) {
      const obj = this.selectOptions.estateList.find((item) => {
        return item.id === val
      })
      this.inputForm.estateName = obj.estateName
    },
    // 根据编码或名称检索业主
    remoteInvestorMethod(query) {
      getRemoteInvestorList({ investorCodeOrName: query }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.investorList = res.data.data
        } else {
          this.$message.error('查询业主列表失败，请联系系统管理员')
          this.selectOptions.investorList = []
        }
      })
    },
    investorChange(val) {
      const obj = this.selectOptions.investorList.find((item) => {
        return item.id === val
      })
      this.inputForm.investorName = obj.investorName
    },
    // 查看
    queryVoById() {
      getObj(this.$route.query.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm = res.data.data
          // 所有的下拉框转换为字符串
          this.inputForm.contractStatus = this.inputForm.contractStatus + '' // 合同状态
          this.inputForm.payType = this.inputForm.payType + '' // 付款方式
          this.$set(this.inputForm, 'pictureArr', [])
          this.inputForm.pictureArr = this.inputForm.attachLists.map(item => {
            return {
              path: item.attachPath,
              ext: this.subStringUrl(item.attachPath)
            }
          })
          this.inputForm.attachLists = []
          this.inputForm.pictureArr.forEach(item => {
            this.inputForm.attachLists.push(item.path)
          })
          // 如果下拉框没有当前的物业档案，将当前的物业档案id和name塞到物业档案下拉框中
          const estateIndex = this.selectOptions.estateList.findIndex(o => o.id === this.inputForm.estateId)
          if (estateIndex === -1 && this.inputForm.estateId) {
            this.selectOptions.estateList.push({ id: this.inputForm.estateId, estateName: this.inputForm.estateCodename })
          }
        } else {
          this.$message.error('查询合同失败，请联系系统管理员')
        }
      })
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          // 整理图片路径数组集合
          this.inputForm.attachLists = []
          this.inputForm.pictureArr.forEach(item => {
            this.inputForm.attachLists.push(item.path)
          })
          if (this.addDisable) {
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
    // 返回
    goBack() {
      this.$router.push({ path: '/entity/salesContract/index' })
      // this.$router.go(-1)// 返回上一层
    },
    // 上传图片相关 begin
    uploadRequest(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.file)
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm.pictureArr.push({
            path: res.data.data.url,
            ext: this.subStringUrl(res.data.data.url)
          })
          if (this.inputForm.pictureArr.length > 0) {
            this.$refs['inputFormRef'].clearValidate(['pictureArr'])
          }
        } else {
          this.$message.error(res.data.msgg)
        }
      })
      // 上传成功之后清除历史记录
      this.$refs.imgUpload.clearFiles()
    },
    subStringUrl(path) {
      const pathArr = path.split('.')
      return pathArr[1]
    },
    // 文件上传之前校验
    beforeUpload(file) {
      const fileSize = file.size
      if (!file) {
        this.$message.error('请先选取上传的文件')
        return false
      }
      // if (file.name.search(/(.jpg)$/) < 1 && file.name.search(/(.png)$/) < 1) {
      //   this.$message.error('图片格式只支持jpg或png')
      //   return false
      // }
      if (fileSize / 1024 / 1024 > 10) {
        this.$notify.error('文件大小不超过10M')
        return false
      }
    },
    // 判断文件类型 显示不同的logo
    judgeFileType(ext) {
      if (ext === 'doc' || ext === 'docx') {
        return 'icon-word'
      } else if (ext === 'txt') {
        return 'icon-txt'
      } else if (ext === 'zip' || ext === 'rar') {
        return 'icon-zip'
      } else if (ext === 'mp3') {
        return 'icon-mp'
      } else if (ext === 'mp4' || ext === 'avi' || ext === 'rmvb' || ext === 'flv') {
        return 'icon-video'
      } else if (ext === 'pdf') {
        return 'icon-pdf'
      } else if (ext === 'ppt' || ext === 'pptx') {
        return 'icon-ppt'
      } else if (ext === 'xls' || ext === 'xlsx') {
        return 'icon-xlsx'
      } else if (ext === 'jpg' || ext === 'png' || ext === 'jpeg' || ext === 'gif') {
        return 'icon-tupian'
      } else {
        return 'icon-what'
      }
    },
    // 上传图片 end
    downLoadFile(url, type) {
      if (type === 'download') {
        // 下载
        window.location.href = url
      }
    },
    // 删除附件
    delPicture(item) {
      this.inputForm.pictureArr.splice(this.inputForm.pictureArr.findIndex(o => o.path === item.path), 1)
    },
    // 获取当前时间
    getNowDate() {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}`
      return defaultDate
    },
    // 跳转页面
    goto(type) {
      if (type === 'estate') {
        // 物业详情
        this.$router.push({
          path: '/eatate/detail',
          query: {
            operateType: 'look',
            id: this.inputForm.estateId
          }
        })
      } else {
        // 业主详情
        this.$router.push({
          path: '/investor/detail',
          query: {
            operateType: 'look',
            id: this.inputForm.investorId
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.sales-contract-info {
  ::v-deep .el-form-item__content {
    line-height: 30px !important;
  }
}
</style>
