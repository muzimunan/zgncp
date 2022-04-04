<template>
  <div class="estate znp-report">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" label-width="80px" :inline="true" :model="formParams">
        <el-form-item label="市场:" prop="f1">
          <el-select v-model="formParams.f1" placeholder="全部" filterable clearable />
        </el-form-item>
        <el-form-item label="区域:" prop="f2">
          <el-select v-model="formParams.f2" placeholder="全部" filterable clearable />
        </el-form-item>
        <el-form-item label="物业类型:" prop="f3">
          <el-select v-model="formParams.f3" placeholder="全部" filterable clearable />
        </el-form-item>
        <el-form-item label="是否可售:" prop="f4">
          <el-select v-model="formParams.f4" placeholder="全部" filterable clearable />
        </el-form-item>
        <el-form-item label="所有权:" prop="f5">
          <el-select v-model="formParams.f5" placeholder="全部" filterable clearable>
            <el-option
              v-for="item in selectOptions.ownerShipType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态:" prop="f6">
          <el-select v-model="formParams.f6" placeholder="全部" filterable clearable>
            <el-option
              v-for="item in selectOptions.useStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物业档案:" prop="f7">
          <el-input v-model="formParams.f7" placeholder="请输入名称/编码" clearable />
        </el-form-item>

        <el-form-item label="占位" class="formBtn" label-width="66px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
          <el-button type="success" size="small">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <el-table ref="filterTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="f1" label="市场名称" align="center" />
        <el-table-column prop="f2" label="物业编码" align="center" />
        <el-table-column prop="f3" label="物业名称" align="center" />
        <el-table-column prop="f4" label="区域" align="center" />
        <el-table-column prop="f5" label="物业类型" align="center" />
        <el-table-column prop="f6" label="所有权" align="center" />
        <el-table-column prop="f7" label="使用状态" align="center" />
        <el-table-column prop="f8" label="是否可售" align="center" />
        <el-table-column prop="f9" label="建筑面积" align="center" />
        <el-table-column prop="f10" label="可用面积" align="center" />
        <el-table-column prop="f11" label="参考租金" align="center" />
        <el-table-column prop="f12" label="参考售价" align="center" />
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
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
export default {
  name: 'EstateReport',
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
        f7: '' // 名称
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
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        },
        {
          'f1': '中农批',
          'f2': 'WY0001',
          'f3': '中农天鸿物业',
          'f4': '水果区域',
          'f5': '自有',
          'f6': '自持',
          'f7': '出租',
          'f8': '是',
          'f9': '100',
          'f10': '99',
          'f11': '100',
          'f12': '200'
        }
      ],
      selectOptions: {
        ownerShipType: [], // 所有权
        useStatus: []// 使用状态
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
      // 所有权
      remote('owner_ship_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.ownerShipType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 使用状态
      remote('use_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.useStatus = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
</style>
