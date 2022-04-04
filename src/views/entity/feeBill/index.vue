<template>
  <div class="feebill">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="merchantName">
          <el-input v-model="formParams.merchantName" placeholder="请输入商户名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="feebillStatus">
          <el-select v-model="formParams.feebillStatus" placeholder="请选择账单状态" clearable>
            <el-option
              v-for="item in selectOptions.feebillStatusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="startGenerateTime">
          <el-date-picker
            v-model="formParams.startGenerateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="生成日期(起)"
          />
        </el-form-item>
        <el-form-item prop="endGenerateTime">
          <el-date-picker
            v-model="formParams.endGenerateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="生成日期(止)"
          />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_feebill_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table
        ref="DataTable"
        v-loading="tableLoading"
        :data="tableData"
        row-key="id"
        style="width: 100%"
        border
        size="small"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="feebillCode" label="账单编码" />
        <el-table-column prop="feeformName" label="收费项目名称" />
        <el-table-column prop="merchantName" label="商户名称" />
        <el-table-column prop="generateTime" label="生成日期" />
        <el-table-column prop="feebillStatusName" label="账单状态" />
        <el-table-column prop="startDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feebill_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feebill_invalid"
              size="mini"
              type="text"
              @click.stop="operateData('invalid', scope.row)"
            >
              失效
            </el-button>
            <el-button
              v-if="permissions.entity_feebill_view"
              size="mini"
              type="text"
              @click.stop="operateData('view', scope.row)"
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
import { fetchDataByPage, deactiveFeebill, checkStateFailure } from '@/api/feeBill'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'FeeBill',
  components: {
    pagination
  },
  data() {
    return {
      formParams: {
        merchantName: '', // 商户名称
        feebillStatus: null, // 账单状态
        startGenerateTime: '',
        endGenerateTime: ''
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        feebillStatusList: [] // 账单状态下拉列表
      },
      operateType: 'add'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
  },
  created() {
    // 获取列表数据
    this.fetchData()

    // 获取账单状态下拉列表
    this.fetchFeebillStatusList()
  },
  methods: {
    // 条件查询
    handlerSearch(page) {
      this.listQuery.current = page
      this.fetchData()
    },
    // 翻页
    handleFilter(page) {
      this.listQuery.current = page.page
      this.fetchData()
    },
    // 查询列表
    fetchData() {
      this.tableLoading = true
      const pageQueryParams = {
        merchantName: this.formParams.merchantName || undefined,
        feebillStatus: this.formParams.feebillStatus || undefined,
        startGenerateTime: this.formParams.startGenerateTime || undefined,
        endGenerateTime: this.formParams.endGenerateTime || undefined,
        current: this.listQuery.current || undefined,
        size: this.listQuery.size || undefined
      }
      fetchDataByPage(pageQueryParams).then(res => {
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
    fetchFeebillStatusList() {
      remote('feebill_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          if (res.data.data.length > 0) {
            const dataList = res.data.data
            dataList.map((item, index) => {
              this.selectOptions.feebillStatusList.push({
                value: parseInt(item.value),
                name: item.label
              })
            })
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.fetchData()
    },
    // 失效打开提示, 编辑/查看打开页面
    operateData(type, item) {
      if (type === 'invalid') {
        // 若后台未生成过账单
        checkStateFailure({
          id: item.id
        }).then(res => {
          if (res && parseInt(res.data.code) === 0) {
            // 与收费单、退费单关联时【res.data.data】返回true
            if (res.data.data) {
              // 已与收费单或者退费单关联, 无法执行此操作
              this.$alert('已与收费单或者退费单关联, 无法执行此操作', '提示', {
                confirmButtonText: '知道了'
              })
            } else {
              // 若后台未生成过账单【res.data.data】返回false
              this.$confirm('失效后, 收费或退费时不能参照该费用账单, 是否执行此操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                deactiveFeebill(item.id).then(res => {
                  if (res && parseInt(res.data.code) === 0) {
                    this.$message.success('操作成功')
                    this.fetchData()
                  } else {
                    this.$message.error(res.data.data.msg)
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
      } else {
        this.$router.push({
          path: '/feeBill/detail',
          query: {
            operateType: type,
            id: (type === 'edit' || type === 'view') ? item.id : undefined
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.feebill {
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
