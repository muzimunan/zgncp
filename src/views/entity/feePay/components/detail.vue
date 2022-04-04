<template>
  <div class="fee-pay-info">
    <div class="znp-form-wraper" style="width: 100%">
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
            <p class="form-title">{{ addDisable ? '新增合约收费' : editDisable ? '修改合约收费' : '查看合约收费' }}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="合同类型" prop="contractType">
              <el-radio-group
                v-model="inputForm.contractType"
                @change="contractTypeChange"
                :disabled="editDisable || detailDisable || fromContractDisable"
              >
                <el-radio :label="1">出租</el-radio>
                <el-radio :label="2">销售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="6" :lg="6">
            <el-form-item label="合同名称" prop="contractId">
              <el-select
                v-model="inputForm.contractId"
                filterable
                placeholder="请选择合同"
                style="width: 100%"
                @change="contractChange"
                :disabled="editDisable || detailDisable || fromContractDisable"
              >
                <el-option
                  v-for="item in selectOptions.contractList"
                  :key="item.contractId"
                  :label="item.contractName"
                  :value="item.contractId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item>
              <el-descriptions title="" size="medium">
                <el-descriptions-item label="合同开始时间">
                  {{ inputForm.contractSimple.beginDate }}
                </el-descriptions-item>
                <el-descriptions-item label="合同结束时间">
                  {{ inputForm.contractType === 1 ? inputForm.contractSimple.endDate : '--' }}
                </el-descriptions-item>
                <el-descriptions-item :label="inputForm.contractType === 1 ? '商户' : '业主'">
                  {{ inputForm.contractSimple.name }}
                </el-descriptions-item>
                <el-descriptions-item label="物业名称" v-if="inputForm.contractType === 2">
                  <!-- <el-link :underline="false" type="primary" @click="goto('estate')"> -->
                  {{ inputForm.contractSimple.estateName }}
                  <!-- </el-link> -->
                </el-descriptions-item>
                <el-descriptions-item label="物业类型" v-if="inputForm.contractType === 2">
                  {{ inputForm.contractSimple.estateTypeName }}
                </el-descriptions-item>
              </el-descriptions>
              <el-table
                v-if="inputForm.contractType === 1"
                :data="inputForm.contractSimple.estateList"
                style="width: 100%"
                size="medium"
                show-summary
                :summary-method="getSummaries"
                border
              >
                <el-table-column prop="estateName" label="物业名称" align="center" />
                <el-table-column prop="estateTypeName" label="物业类型" align="center" />
                <el-table-column prop="buidingAcr" label="建筑面积(m²)" align="center" />
                <el-table-column prop="rentPrice" label="租金(元)" align="center" />
                <el-table-column prop="propertyFee" label="物业费(元)" align="center" />
                <el-table-column prop="deposit" label="保证金(元)" align="center" />
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="收费项目" prop="feeItemArr">
              <el-select
                v-model="inputForm.feeItemArr"
                multiple
                placeholder="请选择收费项目，可多选"
                style="width: 100%"
                :disabled="detailDisable || editDisable"
                @remove-tag="removeTag"
              >
                <el-option
                  v-for="item in selectOptions.feeItemList"
                  :key="item.id"
                  :label="item.itemName"
                  :value="item.id"
                  :disabled="checkExitsFee(item.id)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="" prop="contractCode">
              <el-table
                :data="inputForm.feePayDetailsList"
                style="width: 100%"
                size="medium"
                border
                :span-method="arraySpanMethod"
              >
                <el-table-column prop="feeItemName" label="收费项目" width="100" align="center" />
                <el-table-column label="收费方式" width="120" align="center">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.payType"
                      placeholder="收费方式"
                      style="width: 100%"
                      :disabled="detailDisable || editDisable || inputForm.contractType === 2"
                      @change="
                        val => {
                          payTypechange(val, scope.row)
                        }
                      "
                    >
                      <el-option
                        v-for="item in selectOptions.payType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="收费周期" width="95" align="center">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.payCycle"
                      placeholder="周期"
                      style="width: 100%"
                      :disabled="scope.row.payType === '1' || detailDisable || Number(scope.row.feepayStatus) !== 1"
                    >
                      <el-option
                        v-for="item in selectOptions.feeFormCycle"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="开始日期" width="150" align="center">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.startDate"
                      type="date"
                      style="width: 100%"
                      value-format="yyyy-MM-dd"
                      placeholder="开始日期"
                      :disabled="detailDisable || Number(scope.row.feepayStatus) !== 1"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="结束日期" width="150" align="center">
                  <template slot-scope="scope">
                    <el-date-picker
                      v-model="scope.row.endDate"
                      type="date"
                      style="width: 100%"
                      value-format="yyyy-MM-dd"
                      placeholder="结束日期"
                      :disabled="detailDisable || Number(scope.row.feepayStatus) !== 1"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="计费方式" width="120" align="center">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.chargeType"
                      placeholder="计费方式"
                      style="width: 100%"
                      :disabled="detailDisable || Number(scope.row.feepayStatus) !== 1"
                      @change="
                        val => {
                          chargeTypechange(val, scope.row)
                        }
                      "
                    >
                      <el-option
                        v-for="item in selectOptions.chargeType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="100" align="center">
                  <template slot-scope="scope">
                    <el-input-number
                      :min="0.0"
                      :controls="false"
                      :precision="2"
                      v-model="scope.row.count"
                      :disabled="scope.row.chargeType === '0' || detailDisable || Number(scope.row.feepayStatus) !== 1"
                      style="width: 70px"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="收款金额/单价" align="center" width="130">
                  <template slot-scope="scope">
                    <el-input-number
                      :min="0.0"
                      :controls="false"
                      :precision="2"
                      :disabled="detailDisable || Number(scope.row.feepayStatus) !== 1"
                      v-model="scope.row.refPrice"
                      style="width: 100px"
                      @change="
                        val => {
                          refPriceChange(val, scope.row)
                        }
                      "
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  :label="innerHead.estateName"
                  align="center"
                  v-for="(innerHead, idx) in inputForm.contractSimple.estateList"
                  :key="idx"
                >
                  <el-table-column label="数量" width="100" align="center">
                    <template slot-scope="scope">
                      <el-input-number
                        :min="0.0"
                        :controls="false"
                        :precision="2"
                        v-model="scope.row.estateFeePayList[idx].count"
                        :disabled="
                          scope.row.chargeType === '0' || detailDisable || Number(scope.row.feepayStatus) !== 1
                        "
                        style="width: 70px"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="收款金额/单价" align="center" width="130">
                    <template slot-scope="scope">
                      <el-input-number
                        :min="0.0"
                        :controls="false"
                        :precision="2"
                        v-model="scope.row.estateFeePayList[idx].refPrice"
                        style="width: 100px"
                        :disabled="detailDisable || Number(scope.row.feepayStatus) !== 1"
                      />
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      circle
                      @click.stop="operateData('add', scope.row, scope.$index)"
                      v-if="scope.row.payType === '0' && isNotfirstFeeItem(scope.row, scope.$index)"
                      :disabled="detailDisable"
                      icon="el-icon-plus"
                    />
                    <!--说明：收费状态为1未收费 并且 不是第一行才允许删除-->
                    <el-button
                      size="mini"
                      type="danger"
                      circle
                      @click.stop="operateData('del', scope.row, scope.$index)"
                      v-if="Number(scope.row.feepayStatus) === 1"
                      :disabled="detailDisable"
                      icon="el-icon-minus"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <div class="el-form-item__error">{{ errorMsg }}</div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
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
          <el-col :xs="24" :sm="12" :md="6" :lg="6">
            <el-form-item label="制单人">
              <el-input v-model="inputForm.payee" placeholder="请输入制单人" :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="付款人">
              <el-input v-model="inputForm.payer" placeholder="请输入付款人" />
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="24" :md="13" :lg="13">
            <el-form-item label="备注">
              <el-input
                v-model="inputForm.remark"
                :disabled="detailDisable"
                type="textarea"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="!detailDisable" style="text-align: center">
            <el-button type="primary" plain @click="goBack">返 回</el-button>
            <el-button @click="saveBtn" type="primary" style="width: 150px">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addObj, queryListContract, getObj, putObj } from '@/api/feePay'
