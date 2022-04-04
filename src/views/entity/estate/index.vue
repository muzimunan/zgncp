<template>
  <div class="area">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="areaName">
          <el-input v-model="formParams.areaName" placeholder="区域名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="typeId">
          <el-select v-model="formParams.typeId" placeholder="物业类型" filterable clearable>
            <el-option
              v-for="item in selectOptions.estateTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="estateCodeAndName">
          <el-input v-model="formParams.estateCodeAndName" placeholder="物业编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="owner">
          <el-select v-model="formParams.owner" placeholder="所有权" filterable clearable>
            <el-option
              v-for="item in selectOptions.ownerShipType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="formParams.status" placeholder="使用状态" filterable clearable>
            <el-option
              v-for="item in selectOptions.useStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-form-item prop="beginUpdateTime">
          <el-date-picker
            v-model="formParams.beginUpdateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="修改日期起"
          />
        </el-form-item>
        <el-form-item prop="endUpdateTime">
          <el-date-picker
            v-model="formParams.endUpdateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="修改日期止"
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
        <el-button v-if="permissions.entity_estate_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
        <excelupload type="estate" :form-params="formParams" upload-label="物业" />
        <excelupload
          type="estaterent"
          :form-params="formParams"
          upload-label="物业租赁大表"
          v-if="permissions.entity_estate_rent_expoort"
        />
        <excelupload
          type="estatesale"
          :form-params="formParams"
          upload-label="物业销售大表"
          v-if="permissions.entity_estate_sale_expoort"
        />
      </div>
      <el-table ref="filterTable" v-loading="tableLoading" :data="tableData" style="width: 100%" border size="small">
        <el-table-column prop="estateCode" label="物业编码" />
        <el-table-column prop="estateName" label="物业名称" />
        <el-table-column prop="address" label="位置" />
        <el-table-column prop="buildingNumName" label="楼号" />
        <el-table-column prop="floorName" label="层号" />
        <el-table-column prop="areaName" label="区域名称" />
        <el-table-column prop="estateTypeName" label="物业类型" />
        <el-table-column prop="ownerName" label="所有权" />
        <el-table-column prop="statusName" label="使用状态" />
        <el-table-column prop="buidingAcr" label="建筑面积" />
        <el-table-column prop="avaiableAcr" label="可用面积" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_estate_updateStatus"
              size="mini"
              type="text"
              @click.stop="changeStatus(scope.row)"
            >
              状态变更
            </el-button>
            <el-button
              v-if="permissions.entity_estate_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_estate_view"
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
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="500px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="所有权" prop="owner">
              <el-select v-model="inputForm.owner" style="width: 100%">
                <el-option
                  v-for="item in selectOptions.ownerShipType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="使用状态" prop="status">
              <el-select v-model="inputForm.status" style="width: 100%">
                <el-option
                  v-for="item in selectOptions.useStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="变更原因" prop="updateReason">
              <el-input
                v-model="inputForm.updateReason"
                type="textarea"
                placeholder="请输入变更原因"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateStatus } from '@/api/estate'
import { getEstateTypeList } from '@/api/estate-type'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import excelupload from '@/components/UploadExcel' // 文件导入和模板下载
import { mapGetters } from 'vuex'
import { getSelectBuildingList } from '@/api/building'
export default {
  name: 'EstatePage',
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
        buildingNum: '', // 楼号信息
        areaName: '', // 区域名称
        typeId: '', // 物业类型
        estateCodeAndName: '', // 物业编码/名称
        owner: '', // 所有权
        status: '', // 使用状态
        beginUpdateTime: '',
        endUpdateTime: ''
      },
      listQuery: {
        size: 20, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        buildingList: [], // 楼层
        useStatus: [], // 使用状态
        ownerShipType: [], // 所有权
        estateTypeList: [] // 物业类型
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
      if (to.path === '/entity/estate/index') {
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
      // 楼层 参数传0 代表只查询楼层
      getSelectBuildingList(0).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.buildingList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 物业类型
      getEstateTypeList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.estateTypeList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
        buildingNum: this.formParams.buildingNum || undefined,
        areaName: this.formParams.areaName || undefined,
        typeId: this.formParams.typeId || undefined,
        estateCodeAndName: this.formParams.estateCodeAndName || undefined,
        owner: this.formParams.owner || undefined,
        status: this.formParams.status || undefined,
        beginUpdateTime: this.formParams.beginUpdateTime ? this.formParams.beginUpdateTime + ' 00:00:00' : undefined,
        endUpdateTime: this.formParams.endUpdateTime ? this.formParams.endUpdateTime + ' 23:59:59' : undefined
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
    // 打开状态变更窗口
    changeStatus(item) {
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['inputFormRef'].clearValidate()
      })
      this.inputForm.owner = item.owner + ''
      this.inputForm.status = item.status + ''
      this.inputForm.updateReason = item.updateReason
      this.inputForm.id = item.id
    },

    // 状态变更
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          this.$confirm('状态变更会影响后续出租或数据展示，是否执行此操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateStatus(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('状态变更成功')
                this.dialog.visible = false
                this.handlerSearch(1)
              } else {
                this.$message.error('状态变更失败')
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        } else {
          return false
        }
      })
    },
    cancelDialog() {
      this.dialog.visible = false
    },
    // 新增/编辑/查看 打开页面
    operateData(type, item) {
      this.$router.push({
        path: '/eatate/detail',
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
.area {
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
