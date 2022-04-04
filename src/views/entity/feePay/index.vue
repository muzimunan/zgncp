<template>
  <div class="fee-pay">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="合同类型" prop="contractType" style="display: block">
          <el-radio-group v-model="formParams.contractType" @change="handlerSearch(1)">
            <el-radio :label="1">出租</el-radio>
            <el-radio :label="2">销售</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" prop="contractCodeOrName">
          <el-input v-model="formParams.contractCodeOrName" placeholder="合同编码或名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="contractUserName">
          <el-input v-model="formParams.contractUserName" placeholder="合同乙方名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="feepayCode">
          <el-input v-model="formParams.feepayCode" placeholder="单据编号" clearable />
        </el-form-item>

        <el-form-item prop="startFillpayTime">
          <el-date-picker
            v-model="formParams.startFillpayTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="单据开始日期"
          />
        </el-form-item>
        <el-form-item prop="endFillpayTime">
          <el-date-picker
            v-model="formParams.endFillpayTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="单据结束日期"
          />
        </el-form-item>
        <el-form-item label="" prop="buildingNum">
          <el-select v-model="formParams.buildingNum" placeholder="楼号" filterable clearable>
            <el-option
              v-for="(item, index) in selectOptions.buildingList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="operationTypesKindsId">
          <el-select v-model="formParams.operationTypesKindsId" placeholder="业态" style="width: 100%">
            <el-option
              v-for="item in selectOptions.kindsList"
              :key="item.id"
              :label="item.kindsName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="estateName">
          <el-input v-model="formParams.estateName" placeholder="物业名称" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_feepay_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
        <el-button v-if="permissions.entity_feepay_add" type="primary" size="mini" @click="distribAdmin">
          分配任务
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="tableLoading"
        :data="tableData"
        class="more_btn"
        style="width: 100%"
        border
        size="small"
        @selection-change="selectRow"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="feepayCode" label="单据编码" width="150" />
        <el-table-column prop="contractName" label="合同名称" />
        <el-table-column prop="contractCode" label="合同编码" width="150" />
        <el-table-column prop="contractTypeName" label="合同类型" />
        <el-table-column prop="contractBeginDate" label="合同开始时间" />
        <el-table-column prop="contractEndDate" label="合同结束时间" />
        <el-table-column prop="contractuserName" label="合同乙方" />
        <el-table-column prop="buildingNums" label="楼号" />
        <el-table-column prop="operationKindsName" label="业态" />
        <el-table-column prop="estateNames" label="物业名称" />
        <el-table-column prop="fillpayTime" label="单据日期" />
        <el-table-column prop="payee" label="制单人" />
        <!-- <el-table-column prop="payer" label="付款人" /> -->
        <el-table-column prop="payPrice" label="应收金额" />
        <el-table-column prop="realPrice" label="实收金额" />
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feepay_edit"
              size="mini"
              type="text"
              @click="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feepay_del"
              size="mini"
              type="text"
              @click="operateData('look', scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="permissions.entity_feepay_del"
              size="mini"
              type="text"
              @click="operateData('del', scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 24px; display: flex; align-items: center; justify-content: flex-end">
        <pagination
          :total="total"
          :page.sync="listQuery.current"
          :limit.sync="listQuery.size"
          @pagination="handleFilter"
        />
      </div>
    </div>
    <div class="znp-table-container content-p24">
      <el-table :data="feeItemTableData" style="width: 100%" border size="small" align="center">
        <el-table-column prop="feepaydetailsCode" label="收款单据编码" width="200" />
        <el-table-column prop="feeItemName" label="收费项目" />
        <el-table-column prop="payTypeName" label="收费方式" />
        <el-table-column prop="payCycleName" label="收费周期" />
        <el-table-column prop="startDate" label="计费开始日期" />
        <el-table-column prop="endDate" label="计费结束日期" />
        <el-table-column prop="chargeTypeName" label="计费方式" />
        <el-table-column prop="count" label="数量">
          <template slot-scope="scope">
            <span>{{ parseInt(scope.row.payType) === 1 ? '--' : scope.row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="refPrice" label="收款金额/单价" />
        <el-table-column prop="payPrice" label="应收金额" />
        <el-table-column prop="realPrice" label="实收金额" />
        <el-table-column prop="createTime" label="建账时间" />
        <el-table-column prop="owePrice" label="欠款金额" />
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.flag === 'add'">
              <el-button
                v-if="permissions.entity_feepaydetails_add"
                size="mini"
                type="text"
                @click="openDialog('add', scope.row)"
              >
                添加
              </el-button>
            </div>
            <div v-else> -->
            <el-button
              v-if="permissions.entity_feepaydetails_registe"
              size="mini"
              type="text"
              @click="openDialog('registration', scope.row)"
            >
              收款登记
            </el-button>
            <el-button
              v-if="permissions.entity_feepaydetails_registe"
              size="mini"
              type="text"
              @click="queryPaymentDetails(scope.row)"
            >
              缴费明细
            </el-button>
            <!-- <el-button
              size="mini"
              type="text"
              v-if="permissions.entity_feepaydetails_registe"
              :disabled="parseInt(scope.row.feepayStatus) !== 2"
              @click="printReceipt(scope.row)"
            >
              补打收据
            </el-button> -->
            <el-button
              v-if="permissions.entity_feepaydetails_edit"
              size="mini"
              type="text"
              @click="openDialog('edit', scope.row)"
              :disabled="Number(scope.row.feepayStatus) !== 1"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feepaydetails_del"
              size="mini"
              type="text"
              @click="openDialog('del', scope.row)"
              :disabled="Number(scope.row.feepayStatus) !== 1"
            >
              删除
            </el-button>
            <!-- </div> -->
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 24px; display: flex; align-items: center; justify-content: flex-end">
        <pagination
          :total="totalOfDetail"
          :page.sync="listQueryOfDetail.current"
          :limit.sync="listQueryOfDetail.size"
          @pagination="handleFilterOfDetail"
        />
      </div>
    </div>
    <!-- 通过费用带入 -->
    <!-- <BringFeeItem :bring-dialog-vo="bringDialogVo" @setBringDialogVisiable="cancelDialog" /> -->
    <!-- 收款登记 -->
    <el-dialog
      :title="registrationDialog.title"
      :visible.sync="registrationDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog znp-crud-dialog-inner-table"
      width="600px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="应收金额">
              <el-input v-model="inputForm.payPrice" placeholder="单位（元）" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
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

          <el-col :span="24">
            <el-form-item label="付款人" prop="payee">
              <el-input v-model="inputForm.payee" placeholder="付款人" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="付款方式" prop="paymentMethod">
              <el-select
                v-model="inputForm.paymentMethod"
                placeholder="请选择付款方式"
                style="width: 100%"
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
          <el-col :span="24">
            <el-form-item label="收款人" prop="payer">
              <el-input v-model="inputForm.payer" placeholder="收款人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收款时间" prop="payTime">
              <el-date-picker
                v-model="inputForm.payTime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择收款时间"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="inputForm.remark" type="textarea" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <el-alert title="注意：每次收款登记都会在缴费明细中新增一条数据" type="warning" :closable="false"></el-alert> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="chargeRegistration">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加/编辑收费单明细 -->
    <AddFeePayDetail :dialog-vo="dialogVo" @cancelDialog="cancelDialog" />
    <!--收据 -->
    <PrintFeePayDetail :print-dialog-vo="printDialogVo" @cancelDialog="cancelDialog" />
    <!--收费明细 -->
    <PaymentDetails :payment-details-vo="paymentDetailsVo" @cancelDialog="cancelDialog" />
  </div>
</template>

<script>
import { fetchList, delObj as delFeePayObj } from '@/api/feePay'
import { fetchfeePayDetailList, chargeRegistration, delObj, queryPrintDetail } from '@/api/feepaydetails'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
import { remote } from '@/api/admin/dict'
import AddFeePayDetail from './components/addFeePayDetail'// 【添加或者编辑收费单明细】
import PrintFeePayDetail from '@/components/PrintFeePay'// 【收据】
import { getSelectKindsList } from '@/api/category'
import PaymentDetails from './components/paymentDetails'// 【查询收费明细】
import { getSelectBuildingList } from '@/api/building'
export default {
  name: 'FeePay',
  components: {
    pagination, AddFeePayDetail, PrintFeePayDetail, PaymentDetails
  },
  data() {
    return {
      printDialogVo: {
        title: '收据',
        visible: false,
        obj: {} // 要打印的数据
      },
      paymentDetailsVo: {
        title: '缴费明细',
        visible: false,
        feepaydetailsCode: ''
      },
      dialogVo: {
        title: '新增收费单明细',
        visible: false,
        operateType: 'add',
        vo: {
          feepayId: '', // 收费单id
          startDate: '',
          endDate: '',
          payType: '', // 计费方式
          unitPrice: '', // 收费金额/单价
          count: '' // 数量有效期终止日期
        } // 收费单明细信息
      }, // 添加或编辑收费明细弹框
      registrationDialog: {
        title: '收款登记',
        visible: false
      },
      inputForm: {
        feePayDetailCode: '', // 收款明细code
        feePayId: '', // 收费单id
        id: '', // 收费单明细id
        payPrice: '', // 应收金额
        realPrice: '', // 登记的实收金额
        payTime: '', // 收款时间必填
        payee: '', // 付款人
        payer: '', // 收款人
        paymentMethod: '', // 付款方式
        paymentMethodName: '', // 付款方式名称
        remark: ''// 备注
      },
      inputFormRules: {
        realPrice: [
          { required: true, message: '请输入实收金额', trigger: 'blur' }
        ],
        payee: [
          { required: true, message: '请输入付款人', trigger: 'change' }
        ],
        paymentMethod: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ],
        payer: [
          { required: true, message: '请输入收款人', trigger: 'change' }
        ],
        payTime: [
          { required: true, message: '请选择收款时间', trigger: 'change' }
        ]
      },
      bringDialogVo: {
        title: '参照费用单带入',
        visible: false,
        merchantId: '',
        feepayId: ''
      },
      formParams: {
        contractType: 1, // 合同类型
        operationTypesKindsId: '', // 业态id
        buildingNum: '', // 楼号
        estateName: '', // 物业名称
        contractCodeOrName: '', // 合同编码或者合同名称
        contractUserName: '', // 合同乙方编码或者名称
        feepayCode: '', // 单据编号
        startFillpayTime: '',
        endFillpayTime: ''
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      listQueryOfDetail: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      totalOfDetail: 0, // 总条数
      feeItemTableData: [], // 收费单明细
      selectOptions: {
        kindsList: [], // 业态
        paymentMethod: [], // 付款方式
        buildingList: []
      },
      operateType: 'add',
      multipleSelection: []
      /* baseObj: {
        flag: 'add' // 添加那行的标记
      } */
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo'])
  },
  watch: {
    multipleSelection: {
      handler(l) {
        if (l.length > 0) {
          this.handlerSearchOfDetail(1)
        } else {
          this.feeItemTableData = []
        }
      },
      immediate: true,
      // 对象内部的属性监听，深度监听
      deep: true
    },
    $route(to, from) {
      // 获取列表数据
      if (to.path === '/entity/feePay/index') {
        this.handlerSearch(1)
      }
    }
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 获取列表数据
    this.handlerSearch(1)
  },
  methods: {
    getSelectList() {
      // 付款方式
      remote('payment_method').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.paymentMethod = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 主营品类(level = 0 只查询第1级)
      getSelectKindsList('0').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.kindsList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 楼层 参数传0 代表只查询楼层
      getSelectBuildingList(0).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.buildingList = res.data.data
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
    // 下拉框选中
    selectRow(rows) {
      if (rows.length > 1) {
        var newRows = rows.filter((it, index) => {
          if (index === rows.length - 1) {
            this.$refs.multipleTable.toggleRowSelection(it, true)
            return true
          } else {
            this.$refs.multipleTable.toggleRowSelection(it, false)
            return false
          }
        })
        this.multipleSelection = newRows
      } else {
        this.multipleSelection = rows
      }
    },
    // 条件查询
    handlerSearch(page) {
      this.listQuery.current = page
      this.searchDataFun()
    },
    // 翻页
    handleFilter(page) {
      this.listQuery.current = page.page
      this.searchDataFun()
    },
    // 查询列表
    searchDataFun() {
      this.tableLoading = true
      const pageQueryVo = {
        current: this.listQuery.current, // 当前页
        size: this.listQuery.size, // 每页显示条数
        contractCodeOrName: this.formParams.contractCodeOrName || undefined,
        contractUserName: this.formParams.contractUserName || undefined,
        feepayCode: this.formParams.feepayCode || undefined,
        startFillpayTime: this.formParams.startFillpayTime || undefined,
        endFillpayTime: this.formParams.endFillpayTime || undefined,
        operationTypesKindsId: this.formParams.operationTypesKindsId || undefined,
        buildingNum: this.formParams.buildingNum || undefined,
        contractType: this.formParams.contractType || undefined,
        estateName: this.formParams.estateName || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          // 查询第一条数据的收费单详情
          this.multipleSelection = []
          if (this.tableData.length > 0) {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(this.tableData[0], true) // 勾选
              this.multipleSelection.push(this.tableData[0])
            })
          }
        } else {
          this.$message.error(res.data.msg)
        }
        this.tableLoading = false
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
    },
    // 查询明细
    getFeePayDetail() {
      const pageQueryVo = {
        current: this.listQueryOfDetail.current, // 当前页
        size: this.listQueryOfDetail.size, // 每页显示条数
        feePayId: this.multipleSelection.length > 0 ? this.multipleSelection[0].id : undefined
      }
      fetchfeePayDetailList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.feeItemTableData = res.data.data.records
          this.totalOfDetail = res.data.data.total
          /* this.feeItemTableData.push(this.baseObj) */
        } else {
          this.$message.error('查询收费单失败，请联系系统管理员')
        }
      })
    },
    handlerSearchOfDetail(page) {
      this.listQueryOfDetail.current = page
      this.getFeePayDetail()
    },
    handleFilterOfDetail(page) {
      this.listQueryOfDetail.current = page.page
      this.getFeePayDetail()
    },
    openDialog(type, item) {
      item.feePayId = this.multipleSelection[0].id
      if (type === 'add') {
        this.dialogVo = {
          title: '新增收费明细',
          visible: true,
          operateType: 'add',
          vo: item
        }
      } else if (type === 'edit') {
        this.dialogVo = {
          title: '修改收费明细',
          visible: true,
          operateType: 'edit',
          vo: item
        }
      } else if (type === 'del') {
        // 删除收费明细
        this.$confirm('删除后将不能恢复，是否要删除当前记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              if (this.multipleSelection.length > 0) {
                this.handlerSearchOfDetail(1)
              }
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        // 打开收款登记窗口的
        this.registrationDialog.visible = true
        this.$nextTick(() => {
          this.$refs['inputFormRef'].clearValidate()
        })
        this.inputForm = {
          feePayDetailCode: item.feepaydetailsCode,
          id: item.id, // 收费单明细id
          payPrice: item.payPrice, // 应收金额
          // realPrice: item.realPrice, // 登记的实收金额
          // payTime: item.payTime,
          payee: item.payee || this.multipleSelection[0].contractuserName, // 付款人默认为合同乙方
          payer: item.payer || this.userInfo.trueName, // 收款人人默认为当前用户的真实姓名
          // paymentMethod: item.paymentMethod ? item.paymentMethod + '' : '', // 付款方式
          // paymentMethodName: item.paymentMethodName, // 付款方式名称
          remark: item.remark// 备注
        }
      }
    },
    // 收款登记
    chargeRegistration() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          this.inputForm.feePayId = this.multipleSelection[0].id
          chargeRegistration(this.inputForm).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('登记成功')
              this.cancelDialog()
              this.printReceipt({ feePayDetailCode: this.inputForm.feePayDetailCode, payTime: this.inputForm.payTime, amount: this.inputForm.realPrice })
            } else {
              this.$message.error('登记失败,请联系系统管理员')
            }
          })
        } else {
          return false
        }
      })
    },
    // 子组件控制弹框展示或者隐藏
    cancelDialog() {
      this.paymentDetailsVo.visible = false
      this.dialogVo.visible = false
      this.printDialogVo.visible = false
      this.registrationDialog.visible = false
      if (this.multipleSelection.length > 0) {
        this.handlerSearchOfDetail(1)
      }
    },
    // 新增/编辑/查看 打开页面
    operateData(type, item) {
      if (type === 'del') {
        // 删除合同收费
        this.$confirm('删除后将不能恢复，是否要删除当前记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delFeePayObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.handlerSearch(1)
              this.$message.success(res.data.msg)
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        this.$router.push({
          path: '/feePay/detail',
          query: {
            operateType: type,
            id: (type === 'edit' || type === 'look') ? item.id : undefined
          }
        })
      }
    },
    // 打印收据
    printReceipt(item) {
      queryPrintDetail(item).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.printDialogVo.obj = res.data.data
          this.printDialogVo.visible = true
        } else {
          this.$message.error('查询打印信息失败,失败原因' + res.data.msg)
        }
      })
    },
    // 分配管理员
    distribAdmin() {
      this.$router.push({
        path: '/entity/feePayDistrib/index'
      })
    },
    // 查询缴费明细
    queryPaymentDetails(item) {
      this.paymentDetailsVo.visible = true
      this.paymentDetailsVo.feepaydetailsCode = item.feepaydetailsCode
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.fee-pay {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 5px !important;
    }
  }
  // 将全选项隐藏
  ::v-deep .more_btn thead .el-table-column--selection .cell {
    display: none;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
  ::v-deep .el-checkbox__inner {
    width: 17px;
    height: 17px;
    border-radius: 14px;
  }
  ::v-deep .el-checkbox__inner::after {
    height: 9px;
    left: 5px;
    top: 1px;
    width: 4px;
  }
}
</style>
