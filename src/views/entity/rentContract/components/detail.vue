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
            <p class="form-title">
              {{
                addDisable ? '新增出租合同' : editDisable ? '修改出租合同' : rerentDisable ? '合同续租' : '查看出租合同'
              }}
            </p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item
              label="合同编码"
              prop="contactCode"
              class="znp-remove-start"
              v-if="!addDisable && !rerentDisable"
            >
              <el-input
                v-model="inputForm.contractCode"
                placeholder="自动生成，可自定义……"
                maxlength="18"
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
            <el-form-item label="合同状态" prop="contractStatus" v-if="!rerentDisable">
              <el-select
                v-model="inputForm.contractStatus"
                clearable
                placeholder="请选择合同状态"
                :disabled="detailDisable || addDisable || updateFlag"
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
                :disabled="updateFlag"
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
              <!-- <el-link :underline="false" type="primary" @click="goto('merchant')">
                &nbsp;{{ inputForm.merchantName }}
              </el-link> -->
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
                :disabled="detailDisable || updateFlag"
              />
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
            <el-form-item label="原合同编号" prop="contractNum">
              <el-input
                v-model="inputForm.contractNum"
                placeholder="请输入原合同编号"
                clearable
                maxlength="50"
                show-word-limit
                :disabled="detailDisable"
              />
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
                :disabled="detailDisable || updateFlag || rerentDisable"
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
                :disabled="detailDisable || updateFlag"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="租金总额" prop="contractPrice">
              <el-input
                v-model="inputForm.contractPrice"
                placeholder="租金总额 单位（元）"
                clearable
                :disabled="detailDisable || updateFlag"
                @blur="calculateAmountByRatio"
              >
                <template slot="suffix">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="租金收费方式" prop="payType">
              <el-select
                v-model="inputForm.payType"
                clearable
                placeholder="请选择收费方式"
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
            <el-form-item label="保证金总额" prop="deposit">
              <el-input
                v-model="inputForm.deposit"
                placeholder="请输入保证金总额"
                clearable
                :disabled="detailDisable || updateFlag"
                @blur="calculateAmountByRatio"
              >
                <template slot="suffix">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="物业费总额" prop="propertyFee">
              <el-input
                v-model="inputForm.propertyFee"
                placeholder="请输入物业费总额"
                clearable
                :disabled="detailDisable || updateFlag"
                @blur="calculateAmountByRatio"
              >
                <template slot="suffix">元</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="物业档案" prop="estateArr">
              <el-select
                v-model="inputForm.estateArr"
                filterable
                multiple
                placeholder="请选择物业档案,可检索"
                style="width: 100%"
                :disabled="detailDisable || updateFlag || rerentDisable"
              >
                <el-option
                  v-for="item in selectOptions.estateList"
                  :key="item.id"
                  :label="item.estateName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="" prop="contractCode">
              <el-table
                :data="inputForm.estateList"
                style="width: 100%"
                size="medium"
                show-summary
                :summary-method="getSummaries"
                border
              >
                <el-table-column prop="estateName" label="物业名称" align="center">
                  <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="goto('estate', scope.row.estateId)">
                      &nbsp;{{ scope.row.estateName }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="buidingAcr" label="建筑面积(m²)" align="center" />
                <el-table-column label="租金(元)" prop="rentPrice" align="center">
                  <template slot-scope="scope">
                    <el-input-number
                      :min="0.0"
                      :controls="false"
                      :precision="2"
                      v-model="scope.row.rentPrice"
                      :disabled="detailDisable || updateFlag"
                      style="width: 120px"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="物业费(元)" prop="propertyFee" align="center">
                  <template slot-scope="scope">
                    <el-input-number
                      :min="0.0"
                      :controls="false"
                      :precision="2"
                      v-model="scope.row.propertyFee"
                      :disabled="detailDisable || updateFlag"
                      style="width: 120px"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="保证金(元)" prop="deposit" align="center">
                  <template slot-scope="scope">
                    <el-input-number
                      :min="0.0"
                      :controls="false"
                      :precision="2"
                      v-model="scope.row.deposit"
                      :disabled="detailDisable || updateFlag"
                      style="width: 120px"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <div class="el-form-item__error">{{ errorMsg }}</div>
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
                  :closable="!detailDisable"
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
import { addObj, getObj, putObj, reRentObj } from '@/api/rent-contract'
import { getRemoteEstateList } from '@/api/estate'
import { getRemoteMerchantList } from '@/api/merchant'
import { importFile } from '@/api/upload'
import { remote } from '@/api/admin/dict'
import '@/assets/css/fileIcon/iconfont.js' // 自定义生成的文件icon
import { rule } from '@/util/validateRules'
import _ from 'lodash'
export default {
  name: 'RentContractDetail',
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.addDisable && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
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
      firstLoadFlag: 0,
      errorMsg: '', // 错误信息
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '选填',
      selectOptions: {
        flagType: [], // 是否临租
        contractStatus: [], // 合同状态
        payType: [], // 付款方式
        estateList: [], // 物业档案
        merchantList: []// 商户档案
      },
      inputForm: {
        rentFormCode: '', // 出租登记单编码
        rentFormId: '', // 出租登记单id
        contactCode: '', // 合同编码
        contractName: '', // 合同名称
        contractStatus: '1', // 合同状态 //新增默认是生效
        estateArr: [], // 物业档案多个
        estateId: '', // 物业档案
        estateName: '', // 物业档案名称
        merchantName: '', // 商户档案名称
        merchantId: '', // 商户档案
        isTemp: '0', // 是否临租
        signDate: _that.getNowDate(), // 签订日期
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        contractPrice: '0.00', // 租金总额
        deposit: '0.00', // 保证金
        propertyFee: '0.00', // 物业费
        payType: '1', // 付款方式
        contractNum: '', // 原合同编号
        pictureArr: [], // 多个附件
        attachLists: [], // 传给后端的参数 图片地址数组集合
        remark: '', // 备注
        estateList: [] // 物业档案明细集合
      },
      inputFormRules: {
        contactCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        contractName: [
          { required: true, message: '请输入合同名称', trigger: 'blur' }
        ],
        contractStatus: [
          { required: true, message: '请选择合同状态', trigger: 'blur' }
        ],
        estateArr: [
          { required: true, message: '请选择物业档案', trigger: 'change' }
        ],
        merchantId: [
          { required: true, message: '请选择商户档案', trigger: 'change' }
        ],
        signDate: [
          { required: true, message: '请选择签订日期', trigger: 'blur' }
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
        payType: [
          { required: true, message: '请选择收费方式', trigger: 'change' }
        ],
        isTemp: [
          { required: true, message: '请选择是否临租', trigger: 'change' }
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
    rerentDisable() {
      return this.$route.query.operateType === 'rerent'
    },
    updateFlag() {
      return this.$route.query.operateType === 'edit' && this.inputForm.updateFlag === 0 // updateFlag  是否可更新1，可更新 0：不可更新(存在合约收费的合同不允许修改的项目)
    }
  },
  watch: {
    '$route.id': {
      handler() {
        if (this.$route.path === '/rentContract/detail') {
          this.$refs['inputFormRef'].clearValidate()
          // 获取下拉框数据
          this.getSelectList()
          // 修改产品进来的话
          const info = this.$route.query
          if (info.id && this.$route.query.operateType !== 'add') {
            // 加载商品详细信息
            this.queryVoById(info)
          }
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    },
    'inputForm.estateArr': {
      handler(l) {
        if (l.length > 0) {
          const estateListOld = this.inputForm.estateList
          this.inputForm.estateList = []
          l.forEach(estateId => {
            let obj = {
              estateId: estateId,
              estateName: '',
              buidingAcr: 0.00,
              rentPrice: 0.00,
              propertyFee: 0.00,
              deposit: 0.00
            }
            if (estateListOld.find(o => o.estateId === estateId)) {
              obj = estateListOld.find(o => o.estateId === estateId)
            } else {
              const estate = this.selectOptions.estateList.find(o => o.id === estateId)
              obj.estateName = estate.estateName
              obj.buidingAcr = estate.buidingAcr
            }
            this.inputForm.estateList.push(obj)
          })
          // 根据物业面积比例计算租金金额、物业费、和保证金
          if (this.firstLoadFlag > 0) {
            this.calculateAmountByRatio()
          }
          this.firstLoadFlag++
        } else {
          this.inputForm.estateList = []
        }
      },
      immediatet: true,
      // 对象内部的属性监听，深度监听
      deep: true
    },
    $route(to, from) {
      if (from.query.operateType !== 'add' && to.path !== '/rentContract/detail') {
        this.$refs['inputFormRef'].resetFields()
      }
    }
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 修改产品进来的话
    const info = this.$route.query
    if (info.id && this.$route.query.operateType !== 'add') {
      // 加载商品详细信息
      this.queryVoById(info)
    }
  },
  methods: {
    calculateAmountByRatio() {
      if (this.inputForm.estateList.length > 0) {
        const rentPriceTotal = Number(this.inputForm.contractPrice || 0.00) // 租金总额
        const depositTotal = Number(this.inputForm.deposit || 0.00) // 物业费总额
        const propertyFeeTotal = Number(this.inputForm.propertyFee || 0.00) // 保证金总额
        const acrTotal = _.sumBy(this.inputForm.estateList, (o) => { return Number(o.buidingAcr) }) // 总面积
        let sumRentMoneyPre = Number(0.00)
        let sumDepositPre = Number(0.00)
        let sumPropertyFeePre = Number(0.00)
        this.inputForm.estateList.forEach((o, index) => {
          if (index === this.inputForm.estateList.length - 1) {
            // 最后一条物业计算用倒减法
            o.rentPrice = Number(rentPriceTotal - sumRentMoneyPre).toFixed(2)
            o.deposit = Number(depositTotal - sumDepositPre).toFixed(2)
            o.propertyFee = Number(propertyFeeTotal - sumPropertyFeePre).toFixed(2)
          } else {
            o.rentPrice = Number((o.buidingAcr / acrTotal) * rentPriceTotal).toFixed(2)
            sumRentMoneyPre += Number(o.rentPrice)
            o.deposit = Number((o.buidingAcr / acrTotal) * depositTotal).toFixed(2)
            sumDepositPre += Number(o.deposit)
            o.propertyFee = Number((o.buidingAcr / acrTotal) * propertyFeeTotal).toFixed(2)
            sumPropertyFeePre += Number(o.propertyFee)
          }
        })
      }
    },
    getSelectList() {
      // 是否
      remote('flag_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.flagType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
      this.remotemerchantMethod()
      // this.remoteEstateMethod()
      // 物业档案
      getRemoteEstateList({
        status: 0 // 使用状态 闲置:0 自用:1 出租:2
        // owner: '0,1' // 所有权 未售:0 已售:1 委托经营:2
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          if (this.selectOptions.estateList.length > 0) {
            this.selectOptions.estateList = this.unique(this.selectOptions.estateList.concat(res.data.data))
          } else {
            this.selectOptions.estateList = res.data.data
          }
        } else {
          this.$message.error('查询物业列表失败，请联系系统管理员')
          this.selectOptions.estateList = []
        }
      })
    },
    // 数组去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    // 根据编码或名称检索物业档案
    remoteEstateMethod(query) {
      // 查询物业档案中的【所有权】为“自持或已售”且【使用状态】为“闲置”
      getRemoteEstateList({
        estateCodeOrName: query,
        status: 0, // 使用状态 闲置:0 自用:1 出租:2
        owner: '0,1' // 所有权自持:0 已售:1 已售回租:2
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
          this.inputForm = res.data.data
          // 所有的下拉框转换为字符串
          this.inputForm.contractStatus = this.inputForm.contractStatus + '' // 合同状态
          this.inputForm.payType = this.inputForm.payType + '' // 付款方式
          this.inputForm.isTemp = this.inputForm.isTemp + '' // 是否临租
          this.$set(this.inputForm, 'estateArr', this.inputForm.estateList.map(item => {
            return item.estateId
          }))
          this.$set(this.inputForm, 'pictureArr', this.inputForm.attachLists.map(item => {
            return {
              path: item.attachPath,
              ext: this.subStringUrl(item.attachPath)
            }
          }))
          this.inputForm.attachLists = []
          this.inputForm.pictureArr.forEach(item => {
            this.inputForm.attachLists.push(item.path)
          })
          // 如果下拉框没有当前的物业档案，将当前的物业档案id和name塞到物业档案下拉框中
          this.inputForm.estateList.forEach(item => {
            const estateIndex = this.selectOptions.estateList.findIndex(o => o.id === item.estateId)
            if (estateIndex === -1) {
              this.selectOptions.estateList.push({ id: item.estateId, estateName: item.estateName, buidingAcr: item.buidingAcr })
            }
          })
          // 续租处理逻辑
          if (this.$route.query.operateType === 'rerent') {
            this.inputForm.id = undefined
            this.inputForm.contactCode = undefined
            this.inputForm.contractName = undefined
            this.inputForm.startDate = this.inputForm.nextStartDate // 续租的开始日期
            this.inputForm.endDate = this.inputForm.nextEndDate // 续租的结束日期
            this.inputForm.sourceContractId = this.$route.query.id
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
                this.$message.error('新增失败' + res.data.msg)
              }
            })
          } else if (this.rerentDisable) {
            reRentObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('续租成功')
              } else {
                this.$message.error('续租失败' + res.data.msg)
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
      // this.$router.go(-1)// 返回上一层
      this.$router.push({ path: '/entity/rentContract/index' })
    },
    // 上传图片相关 begin
    uploadRequest(file) {
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
    goto(type, estateId) {
      if (type === 'estate') {
        // 物业详情
        this.$router.push({
          path: '/eatate/detail',
          query: {
            operateType: 'look',
            id: estateId
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
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = Number(sums[index]).toFixed(2)
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
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
  ::v-deep .el-input-number.is-without-controls .el-input__inner {
    text-align: center !important;
  }
}
</style>
