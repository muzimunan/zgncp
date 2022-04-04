<template>
  <div class="rentform-info">
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
            <p class="form-title">
              {{ addDisable ? '新增出租登记单' : editDisable ? '修改出租登记单' : '查看出租登记单' }}
            </p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="单据编码" prop="formCode" class="znp-remove-start" v-if="!addDisable">
              <el-input
                v-model="inputForm.formCode"
                placeholder="自动生成，可自定义……"
                maxlength="17"
                show-word-limit
                clearable
                :disabled="detailDisable || editDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="登记日期" prop="rentDate">
              <el-date-picker
                v-model="inputForm.rentDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择登记日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="单据状态" prop="formStatus">
              <el-select
                v-model="inputForm.formStatus"
                clearable
                placeholder="请选择出租登记单状态"
                :disabled="detailDisable || addDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.formStatus"
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
                &nbsp;{{ inputForm.estateName }}
              </el-link>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="商户档案" prop="merchantId">
              <el-select
                v-show="!detailDisable"
                v-model="inputForm.merchantId"
                filterable
                remote
                placeholder="请选择,可按编码/名称检索"
                :remote-method="remotemerchantMethod"
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
            <el-form-item label="是否临租" prop="isTemp">
              <el-select
                v-model="inputForm.isTemp"
                clearable
                placeholder="请选择是否可售"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.flagType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
            <el-form-item label="租金总额" prop="contractPrice">
              <el-input v-model="inputForm.contractPrice" placeholder="单位（元）" clearable :disabled="detailDisable">
                <template slot="suffix">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="保证金" prop="deposit">
              <el-input v-model="inputForm.deposit" placeholder="保证金 单位（元）" clearable :disabled="detailDisable">
                <template slot="suffix">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="物业费" prop="propertyFee">
              <el-input
                v-model="inputForm.propertyFee"
                placeholder="物业费 单位（元）"
                clearable
                :disabled="detailDisable"
              >
                <template slot="suffix">元</template>
              </el-input>
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
    <div v-if="detailDisable" class="znp-tables-wrap">
      <div class="rent-contract">
        <el-tabs v-model="activeName1" type="border-card">
          <el-tab-pane label="租赁合同" name="rentcontract">
            <rentcontract
              :table-data="rentContractTableData"
              :detail-disable="detailDisable"
              :rentform-vo="inputForm"
              :is-exist-valid-contract="isExistValidContract"
              @queryVoById="queryVoById"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="fee-item">
        <el-tabs v-model="activeName2" type="border-card">
          <el-tab-pane label="收费项" name="feeitem">
            <feeitem
              :table-data="feeItemTableData"
              :detail-disable="detailDisable"
              :rentform-vo="inputForm"
              :is-exist-fee-form="isExistFeeForm"
              @queryVoById="queryVoById"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { addObj, getObj, putObj } from '@/api/rentform'
import { getRemoteEstateList } from '@/api/estate'
import { getRemoteMerchantList } from '@/api/merchant'
import { remote } from '@/api/admin/dict'
import '@/assets/css/fileIcon/iconfont.js' // 自定义生成的文件icon
import rentcontract from './rentcontract'// 【租赁合同】
import feeitem from './feeitem'// 【收费项】
import { rule } from '@/util/validateRules'
export default {
  name: 'RentformDetail',
  components: { rentcontract, feeitem },
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.addDisable && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
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
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '选填',
      selectOptions: {
        formStatus: [], // 出租登记单状态
        flagType: [], // 是否临租
        estateList: [], // 物业档案列表
        merchantList: []// 商户档案列表
      },
      inputForm: {
        formCode: '', // 出租登记单编码
        formStatus: '1', // 出租登记单状态 //新增默认是生效
        estateId: '', // 物业档案
        estateName: '', // 物业档案名称
        merchantId: '', // 商户档案
        merchantName: '', // 商户档案名称
        rentDate: _that.getNowDate(), // 签订日期
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        contractPrice: '', // 出租登记单金额
        deposit: '', // 保证金
        propertyFee: '', // 物业费
        isTemp: '', // 是否临租
        remark: '' // 备注
      },
      inputFormRules: {
        formCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        formStatus: [
          { required: true, message: '请选择出租登记单状态', trigger: 'blur' }
        ],
        estateId: [
          { required: true, message: '请选择物业档案', trigger: 'change' }
        ],
        merchantId: [
          { required: true, message: '请选择商户档案', trigger: 'change' }
        ],
        rentDate: [
          { required: true, message: '请选择登记日期', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, validator: checkEndDate, trigger: 'blur' }
        ],
        contractPrice: [
          { required: true, message: '请输入租金总额', trigger: 'blur' },
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ],
        deposit: [
          { required: true, message: '请输入保证金', trigger: 'blur' },
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ],
        propertyFee: [
          { required: true, message: '请输入物业费', trigger: 'blur' },
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ],
        isTemp: [
          { required: true, message: '请选择是否临租', trigger: 'change' }
        ]
      },
      activeName1: 'rentcontract',
      activeName2: 'feeitem',
      rentContractTableData: [], // 租赁合同列表
      feeItemTableData: [], // 收费项列表
      baseObj: {
        flag: 'add' // 添加那行的标记
      },
      isExistValidContract: false, //  是否存在有效合同 false 不存在，显示创建合同按钮 true 存在，不显示创建合同按钮
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
      // 出租登记单状态
      remote('rent_form_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.formStatus = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 是否
      remote('flag_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.flagType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      this.remoteEstateMethod()
      this.remotemerchantMethod()
    },
    // 根据编码或名称检索物业档案
    remoteEstateMethod(query) {
      // 查询物业档案中的【使用状态】为“闲置”
      getRemoteEstateList({
        estateCodeOrName: query,
        status: 0 // 使用状态 闲置:0 自用:1 出租:2
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
    // 根据编码或名称检索商户
    remotemerchantMethod(query) {
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
      getObj(this.$route.query.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.isExistValidContract = res.data.data.isExistValidContract
          this.isExistFeeForm = res.data.data.isExistFeeForm
          this.inputForm = res.data.data.rentFormData
          // 所有的下拉框转换为字符串
          this.inputForm.formStatus = this.inputForm.formStatus + '' // 出租登记单状态
          this.inputForm.isTemp = this.inputForm.isTemp + '' // 是否临租
          // 如果下拉框没有当前的物业档案，将当前的物业档案id和name塞到物业档案下拉框中
          const estateIndex = this.selectOptions.estateList.findIndex(o => o.id === this.inputForm.estateId)
          if (estateIndex === -1 && this.inputForm.estateId) {
            this.selectOptions.estateList.push({ id: this.inputForm.estateId, estateName: this.inputForm.estateName })
          }
          // 租赁合同
          this.rentContractTableData = []
          this.rentContractTableData = res.data.data.rentFormData.rentContractList
          // 资质与证件
          this.feeItemTableData = []
          this.feeItemTableData = res.data.data.rentFormData.feeFormList
          this.feeItemTableData.push(this.baseObj)
        } else {
          this.$message.error('查询出租登记单失败，请联系系统管理员')
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
      // this.$router.push({path: '/entity/rentForm/index'})
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.rentform-info {
  ::v-deep .el-form-item__content {
    line-height: 30px !important;
  }
}
</style>
