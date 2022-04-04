<template>
  <div class="van">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="车辆类型" prop="vanType">
          <el-select v-model="formParams.vanType" placeholder="请选择车辆类型" filterable clearable>
            <el-option
              v-for="item in selectOptions.vehicleTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="vanNum">
          <el-input v-model="formParams.vanNum" placeholder="请输入车牌号" clearable />
        </el-form-item>
        <el-form-item label="车主类型" prop="ownerType">
          <el-select v-model="formParams.ownerType" placeholder="请选择车主类型" filterable clearable>
            <el-option
              v-for="item in selectOptions.ownerTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车主名称" prop="ownerName">
          <el-input v-model="formParams.ownerName" placeholder="请输入车主名称" clearable />
        </el-form-item>
        <el-form-item label="车主手机号" prop="phoneNum">
          <el-input v-model="formParams.phoneNum" placeholder="请输入车主手机号" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_van_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table
        ref="filterTable"
        v-loading="tableLoading"
        :data="tableData"
        row-key="id"
        element-loading-text="加载中"
        style="width: 100%"
        border
        size="small"
      >
        <el-table-column prop="vanNum" label="车牌号" />
        <el-table-column prop="ownerName" label="车主名" />
        <el-table-column prop="ownerTypeName" label="车主类型" />
        <el-table-column prop="phoneNum" label="车主手机号" />
        <el-table-column prop="vantypeName" label="车辆类型" />
        <el-table-column prop="vanWeight" label="车辆皮重(公斤)" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_van_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_van_edit"
              size="mini"
              type="text"
              @click.stop="operateData('del', scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-if="permissions.entity_van_view"
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
    <AddVan :dialog-vo="dialogVo" @cancelDialog="cancelDialog" />
  </div>
</template>

<script>
import { fetchList, delObj } from '@/api/van'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import AddVan from './components/addVan' // 添加/查看车辆
import { mapGetters } from 'vuex'
export default {
  name: 'AreaPage',
  components: {
    pagination, AddVan
  },
  data() {
    return {
      dialogVo: {
        title: '新增',
        visible: false,
        operateType: 'add',
        vo: {}
      },
      formParams: {
        vanType: '', // 车辆类型
        vanNum: '', // 车牌号
        ownerName: '', // 车主名称
        ownerType: '', // 车主类别
        phoneNum: '' // 车主手机号
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        vehicleTypeList: [], // 车辆类型
        ownerTypeList: [] // 车主类型
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 获取列表数据
    this.handlerSearch(1)
  },
  methods: {
    getSelectList() {
      // 车主类型
      remote('car_owner_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.ownerTypeList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 车辆类型
      remote('van_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.vehicleTypeList = res.data.data
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
        vanType: this.formParams.vanType || undefined,
        vanNum: this.formParams.vanNum || undefined,
        ownerName: this.formParams.ownerName || undefined,
        ownerType: this.formParams.ownerType || undefined,
        phoneNum: this.formParams.phoneNum || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
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
    // 新增/编辑/查看 打开弹框
    operateData(type, item) {
      if (type === 'add') {
        this.dialogVo = {
          title: '新增车辆档案',
          visible: true,
          operateType: 'add',
          vo: item
        }
      } else if (type === 'edit') {
        this.dialogVo = {
          title: '修改车辆档案',
          visible: true,
          operateType: 'edit',
          vo: item
        }
      } else if (type === 'look') {
        this.dialogVo = {
          title: '查看车辆档案',
          visible: true,
          operateType: 'look',
          vo: item
        }
      } else {
        this.$confirm('是否删除该车辆信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('删除成功')
              this.handlerSearch(1)
            } else {
              this.$message.error('删除失败')
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
    cancelDialog(data) {
      this.dialogVo.visible = data
      this.handlerSearch(1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.van {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
  // ::v-deep .el-table .el-table__expand-icon{
  //   margin-right: 0px !important;
  //   margin-left: -20px !important;
  // }
  // ::v-deep .el-table__row--level-1{
  //   .el-table__expand-icon{
  //     margin-right: 0px !important;
  //     margin-left:  0px !important;
  //   }
  //   .el-table__indent{
  //     padding-left: 0px !important;
  //   }
  // }
  .bg-image {
    padding-top: 0px;
    .block {
      text-align: center;
      display: inline-block;
      box-sizing: border-box;
      vertical-align: top;
      margin-right: 24px;
      position: relative;
      .el-image {
        width: 230px;
        height: 172px;
      }
    }
  }
}
</style>
