<template>
  <div class="rent-contract">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="rentContractCodeOrName">
          <el-input v-model="formParams.rentContractCodeOrName" placeholder="合同编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="merchantCodeOrName">
          <el-input v-model="formParams.merchantCodeOrName" placeholder="商户编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="estateCodeOrName">
          <el-input v-model="formParams.estateCodeOrName" placeholder="物业编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="rentContractState">
          <el-select v-model="formParams.rentContractState" placeholder="合同状态" filterable clearable>
            <el-option
              v-for="item in selectOptions.contractStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="startDate">
          <el-date-picker v-model="formParams.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" />
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker v-model="formParams.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_rentcontract_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
        <excelupload type="rentcontract" />
      </div>
      <el-table ref="filterTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="contractCode" label="合同编码" width="180" />
        <el-table-column prop="contractName" label="合同名称" />
        <el-table-column prop="contractStatusName" label="合同状态" />
        <el-table-column prop="merchantName" label="商户名称" />
        <el-table-column prop="estateNames" label="物业名称" />
        <el-table-column prop="startDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feepay_add"
              type="text"
              size="mini"
              @click="operateData('rerent', scope.row)"
              :disabled="parseInt(scope.row.canRenewal) === 0"
            >
              续租
              <!-- canRenewal 是否可以续租（1：是 0：否） -->
            </el-button>
            <el-button
              v-if="permissions.entity_feepay_add"
              size="mini"
              type="text"
              @click="operateData('addorlook', scope.row)"
            >
              {{ scope.row.feePayId ? '修改收费' : '新增收费' }}
            </el-button>
            <el-button
              v-if="permissions.entity_rentcontract_edit"
              size="mini"
              type="text"
              @click="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_rentcontract_view"
              type="text"
              size="mini"
              @click="operateData('look', scope.row)"
            >
              查看
            </el-button>
            <!-- <el-button
              v-if="permissions.entity_feeform_add"
              size="mini"
              type="text"
              @click="quickChargeItems(scope.row)"
            >
              生成收费模板
            </el-button>
            <el-button size="mini" type="text" @click="createFeeBill(scope.row)">生成费用账单</el-button> -->
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
  </div>
</template>

<script>
import { fetchList } from '@/api/rent-contract'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
import excelupload from '@/components/UploadExcel' // 文件导入和模板下载
import { billeCheck, createFeeBill } from '@/api/feeform'
import { genFeeForm } from '@/api/rentform'
export default {
  name: 'RentContract',
  components: {
    pagination, excelupload
  },
  data() {
    return {
      // eslint-disable-next-line no-undef
      downloadUrl: process.env.VUE_APP_ENTITY_API + '/entity/rentcontract/dowlodTemplate',
      dialog: {
        title: '状态变更',
        visible: false
      },
      formParams: {
        rentContractCodeOrName: '', // 租赁合同编码或名称
        merchantCodeOrName: '', // 业主编码或名称
        estateCodeOrName: '', // 物业编码/名称
        rentContractState: '', // 合同状态
        startDate: '', // 开始日期
        endDate: '' // 结束日期
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
      if (to.path === '/entity/rentContract/index') {
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
        rentContractCodeOrName: this.formParams.rentContractCodeOrName || undefined,
        merchantCodeOrName: this.formParams.merchantCodeOrName || undefined,
        estateCodeOrName: this.formParams.estateCodeOrName || undefined,
        rentContractState: this.formParams.rentContractState || undefined,
        startDate: this.formParams.startDate || undefined,
        endDate: this.formParams.endDate || undefined
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
      if (type === 'addorlook') {
        let operateType = 'add'
        if (item.feePayId) {
          operateType = 'edit'
        }
        // 判断合同是否到期 如果到期不允许新增合约收费
        if (operateType === 'add' && parseInt(item.contractStatus) !== 1 && parseInt(item.contractStatus) !== 3) {
          this.$message.warning('只有生效中的合同允许新增合约收费')
          return
        }
        this.$router.push({
          path: '/feePay/detail',
          query: {
            operateType,
            id: operateType === 'edit' ? item.feePayId : undefined,
            contractId: operateType === 'add' ? item.id : undefined,
            contractType: 1
          }
        })
      } else {
        this.$router.push({
          path: '/rentContract/detail',
          query: {
            operateType: type,
            id: (type === 'edit' || type === 'look' || type === 'rerent') ? item.id : undefined
          }
        })
      }
    },
    // 快速生成收费项按钮
    quickChargeItems(item) {
      if (!item.existFeeForm) {
        this.$alert('当前物业的计费项没有维护数据，请联系运营人员或手动添加收费项。', '提示', {
          confirmButtonText: '我知道了'
        })
      } else {
        this.$confirm('会依据不同的物业类型生成收费项目，是否执行此操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 快速生成收费项目 传当前出租合同登记单id
          genFeeForm({
            rentContractId: item.id,
            rentContractCode: item.contractCode,
            estateId: item.estateId,
            estateName: item.estateName,
            merchantId: item.merchantId,
            merchantName: item.merchantName,
            startDate: item.startDate,
            endDate: item.endDate
          }).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('快速生成收费项目成功')
              this.handlerSearch(1)
            } else {
              this.$message.error('快速生成收费项目失败,请联系系统管理员')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    // 生成费用账单
    createFeeBill(item) {
      // 若后台未生成过账单
      billeCheck({
        merchantId: item.merchantId,
        rentcontractId: item.id
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          // 若后台已生成过账单【res.data.data】返回true
          if (res.data.data) {
            this.$confirm('费用账单已由后台自动生成，请前往费用账单功能中查看。', '提示', {
              confirmButtonText: '前往',
              cancelButtonText: '留在当前页',
              type: 'warning'
            }).then(() => {
              this.$router.push({ path: '/entity/feeBill/index' })
            }).catch(() => {
              this.handlerSearch(1)
            })
          } else {
            // 若后台未生成过账单【res.data.data】返回false
            this.$confirm('该操作会根据收费项生成第一期的费用账单，是否执行此操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              createFeeBill({
                merchantId: item.merchantId,
                rentcontractId: item.id
              }).then(res => {
                if (res && parseInt(res.data.code) === 0) {
                  this.$message.success('操作成功')
                  this.handlerSearch(1)
                } else {
                  this.$message.error('操作失败')
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          }
        } else {
          this.$message.error('操作失败,请联系系统管理员')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.rent-contract {
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