import { delObj } from '@/api/feepaydetails'
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex'
import { getListByKindsType } from '@/api/feeItems'
import { formatDate } from '@/filters/'
import _ from 'lodash'
export default {
  name: 'FeePayDetailPage',
  data() {
    return {
      errorMsg: '', // 错误信息
      selectOptions: {
        payType: [], // 收费方式
        contractList: [], // 合同下拉框
        chargeType: [], // 计费方式
        feeItemList: [], // 收费项目
        feeFormCycle: [] // 收费周期
      },
      inputForm: {
        contractType: 1, // 1出租2销售
        contractId: '',
        feeItemArr: [], // 收费项目
        contractSimple: {}, // 选中合同后的合同对象信息
        feePayDetailsList: [],
        fillpayTime: formatDate('yyyy-MM-dd', new Date()), // 收费日期
        payee: '', // 制单人
        payer: '' // 付款人
      },
      inputFormRules: {
        contractType: [
          { required: true, message: '请选择合同类型', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请选择合同', trigger: 'change' }
        ],
        fillpayTime: [
          { required: true, message: '请填写单据日期', trigger: 'blur' }
        ],
        feeItemArr: [
          { required: true, message: '请选择收费项目，可多选', trigger: 'change' }
        ]
      },
      itemIdArr: [], // 省份要合并数组 [2,0,1,3,0,0] 代表第一二行合并,第三行不变,第四五六行合并,0代表原本的那一行被合并,因此这个列被消除
      itemIdPos: 0 // 省份要合并数组内容的序号
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    detailDisable() {
      return this.$route.query.operateType === 'look'
    },
    editDisable() {
      return this.$route.query.operateType === 'edit'
    },
    addDisable() {
      return this.$route.query.operateType === 'add'
    },
    fromContractDisable() {
      // 从销售合同和出租合同过来的 不允许选择合同（也就是合同下拉框无法选择）
      return Boolean(this.$route.query.contractId && this.$route.query.contractType)
    }
  },
  watch: {
    'inputForm.feeItemArr': {
      handler(l) {
        if (l.length > 0) {
          const feePayDetailsListOld = this.inputForm.feePayDetailsList
          this.inputForm.feePayDetailsList = []
          l.forEach(feeItemId => {
            if (feePayDetailsListOld.filter(o => o.feeItemId === feeItemId) && feePayDetailsListOld.filter(o => o.feeItemId === feeItemId).length > 0) {
              const objArr = feePayDetailsListOld.filter(o => o.feeItemId === feeItemId)
              this.inputForm.feePayDetailsList = this.inputForm.feePayDetailsList.concat(objArr)
            } else {
              const obj = {
                count: 1,
                refPrice: 0.00,
                payType: '0',
                chargeType: '0', // 默认是固定金额
                payCycle: '1',
                feeItemLabelName: '', // 标签名
                feekindsOperationLabelName: '',
                estateFeePayList: [],
                feepayStatus: 1
              }
              obj.feeItemId = feeItemId
              obj.feeItemName = this.selectOptions.feeItemList.find(o => o.id === feeItemId).itemName
              obj.feeItemLabelName = this.selectOptions.feeItemList.find(o => o.id === feeItemId).feeItemLabelName
              obj.feekindsOperationLabelName = this.selectOptions.feeItemList.find(o => o.id === feeItemId).feekindsOperationLabelName
              this.inputForm.feePayDetailsList.push(obj)
            }
          })
          this.manageTableEstateLis()
        } else {
          this.inputForm.feePayDetailsList = []
        }
        this.merage() // 合并的方法
      },
      immediatet: true,
      // 对象内部的属性监听，深度监听
      deep: true
    },
    '$route.id': {
      handler() {
        if (this.$route.path === '/feePay/detail') {
          this.$refs['inputFormRef'].clearValidate()
          const info = this.$route.query
          if (info.contractId) {
            this.inputForm.contractType = parseInt(info.contractType)
          }
          // 获取下拉框数据
          this.getSelectList()

          if (info.id) {
            // 加载商品详细信息
            this.queryVoById()
          } else {
            this.inputForm.payee = this.userInfo.trueName
          }
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    },
    $route(to, from) {
      if (from.query.operateType !== 'add' && to.path !== '/feePay/detail') {
        this.$refs['inputFormRef'].resetFields()
        this.inputForm.contractSimple = {}
      }
    }
  },
  created() {
    const info = this.$route.query
    if (info.contractId) {
      this.inputForm.contractType = parseInt(info.contractType)
    }
    // 获取下拉框数据
    this.getSelectList()

    if (info.id) {
      // 加载商品详细信息
      this.queryVoById()
    } else {
      this.inputForm.payee = this.userInfo.trueName
    }
  },
  methods: {
    getSelectList() {
      // 收费项目(1:运营科目 2:财务科目)
      getListByKindsType('1').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeItemList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
      // 收费方式
      remote('pay_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.payType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 查询合同的下拉列表
      if (this.addDisable) {
        this.queryListContract()
      }
    },
    queryListContract() {
      queryListContract(this.inputForm.contractType).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.contractList = res.data.data
          const info = this.$route.query
          if (info.contractId) {
            this.inputForm.contractId = parseInt(info.contractId) // 刷新浏览器之后参数会转换为字符串类型 需要强制转换成int类型
            this.contractChange(this.inputForm.contractId)
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
          // 收费项目收集id（数组去重）
          this.$set(this.inputForm, 'feeItemArr', Array.from(new Set(this.inputForm.feePayDetailsList.map(o => { return o.feeItemId }))))
          // this.inputForm.feeItemArr = this.inputForm.feePayDetailsList.map(o => { return o.feeItemId }) // 直接更新数组，如果在页面修改点击数组不会触发试图更新 解决：1.用this.$set2.用数组的原生方法splice()、 push()、pop()、shift()、unshift()、sort()、reverse()
          this.inputForm.feePayDetailsList.forEach(o => {
            o.chargeType = o.chargeType + ''
            o.payCycle = (o.payCycle !== null ? o.payCycle : '') + ''
            o.payType = o.payType + ''
          })
          // 如果下拉框没有当前的合同信息，将当前的合同id和name塞到合同的下拉框中
          const estateIndex = this.selectOptions.contractList.findIndex(o => o.contractId === this.inputForm.contractId)
          if (estateIndex === -1) {
            this.selectOptions.contractList.push({ contractId: this.inputForm.contractId, contractName: this.inputForm.contractName })
          }
          this.resetEstateList()
        } else {
          this.$message.error('查询临时收费失败，请联系系统管理员')
        }
      })
    },
    // 合同下拉框改变
    contractChange(val) {
      this.inputForm.contractSimple = this.selectOptions.contractList.find(o => o.contractId === val)
      this.resetEstateList()
      this.manageTableEstateLis()
    },
    // 重置estateList数据 为了让销售合同和出租合同显示不一致
    resetEstateList() {
      this.inputForm.contractSimple.estateListTemp = JSON.parse(JSON.stringify(this.inputForm.contractSimple.estateList))
      if (this.inputForm.contractType === 2) {
        this.inputForm.contractSimple.estateName = this.inputForm.contractSimple.estateList[0].estateName
        this.inputForm.contractSimple.estateTypeName = this.inputForm.contractSimple.estateList[0].estateTypeName
        this.inputForm.contractSimple.estateList = []
      }
    },
    /**
     * 说明：只有出租合同才会在收费项目table中显示物业 否则不显示
     * ps：出租：当前为啥没有自动填充各物业的出租 物业 保证金 是因为租金物业保证金和这个收费项目的id没办法对起来
     * 销售合同不在table中显示 但是传递参数的时候 还要传给后端 也就是下面方法第一行 别判断合同类型
     */
    manageTableEstateLis() {
      if (this.inputForm.contractSimple.estateListTemp && this.inputForm.contractSimple.estateListTemp.length > 0) {
        this.inputForm.feePayDetailsList.forEach(item => {
          const estateFeePayListOld = item.estateFeePayList
          item.estateFeePayList = []
          // item.refPrice = 0.00
          this.inputForm.contractSimple.estateListTemp.forEach(estateObj => {
            let newObj = {
              count: 1,
              refPrice: 0.00, // item.feeItemName === '水费' ? estateObj.rentPrice : (item.feeItemName === '电费' ? estateObj.propertyFee : estateObj.deposit),
              estateId: '',
              feeItemId: ''
            }
            if (estateFeePayListOld.find(o => o.feeItemId === item.feeItemId && o.estateId === estateObj.estateId)) {
              newObj = estateFeePayListOld.find(o => o.feeItemId === item.feeItemId && o.estateId === estateObj.estateId)
            } else {
              newObj.estateId = estateObj.estateId
              newObj.feeItemId = item.feeItemId
            }
            item.estateFeePayList.push(newObj)
            // item.refPrice = (Number(item.refPrice) + Number(newObj.refPrice)).toFixed(2)
          })
        })
      }
    },
    // 合同类型改变
    contractTypeChange(val) {
      this.inputForm.contractSimple = {}
      this.inputForm.contractId = ''
      // 重新根据合同类型查询合同
      this.queryListContract()
      // 清空收费项目表
      this.inputForm.feeItemArr = []
      // 清空表单验证
      this.$nextTick(() => {
        this.$refs['inputFormRef'].clearValidate()
      })
    },
    // 计费方式变更交互
    chargeTypechange(val, row) {
      row.count = 1
      row.estateFeePayList.forEach((o, index) => {
        o.count = 1
      })
    },
    // 收费方式变更交互
    payTypechange(val, item) {
      if (val === '1') {
        // 保留同类收费项目中的第一条数据
        const indexs = []
        let havefee = 0
        for (let i = 0; i < this.inputForm.feePayDetailsList.length; i++) {
          const obj = this.inputForm.feePayDetailsList[i]
          if (obj.feeItemId === item.feeItemId) {
            indexs.push(i) // 收集同一项目类别的索引
            if (Number(obj.feepayStatus) !== 1) {
              havefee++
            }
          }
        }
        if (havefee >= 2) {
          this.$message.error('存在多条已收费的合约收费明细，不可以切换收费方式')
          item.payType = '0'
          return
        }
        indexs.splice(0, 1) // 保留第一条数据
        this.inputForm.feePayDetailsList = this.inputForm.feePayDetailsList.filter((obj, index) => indexs.indexOf(index) === -1)
        this.merage()
        // 收费方式为一次性
        item.payCycle = '' // 清空周期
        // item.chargeType = '' // 清空计费方式
        item.count = 1 // 清空数量
      } else {
        item.count = 1
        // 收费方式为分期
        item.payCycle = '1' // 默认周期年
      }
    },
    operateData(type, item, index) {
      if (type === 'add') {
        // 增加
        const obj = {
          count: 1,
          refPrice: 0.00,
          payType: item.payType,
          chargeType: '0', // 默认是固定金额
          payCycle: '1',
          estateFeePayList: [],
          feeItemId: item.feeItemId,
          feeItemName: item.feeItemName,
          feeItemLabelName: item.feeItemLabelName,
          feekindsOperationLabelName: item.feekindsOperationLabelName,
          feepayStatus: '1'// 新增加一条默认未收费
        }
        this.inputForm.feePayDetailsList.splice(index + 1, 0, obj)
        this.manageTableEstateLis()
      } else {
        // 判断当前收费方式是否是一次性还是分期 同时联动上面的多选框数据的变化
        // 如果是一次性 直接feeItemArr中删除当前feeItemId
        // 如果是分期 判断 当前条是否是同一个收费项目中最后一条 如果是 直接feeItemArr中删除当前feeItemId
        if (item.payType === '1') {
          // 一次性
          const feeItemIndex = this.inputForm.feeItemArr.findIndex(o => o === item.feeItemId)
          this.inputForm.feeItemArr.splice(feeItemIndex, 1)
        } else {
          // 分期
          const feePayDetailsListTemp = this.inputForm.feePayDetailsList.filter(obj => { return obj.feeItemId === item.feeItemId })
          if (feePayDetailsListTemp.length === 1) {
            const feeItemIndex = this.inputForm.feeItemArr.findIndex(e => e === item.feeItemId)
            this.inputForm.feeItemArr.splice(feeItemIndex, 1)
          }
        }
        // 删除
        this.inputForm.feePayDetailsList.splice(index, 1)
        // 如果id 不为空 就是真删除
        if (item.id) {
          delObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('删除成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      }
      this.merage() // 合并的方法
    },
    isNotfirstFeeItem(item, index) {
      // 判断当前行是不是相同收费项目类里面的第行。如果是 返回false
      const indexArr = []
      for (let i = 0; i < this.inputForm.feePayDetailsList.length; i++) {
        const obj = this.inputForm.feePayDetailsList[i]
        if (obj.feeItemId === item.feeItemId) {
          indexArr.push(i) // 收集同一项目类别的索引
        }
      }
      if (indexArr[0] === index) {
        return true
      } else {
        return false
      }
    },
    removeTag(feeItemId) {
      if (this.checkExitsFee(feeItemId)) {
        this.$message.error('存在已收费的合约收费明细，不可以删除')
      }
    },
    // 判断是否存在收费
    checkExitsFee(feeItemId) {
      let havefee = 0
      for (let i = 0; i < this.inputForm.feePayDetailsList.length; i++) {
        const obj = this.inputForm.feePayDetailsList[i]
        if (obj.feeItemId === feeItemId && Number(obj.feepayStatus) !== 1) {
          havefee++
        }
      }
      if (havefee > 0) {
        return true
      } else {
        return false
      }
    },
    // 计费方式为固定金额的时候，每个与物业的金额 按照物业面积进行拆分。即 总金额*当前物业的面积为当前物业的金额
    refPriceChange(val, row) {
      if (row.chargeType === '0') {
        // 计算每个物业的面积
        // 1.当前总金额
        const totalPrice = val
        if (row.estateFeePayList.length > 0) {
          // 2.计算当前所有合同的总面积
          const totalBuidingAcr = _.sumBy(this.inputForm.contractSimple.estateList, (o) => { return Number(o.buidingAcr) })
          const myMap = new Map()
          this.inputForm.contractSimple.estateList.forEach(o => {
            myMap.set(o.estateId, (Number(o.buidingAcr) / totalBuidingAcr).toFixed(2))
          })
          let priceSum = Number(0.00)
          row.estateFeePayList.forEach((o, index) => {
            if (index === row.estateFeePayList.length - 1) {
              o.refPrice = Number(totalPrice - priceSum).toFixed(2)
            } else {
              o.refPrice = (totalPrice * Number(myMap.get(o.estateId))).toFixed(2)
              priceSum = Number(priceSum) + Number(o.refPrice)
            }
          })
        }
      }
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.errorMsg = ''
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          // 校验收费项目明细
          // 收费方式为一次性,日期必填
          // 收费方式为分期,周期 日期 计费方式必填
          if (this.inputForm.feePayDetailsList.length > 0) {
            for (let i = 0; i < this.inputForm.feePayDetailsList.length; i++) {
              const obj = this.inputForm.feePayDetailsList[i]
              if (obj.payType === '1') {
                // 一次性：校验日期必填
                if (!obj.startDate || !obj.endDate) {
                  this.errorMsg = '收费方式为一次性，开始日期、结束日期必填'
                  return
                }
              } else if (obj.payType === '0') {
                // 分期：周期 日期 计费方式 必填
                if (!obj.payCycle || !obj.startDate || !obj.chargeType || !obj.endDate) {
                  this.errorMsg = '收费方式为分期，收费周期、开始日期、结束日期、计费方式必填'
                  return
                }
              } else {
                this.errorMsg = '请选择收费方式'
                return
              }
              // 如果合同类型是销售合同 自动填充物业的数量和单价/金额
              if (this.inputForm.contractType === 2) {
                obj.estateFeePayList.forEach(estateObj => {
                  estateObj.count = obj.count
                  estateObj.refPrice = obj.refPrice
                })
              }
              // 单价和数量横向验证
              const priceTotal = obj.count * obj.refPrice // 总的 数量*单价
              let estatePriceTotal = 0.00
              if (obj.estateFeePayList.length > 0) {
                estatePriceTotal = obj.estateFeePayList.reduce((total, item) => total + (item.count * item.refPrice), 0)
              }
              if (Number(priceTotal).toFixed(2) !== Number(estatePriceTotal).toFixed(2)) {
                this.errorMsg = '收费项目数量*收款金额与各个物业数量*收款金额的总和不相等，请确认'
                return
              }
            }
          } else {
            this.$message.error('请填写收费项目')
          }
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
      // this.$router.go(-1)// 返回上一层
      this.$router.push({ path: '/entity/feePay/index' })
    },
    // 跳转页面
    goto(type) {
      if (type === 'estate') {
        // 物业详情
        this.$router.push({
          path: '/eatate/detail',
          query: {
            operateType: 'look',
            id: this.inputForm.contractSimple.estateId
          }
        })
      } else if (type === 'merchant') {
        // 商户详情
        this.$router.push({
          path: '/merchant/detail',
          query: {
            operateType: 'look',
            id: this.inputForm.contractSimple.nameId
          }
        })
      } else {
        // 业主详情
        this.$router.push({
          path: '/investor/detail',
          query: {
            operateType: 'look',
            id: this.inputForm.contractSimple.nameId
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
    },
    // 合并上下列相同的收费项目
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        // 第一列的合并方法
        const _row_1 = this.itemIdArr[rowIndex]
        const _col_1 = _row_1 > 0 ? 1 : 0 // 如果被合并了_row=0则它这个列需要取消
        return {
          rowspan: _row_1,
          colspan: _col_1
        }
      }
    },
    merage() {
      // 要合并的数组sw===
      this.merageInit()
      for (var i = 0; i < this.inputForm.feePayDetailsList.length; i++) {
        if (i === 0) {
          // 第一行必须存在
          this.itemIdArr.push(1)
          this.itemIdPos = 0
        } else {
          // 判断当前元素与上一个元素是否相同 this.itemIdPos是areaIdArr内容的序号
          if (this.inputForm.feePayDetailsList[i].feeItemName === this.inputForm.feePayDetailsList[i - 1].feeItemName) {
            this.itemIdArr[this.itemIdPos] += 1
            this.itemIdArr.push(0)
          } else {
            this.itemIdArr.push(1)
            this.itemIdPos = i
          }
        }
      }
    },
    merageInit() {
      // 初始化合并行的数组
      this.itemIdArr = []
      this.itemIdPos = 0
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
  .znp-form-wraper {
    width: 1200px;
  }
  ::v-deep .el-select {
    .el-select__tags {
      .el-tag {
        .el-tag__close {
          display: none !important;
        }
      }
    }
  }
}
</style>
