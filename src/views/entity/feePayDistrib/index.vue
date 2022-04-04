<template>
  <div class="fee-pay">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
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
        <el-form-item label="" prop="contractCodeOrName">
          <el-input v-model="formParams.contractCodeOrName" placeholder="合同编码或名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="contractUserName">
          <el-input v-model="formParams.contractUserName" placeholder="合同乙方名称" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button type="primary" size="mini" @click="distribAdmin">分配任务</el-button>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="tableLoading"
        :data="tableData"
        class="more_btn"
        style="width: 100%"
        border
        size="small"
        :row-key="getKeys"
        @selection-change="handleSelectChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="contractCode" label="合同编码" />
        <el-table-column prop="contractName" label="合同名称" />
        <el-table-column prop="contractBeginDate" label="合同开始时间" />
        <el-table-column prop="contractEndDate" label="合同结束时间" />
        <el-table-column prop="contractuserName" label="合同乙方" />
        <el-table-column prop="buildingNums" label="楼号" />
        <el-table-column prop="operationKindsName" label="业态" />
        <el-table-column prop="estateNames" label="物业名称" />
        <el-table-column prop="payee" label="制单人" />
        <!-- <el-table-column prop="payer" label="付款人" /> -->
        <el-table-column prop="payPrice" label="应收金额" />
        <el-table-column prop="realPrice" label="实收金额" />
        <el-table-column prop="assignUsername" label="任务人" />
        <el-table-column prop="assignDate" label="分配日期" />
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
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog znp-crud-dialog-inner-table"
      width="800px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="所选合约收费单" prop="userId">
              <el-table
                :data="multipleSelection"
                class="more_btn"
                style="width: 100%; margin-bottom: 20px"
                border
                size="mini"
              >
                <el-table-column prop="contractName" label="合同名称" />
                <el-table-column prop="contractBeginDate" label="合同开始时间" />
                <el-table-column prop="contractEndDate" label="合同结束时间" />
                <el-table-column prop="contractuserName" label="合同乙方" />
                <el-table-column prop="buildingNum" label="楼号" />
                <el-table-column prop="operationKindsName" label="业态" />
                <el-table-column prop="payPrice" label="应收金额" />
                <el-table-column prop="realPrice" label="实收金额" />
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="管理员" prop="userId">
              <el-select v-model="inputForm.userId" filterable placeholder="请指派管理员" style="width: 100%">
                <el-option
                  v-for="item in selectOptions.userList"
                  :key="item.userId"
                  :label="item.username"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="inputForm.remark" placeholder="" type="textarea" maxlength="300" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="_distrib">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryListByEstate, feePayAssignUser } from '@/api/feePay'
import { getAllUser } from '@/api/admin/user'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
import { remote } from '@/api/admin/dict'
import { getSelectKindsList } from '@/api/category'
import { getSelectBuildingList } from '@/api/building'
export default {
  name: 'FeePayDistrib',
  components: {
    pagination
  },
  data() {
    return {
      inputForm: {
        remark: '',
        userId: ''
      },
      inputFormRules: {
        userId: [
          { required: true, message: '请指派管理员', trigger: 'change' }
        ]
      },
      dialog: {
        title: '设置管理员',
        visible: false
      }, // 分配管理员
      formParams: {
        contractCodeOrName: '', // 合同编码或者合同名称
        contractUserName: '', // 合同乙方编码或者名称
        operationTypesKindsId: '', // 业态id
        buildingNum: '', // 楼号
        estateName: ''// 物业名称
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        buildingList: [],
        kindsList: [], // 业态
        userList: [],
        paymentMethod: [] // 付款方式
      },
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo'])
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 获取列表数据
    this.handlerSearch(1)
  },
  methods: {
    getSelectList() {
      // 楼层 参数传0 代表只查询楼层
      getSelectBuildingList(0).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.buildingList = res.data.data
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
      getAllUser().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.userList = res.data.data
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
        operationTypesKindsId: this.formParams.operationTypesKindsId || undefined,
        buildingNum: this.formParams.buildingNum || undefined,
        estateName: this.formParams.estateName || undefined
      }
      queryListByEstate(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          // 查询第一条数据的收费单详情
          if (this.multipleSelection.length !== 0) {
            this.$nextTick(() => {
              this.tableData.forEach(item => {
                if (this.multipleSelection.findIndex(res => res.id === item.id) !== -1) {
                  this.$refs.multipleTable.toggleRowSelection(item, true)
                }
              })
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
    getKeys(row) {
      return row.id
    },
    del(row) {
      this.multipleSelection.splice(this.multipleSelection.findIndex(o => o.id === row.id), 1)
    },
    // 一个一个的选择或者全选
    handleSelectChange(selection) {
      this.multipleSelection = selection
    },
    // 分配管理员 打开弹框显示input框
    distribAdmin() {
      if (this.multipleSelection.length > 0) {
        this.dialog.visible = true
      } else {
        this.$message.warning('请选择合约收费单据')
      }
    },
    cancelDialog() {
      this.dialog.visible = false
      this.$refs.multipleTable.clearSelection()
      this.handlerSearch(1)
    },
    // 确定指派
    _distrib() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          const user = this.selectOptions.userList.find(o => o.userId === this.inputForm.userId)
          const paramData = {
            'feePayIds': this.multipleSelection.map((item) => { return item.id }),
            'realName': user.trueName,
            'remark': this.inputForm.remark,
            'userId': this.inputForm.userId
          }
          feePayAssignUser(paramData).then(res => {
            if (res.data.code === 0) {
              this.cancelDialog()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          return false
        }
      })
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
  ::v-deep .znp-crud-dialog-inner-table .el-dialog__body {
    padding: 0px 80px 5px 50px;
  }
}
</style>
