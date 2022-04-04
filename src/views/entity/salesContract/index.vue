<template>
  <div class="sale-contract">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="salesContractCodeOrName">
          <el-input v-model="formParams.salesContractCodeOrName" placeholder="合同编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="investorCodeOrName">
          <el-input v-model="formParams.investorCodeOrName" placeholder="业主编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="estateCodeOrName">
          <el-input v-model="formParams.estateCodeOrName" placeholder="物业编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="salesContractState">
          <el-select v-model="formParams.salesContractState" placeholder="合同状态" filterable clearable>
            <el-option
              v-for="item in selectOptions.contractStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_salescontract_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
        <excelupload type="salescontract" />
      </div>
      <el-table ref="filterTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="contractCode" label="合同编码" width="180" />
        <el-table-column prop="contractName" label="合同名称" />
        <el-table-column prop="contractStatusName" label="合同状态" />
        <el-table-column prop="investorName" label="业主名称" />
        <el-table-column prop="estateCodename" label="物业名称" />
        <el-table-column prop="startDate" label="签订日期" />
        <!-- <el-table-column prop="endDate" label="结束日期" /> -->
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feepay_add"
              size="mini"
              type="text"
              @click="operateData('addorlook', scope.row)"
            >
              {{ scope.row.feePayId ? '查看收费' : '新增收费' }}
            </el-button>
            <el-button
              v-if="permissions.entity_feepaydetailsale_add"
              size="mini"
              type="text"
              @click.stop="operateData('collection', scope.row)"
            >
              销售回款
            </el-button>
            <el-button
              v-if="permissions.entity_salescontract_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_salescontract_view"
              type="text"
              size="mini"
              @click.stop="operateData('look', scope.row)"
            >
              查看
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
    <SalesCollectionDialog :sales-collection-dialog="salesCollectionDialog" @cancelDialog="cancelDialog" />
  </div>
</template>

<script>
import { fetchList } from '@/api/sales-contract'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import excelupload from '@/components/UploadExcel' // 文件导入和模板下载
import { mapGetters } from 'vuex'
import SalesCollectionDialog from './components/salesCollectionDialog'// 【销售回款】
export default {
  name: 'SalesContract',
  components: {
    pagination, excelupload, SalesCollectionDialog
  },
  data() {
    return {
      salesCollectionDialog: {
        title: '销售回款登记',
        visible: false,
        vo: {}
      },
      dialog: {
        title: '状态变更',
        visible: false
      },
      formParams: {
        salesContractCodeOrName: '', // 销售合同编码或名称
        investorCodeOrName: '', // 业主编码或名称
        estateCodeOrName: '', // 物业编码/名称
        salesContractState: '' // 合同状态
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        contractStatus: [] // 合同状态
      },
      operateType: 'add',
      inputForm: {
        owner: '',
        status: '',
        updateReason: '',
        id: ''
      },
      inputFormRules: {
        owner: [
          { required: true, message: '请选择所有权', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择使用状态', trigger: 'change' }
        ],
        updateReason: [
          { required: true, message: '请输入变更原因', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    detailDisable() {
      return this.operateType === 'look'
    },
    editDisable() {
      return this.operateType === 'edit'
    }
  },
  watch: {
    $route(to, from) {
      // 获取列表数据
      if (to.path === '/entity/salesContract/index') {
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
      // 合同状态
      remote('contract_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.contractStatus = res.data.data
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
        salesContractCodeOrName: this.formParams.salesContractCodeOrName || undefined,
        investorCodeOrName: this.formParams.investorCodeOrName || undefined,
        estateCodeOrName: this.formParams.estateCodeOrName || undefined,
        salesContractState: this.formParams.salesContractState || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          const dataList = res.data.data.records
          this.tableData = dataList
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.msg)
        }
        this.tableLoading = false
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.handlerSearch(1)
    },
    // 新增/编辑/查看 打开页面
    operateData(type, item) {
      if (type === 'collection') {
        this.salesCollectionDialog.visible = true
        this.salesCollectionDialog.vo = item
      } else if (type === 'addorlook') {
        let operateType = 'add'
        if (item.feePayId) {
          operateType = 'look'
        }
        // 判断合同是否到期 如果到期不允许新增合约收费
        if (operateType === 'add' && parseInt(item.contractStatus) !== 1) {
          this.$message.warning('只有生效中的合同允许新增合约收费')
          return
        }
        this.$router.push({
          path: '/feePay/detail',
          query: {
            operateType,
            id: operateType === 'look' ? item.feePayId : undefined,
            contractId: operateType === 'add' ? item.id : undefined,
            contractType: 2
          }
        })
      } else {
        this.$router.push({
          path: '/salesContract/detail',
          query: {
            operateType: type,
            id: (type === 'edit' || type === 'look') ? item.id : undefined
          }
        })
      }
    },
    cancelDialog() {
      this.salesCollectionDialog.visible = false // 楼层
      this.handlerSearch(1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.sale-contract {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 5px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
}
</style>
