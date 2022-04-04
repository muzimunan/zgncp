<template>
  <div class="fee znp-report">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" label-width="95px" :inline="true" :model="formParams">
        <el-row>
          <el-form-item label="市场:" prop="f1">
            <el-select v-model="formParams.f1" placeholder="全部" filterable clearable />
          </el-form-item>
          <el-form-item label="区域:" prop="f2">
            <el-select v-model="formParams.f2" placeholder="全部" filterable clearable />
          </el-form-item>
          <el-form-item label="物业类型:" prop="f3">
            <el-select v-model="formParams.f3" placeholder="全部" filterable clearable />
          </el-form-item>
          <el-form-item label="科目分类:" prop="f4">
            <el-select v-model="formParams.level" placeholder="全部" filterable clearable />
          </el-form-item>
          <el-form-item label="科目名称:" prop="f5">
            <el-input v-model="formParams.f5" placeholder="请输入名称/编码" clearable />
          </el-form-item>
          <el-form-item label="商户:" prop="f6">
            <el-input v-model="formParams.f6" placeholder="请输入名称/编码" clearable />
          </el-form-item>
          <el-form-item label="物业:" prop="f7">
            <el-input v-model="formParams.f7" placeholder="请输入名称/编码" clearable />
          </el-form-item>
          <el-form-item label="单号:" prop="f8">
            <el-input v-model="formParams.f8" placeholder="收费/退费单号" clearable />
          </el-form-item>
          <el-form-item label="收/退费日期:" prop="f9">
            <el-date-picker
              v-model="formParams.f9"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 280px"
            />
          </el-form-item>

          <el-form-item label="占位" class="formBtn" label-width="255px">
            <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
            <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
            <el-button type="success" size="small">导出</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <el-table
        ref="filterTable"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
        border
        header-cell-class-name="table-header-style"
        cell-class-name="table-tbody-style"
        size="small"
      >
        <el-table-column prop="f1" label="市场名称" align="center" />
        <el-table-column prop="f2" label="收/退费单号" width="100px" align="center" />
        <el-table-column prop="f3" label="物业编码" align="center" />
        <el-table-column prop="f4" label="物业名称" width="100" align="center" />
        <el-table-column prop="f5" label="商户名称" align="center" />
        <el-table-column prop="f6" label="联系人" align="center" />
        <el-table-column prop="f7" label="单据日期" align="center" />
        <el-table-column prop="f8" label="账单开始日期" width="100px" align="center" />
        <el-table-column prop="f9" label="账单结束日期" width="100px" align="center" />
        <el-table-column prop="f10" label="科目分类" align="center" />
        <el-table-column prop="f11" label="科目名称" align="center" />
        <el-table-column prop="f12" label="应收金额" align="center" />
        <el-table-column prop="f13" label="实收金额" align="center" />
        <el-table-column prop="f14" label="状态" align="center" />
      </el-table>
      <div style="margin-top: 24px; display: flex; align-items: center; justify-content: flex-end">
        <pagination
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.size"
          :page-sizes="pageSizes"
          @pagination="handleFilter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/area'
import pagination from '@/components/Pagination' // 分页
export default {
  name: 'FeePage',
  components: {
    pagination
  },
  data() {
    return {
      formParams: {
        f1: '', // 名称
        f2: '', // 名称
        f3: '', // 名称
        f4: '', // 名称
        f5: '', // 名称
        f6: '', // 名称
        f7: '', // 名称
        f8: '', // 名称
        f9: '' // 名称
      },
      pageSizes: [50, 100, 200],
      listQuery: {
        size: 50, // 每页显示多少条
        page: 1 // 当前页数
      },
      total: 10, // 总条数
      tableLoading: true, // loading
      tableData: [
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        },
        {
          'f1': '中农批',
          'f2': 'TF00001',
          'f3': 'WY0001',
          'f4': '中农天鸿物业',
          'f5': '中农批',
          'f6': 'cathy',
          'f7': '20210922',
          'f8': '20210922',
          'f9': '20220923',
          'f10': '水果',
          'f11': '苹果',
          'f12': '1000',
          'f13': '999',
          'f14': '招商'
        }

      ],
      selectOptions: {
        levelType: []
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
      console.log('获取下拉框数据')
      // 级别
      // 省市区
    },
    // 条件查询
    handlerSearch(page) {
      this.listQuery.page = page
      this.searchDataFun()
    },
    // 翻页
    handleFilter(page) {
      this.listQuery.page = page.page
      this.searchDataFun()
    },
    // 查询列表
    searchDataFun() {
      this.tableLoading = true
      const pageQueryVo = {
        page: this.listQuery.page, // 当前页
        size: this.listQuery.size, // 每页显示条数
        codeName: this.formParams.codeName,
        level: this.formParams.level
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.code) === 1) {
          this.tableData = res.data.data
          this.total = res.data.total
        } else {
          this.$message.error(res.data.msgg)
        }
        this.tableLoading = false
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      console.log(formName)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.fee {
  ::v-deep .el-date-editor .el-range-separator {
    padding: 0px !important;
  }
}
</style>
