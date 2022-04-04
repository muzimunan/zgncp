<template>
  <div class="investor">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="investorCodeOrName">
          <el-input v-model="formParams.investorCodeOrName" placeholder="业主编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="investorType">
          <el-select v-model="formParams.investorType" placeholder="业主类型" clearable>
            <el-option
              v-for="item in selectOptions.investorType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="saleType">
          <el-select v-model="formParams.saleType" placeholder="经营类型" clearable>
            <el-option
              v-for="item in selectOptions.saleType"
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
        <el-button v-if="permissions.entity_investor_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
        <excelupload type="investor" />
      </div>
      <el-table v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="investorCode" label="业主编码" />
        <el-table-column prop="investorName" label="业主名称" />
        <el-table-column prop="typeLabel" label="业主类型" />
        <el-table-column prop="saletypeLabel" label="经营分类" />
        <el-table-column prop="contactName" label="联系人" />
        <el-table-column prop="contactPhone" label="联系电话" />
        <el-table-column prop="address" label="注册地址" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_investor_updateStatus"
              size="mini"
              type="text"
              @click.stop="changeStatus(scope.row)"
            >
              状态变更
            </el-button>
            <el-button
              v-if="permissions.entity_investor_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_investor_view"
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
  </div>
</template>

<script>
import { fetchList } from '@/api/investor'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import excelupload from '@/components/UploadExcel' // 文件导入和模板下载
import { mapGetters } from 'vuex'
export default {
  name: 'InvestorPage',
  components: {
    pagination, excelupload
  },
  data() {
    return {
      dialog: {
        title: '状态变更',
        visible: false
      },
      formParams: {
        investorType: '', // 业主类型
        investorCodeOrName: '', // 业主编码/名称
        saleType: ''// 经营类型
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        investorType: [], // 业主类型
        saleType: [] // 经营类型
      },
      operateType: 'add'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    $route(to, from) {
      // 获取列表数据
      if (to.path === '/entity/investor/index') {
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
      // 业主类型
      remote('investor_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.investorType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 经营类型
      remote('sale_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.saleType = res.data.data
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
        investorCodeOrName: this.formParams.investorCodeOrName || undefined,
        investorType: this.formParams.investorType || undefined,
        saleType: this.formParams.saleType || undefined
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
      this.$router.push({
        path: '/investor/detail',
        query: {
          operateType: type,
          id: (type === 'edit' || type === 'look') ? item.id : undefined
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.investor {
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
