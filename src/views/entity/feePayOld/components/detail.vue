<template>
  <div class="fee-pay-info">
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
          <el-col :xs="24" :sm="12" :md="12" :lg="12" v-if="detailDisable" class="go-back">
            <el-link type="primary" @click="goBack" :underline="false">
              <i class="el-icon-d-arrow-left"></i>
              返 回
            </el-link>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" v-if="detailDisable" class="print-item">
            <el-link type="primary" @click="printItem" :underline="false">
              <i class="el-icon-printer"></i>
              打印收费单
            </el-link>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <p class="form-title">{{ addDisable ? '新增收费单' : editDisable ? '修改收费单' : '查看收费单' }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="单据编码" prop="feepayCode" class="znp-remove-start" v-if="!addDisable">
              <el-input
                v-model="inputForm.feepayCode"
                placeholder="自动生成，可自定义……"
                maxlength="18"
                show-word-limit
                clearable
                :disabled="detailDisable || editDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="商户" prop="merchantId">
              <el-select
                v-show="!detailDisable"
                v-model="inputForm.merchantId"
                filterable
                remote
                placeholder="请选择,可按编码/名称检索"
                style="width: 100%"
                @change="merchantChange"
              >
                <el-option
                  v-for="item in selectOptions.merchantList"
                  :key="item.id"
                  :label="item.merchantName"
                  :value="item.id"
                />
              </el-select>
              <el-link v-show="detailDisable" :underline="false" type="primary" @click="goto('merchant')">
                &nbsp;{{ inputForm.merchantName }}
              </el-link>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="单据日期" prop="fillpayTime">
              <el-date-picker
                v-model="inputForm.fillpayTime"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择单据日期"
                :disabled="detailDisable"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                v-model="inputForm.remark"
                :placeholder="remarkPlaceHolder"
                maxlength="300"
                show-word-limit
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="detailDisable">
          <el-divider></el-divider>
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
          <el-col style="text-align: right" v-if="!detailDisable">
            <el-button type="primary" plain @click="goBack">返 回</el-button>
            <el-button @click="saveBtn" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="znp-tables-wrap">
      <div class="fee-item">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="收费单明细" name="feeitem">
            <FeePayDetail
              :table-data="feeItemTableData"
              :detail-disable="detailDisable"
              @queryVoById="queryVoById"
              :fee-pay-vo="inputForm"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 通过费用带入 -->
    <PrintFeePayDetail :print-dialog-vo="printDialogVo" @setPringDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script>
import { addObj, getObj, putObj } from '@/api/feePay'
import { getRemoteMerchantList } from '@/api/merchant'
import FeePayDetail from './feePayDetail'// 【收费单明细】
import PrintFeePayDetail from './printFeePayDetail'// 【收费单据】
export default {
  name: 'FeePayDetailPage',
  components: { FeePayDetail, PrintFeePayDetail },
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.addDisable && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
      }
      callback()
    }
    return {
      printDialogVo: {
        title: '收费单据',
        visible: false
      },
      remarkPlaceHolder: '选填',
      selectOptions: {
        merchantList: []// 商户档案列表
      },
      inputForm: {
        id: '',
        feepayCode: '', // 收费单编码
        merchantId: '', // 商户档案
        merchantName: '', // 商户档案名称
        fillpayTime: '', // 单据日期
        remark: '' // 备注
      },
      inputFormRules: {
        feepayCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        merchantId: [
          { required: true, message: '请选择商户档案', trigger: 'change' }
        ],
        fillpayTime: [
          { required: true, message: '请填写单据日期', trigger: 'blur' }
        ]
      },
      activeName: 'feeitem',
      feeItemTableData: [], // 收费项列表
      baseObj: {
        flag: 'add' // 添加那行的标记
      },
      isExistFeeForm: false // 是否维护了计费项
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
  watch: {},
  created() {
    // 获取商户的下拉框数据
    this.queryMerchant()
    // 修改产品进来的话
    const info = this.$route.query
    if (info.id) {
      // 加载商品详细信息
      this.queryVoById(info)
    } else {
      this.feeItemTableData = []
      this.feeItemTableData.push(this.baseObj)
    }
  },
  methods: {
    // 根据编码或名称检索商户
    queryMerchant(query) {
      getRemoteMerchantList({ merchantCodeOrName: query }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.merchantList = res.data.data
        } else {
          this.$message.error('查询商户列表失败，请联系系统管理员')
          this.selectOptions.merchantList = []
        }
      })
    },
    merchantChange(val) {
      const obj = this.selectOptions.merchantList.find((item) => {
        return item.id === val
      })
      this.inputForm.merchantName = obj.merchantName
    },
    // 查看
    queryVoById() {
      getObj(this.$route.query.id || this.inputForm.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm = res.data.data
          this.feeItemTableData = []
          this.feeItemTableData = this.inputForm.feepayDetailsResponseList
          if (!this.detailDisable) {
            this.feeItemTableData.push(this.baseObj)
          }
        } else {
          this.$message.error('查询收费单失败，请联系系统管理员')
        }
      })
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.addDisable) {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.inputForm.id = res.data.data.id
                this.queryVoById()
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.queryVoById()
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
      this.$router.go(-1)// 返回上一层
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
        // 商户详情
        this.$router.push({
          path: '/merchant/detail',
          query: {
            operateType: 'look',
            id: this.inputForm.merchantId
          }
        })
      }
    },
    // 打印收费单
    printItem() {
      this.printDialogVo.visible = true
      this.printDialogVo.id = this.inputForm.id
    },
    setDialogVisiable(data) {
      this.printDialogVo.visible = data
      this.queryVoById()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.fee-pay-info {
  ::v-deep .el-form-item__content {
    line-height: 30px !important;
  }
  .print-item {
    text-align: right;
  }
}
</style>
