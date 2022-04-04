<template>
  <div class="lease znp-report">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" label-width="80px" :inline="true" :model="formParams">
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
          <el-form-item label="所有权:" prop="f4">
            <el-select v-model="formParams.f4" placeholder="全部" filterable clearable>
              <el-option
                v-for="item in selectOptions.ownerShipType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="使用状态:" prop="f5">
            <el-select v-model="formParams.f5" placeholder="全部" filterable clearable>
              <el-option
                v-for="item in selectOptions.useStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="物业:" prop="f6">
            <el-input v-model="formParams.f6" placeholder="请输入名称/编码" clearable />
          </el-form-item>
          <el-form-item label="商户:" prop="f7">
            <el-input v-model="formParams.f7" placeholder="请输入名称/编码" clearable />
          </el-form-item>
          <el-form-item label="出租单:" prop="f8">
            <el-input v-model="formParams.f9" placeholder="请输入名称/编码" clearable />
          </el-form-item>
          <!-- <el-form-item label="出租日期" prop="codName">
            <el-date-picker
              v-model="formParams.value1"
              type="date"
              placeholder="开始日期"
              style="width:174px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="-" prop="codName">
            <el-date-picker
              v-model="formParams.value1"
              type="date"
              placeholder="结束日期"
              style="width:174px"
            >
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="出租日期:" prop="f10">
            <el-date-picker
              v-model="formParams.f10"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 264px"
            />
          </el-form-item>
          <el-form-item label="占位" class="formBtn" label-width="241px">
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
        <el-table-column prop="f2" label="物业编码" align="center" />
        <el-table-column prop="f3" label="物业名称" width="100" align="center" />
        <el-table-column prop="f4" label="区域" align="center" />
        <el-table-column prop="f5" label="物业类型" align="center" />
        <el-table-column prop="f6" label="所有权" align="center" />
        <el-table-column prop="f7" label="使用状态" align="center" />
        <el-table-column prop="f8" label="租金" align="center" />
        <el-table-column prop="f9" label="建筑面积" align="center" />
        <el-table-column prop="f10" label="可用面积" align="center" />
        <el-table-column prop="f11" label="出租单号" align="center" />
        <el-table-column prop="f12" label="商户" align="center" />
        <el-table-column prop="f13" label="联系人" align="center" />
        <el-table-column prop="f14" label="起始日期" align="center" />
        <el-table-column prop="f15" label="结束日期" align="center" />
        <el-table-column label="是否到期" width="90px">
          <template slot-scope="scope">
            <span v-if="scope.row.formStatusLabel === '未到期'">{{ scope.row.formStatusLabel }}</span>
            <span v-else style="color: red">{{ scope.row.formStatusLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractCode" label="合同编号" align="center" />
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
  name: 'LeasePage',
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
        f9: '', // 名称
        f10: '' // 名称
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
          'f11': '10012313',
          'f12': '中农批',
          'f13': 'cathy',
          'f14': '20210101',
          'f15': '20211230',
          'f16': '否',
          'f17': '13123'
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
.lease {
  ::v-deep .el-date-editor .el-range-separator {
    padding: 0px !important;
  }
}
</style>
