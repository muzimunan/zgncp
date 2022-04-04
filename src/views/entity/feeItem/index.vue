<template>
  <div class="feekinds">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="financeKindsId">
          <el-select v-model="formParams.financeKindsId" style="width: 100%" placeholder="请选择财务科目" clearable>
            <el-option
              v-for="item in selectOptions.feekindsfinanceList"
              :key="item.id"
              :label="item.financeKindsName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="operationKindsId">
          <el-select
            v-model="formParams.operationKindsId"
            style="width: 100%"
            placeholder="请选择运营科目"
            clearable
          >
            <el-option
              v-for="item in selectOptions.feekindsoperationList"
              :key="item.id"
              :label="item.operationKindsName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="nameOrCode">
          <el-input v-model="formParams.nameOrCode" placeholder="请输入收费项目名称" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_feeitem_add" type="primary" size="mini" @click="operateData('add')">
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
        <el-table-column prop="itemCode" label="收费项目编码" />
        <el-table-column prop="itemName" label="收费项目名称" />
        <el-table-column prop="feekindsfinanceName" label="财务科目" />
        <el-table-column prop="feekindsoperationName" label="运营科目" />
        <el-table-column prop="label" label="标签名称" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feeitem_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feeitem_view"
              type="text"
              size="mini"
              @click.stop="operateData('view', scope.row)"
            >
              查看
            </el-button>
            <el-button
              v-if="permissions.entity_feeitem_del"
              type="text"
              size="mini"
              @click.stop="operateData('del', scope.row)"
            >
              删除
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
      width="700px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="收费项目编码" prop="itemCode" class="znp-remove-start" v-if="!addDisable">
              <el-input
                v-model="inputForm.itemCode"
                placeholder="自动生成，可自定义"
                maxlength="10"
                clearable
                show-word-limit
                :disabled="viewDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="收费项目名称" prop="itemName">
              <el-input
                v-model="inputForm.itemName"
                placeholder="请输入收费项目名称"
                maxlength="20"
                clearable
                show-word-limit
                :disabled="viewDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="财务科目" prop="">
              <el-select
                v-model="inputForm.feekindsfinanceId"
                style="width: 100%"
                placeholder="请选择财务科目"
                clearable
                :disabled="viewDisable"
                @change="onFeekindsfinanceChange"
              >
                <el-option
                  v-for="item in selectOptions.feekindsfinanceList"
                  :key="item.id"
                  :label="item.financeKindsName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="运营科目" prop="">
              <el-select
                v-model="inputForm.feekindsoperationId"
                style="width: 100%"
                placeholder="请选择运营科目"
                clearable
                :disabled="viewDisable"
                @change="onFeekindsoperationChange"
              >
                <el-option
                  v-for="item in selectOptions.feekindsoperationList"
                  :key="item.id"
                  :label="item.operationKindsName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="标签名称" prop="label">
              <el-input
                v-model="inputForm.label"
                placeholder="请输入标签名称"
                maxlength="20"
                clearable
                show-word-limit
                :disabled="viewDisable"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="纳入统计" prop="isDefault">
              <el-select
                v-model="inputForm.isDefault"
                style="width: 100%"
                placeholder="请选择是否纳入统计"
                clearable
                :disabled="viewDisable"
              >
                <el-option
                  v-for="item in selectOptions.flagList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="纳入合计" prop="isUpdate">
              <el-select
                v-model="inputForm.isUpdate"
                style="width: 100%"
                placeholder="请选择是否纳入合计"
                clearable
                :disabled="viewDisable"
              >
                <el-option
                  v-for="item in selectOptions.flagList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="备注">
              <el-input
                v-model="inputForm.remark"
                type="textarea"
                :placeholder="remarkPlaceHolder"
                clearable
                maxlength="300"
                show-word-limit
                :disabled="viewDisable"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="viewDisable">
          <el-divider />
          <el-row>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建人">
                <el-input v-model="inputForm.createBy" :disabled="viewDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建时间">
                <el-input v-model="inputForm.createTime" :disabled="viewDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改人">
                <el-input v-model="inputForm.updateBy" :disabled="viewDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改时间">
                <el-input v-model="inputForm.updateTime" :disabled="viewDisable" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">{{ viewDisable ? '关 闭' : '取 消' }}</el-button>
        <el-button v-if="!viewDisable" type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDataByPage, addObj, putObj, delObj } from '@/api/feeItems'
import { getRemoteFeekindsoperationList } from '@/api/feekindsoperation'
import { getRemoteFeekindsfinanceList } from '@/api/feekindsfinance'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'FeeItem',
  components: {
    pagination
  },
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.operateType === 'add' && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
      }
      callback()
    }
    return {
      remarkPlaceHolder: '选填',
      dialog: {
        title: '新增',
        visible: false
      },
      formParams: {
        financeKindsId: '',
        operationKindsId: '',
        nameOrCode: ''
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: false, // loading
      tableData: [],
      selectOptions: {
        feekindsfinanceList: [], // 收费项目分类
        feekindsoperationList: [], // 收费项目分类
        flagList: [{ value: 0, name: '否' }, { value: 1, name: '是' }]
      },
      operateType: 'add',
      inputForm: {
        itemCode: '',
        itemName: '',
        feekindsfinanceId: '',
        feekindsfinanceName: '',
        feekindsoperationId: '',
        feekindsoperationName: '',
        label: '',
        isDefault: 0,
        isUpdate: 0,
        remark: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      baseForm: {
        itemCode: '',
        itemName: '',
        feekindsfinanceId: '',
        feekindsfinanceName: '',
        feekindsoperationId: '',
        feekindsoperationName: '',
        label: '',
        isDefault: 0,
        isUpdate: 0,
        remark: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      inputFormRules: {
        itemCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: '请输入收费项目名称', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请输入收费项目标签名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    viewDisable() {
      return this.operateType === 'view'
    },
    addDisable() {
      return this.operateType === 'add'
    },
    editDisable() {
      return this.operateType === 'edit'
    }
  },
  watch: {
  },
  created() {
    // 获取收费项目分类下拉列表数据
    this.getSelectList()
    // 获取列表数据
    this.handlerSearch(1)
  },
  methods: {
    getSelectList() {
      getRemoteFeekindsoperationList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feekindsoperationList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      getRemoteFeekindsfinanceList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feekindsfinanceList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
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
        financeKindsId: this.formParams.financeKindsId || undefined,
        operationKindsId: this.formParams.operationKindsId || undefined,
        nameOrCode: this.formParams.nameOrCode || undefined,
        current: this.listQuery.current || undefined,
        size: this.listQuery.size || undefined
      }
      fetchDataByPage(pageQueryParams).then(res => {
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
    onFeekindsoperationChange(id) {
      const item = this.selectOptions.feekindsoperationList.find((item) => {
        return item.id === id
      })
      this.inputForm.feekindsoperationName = item.operationKindsName
    },
    onFeekindsfinanceChange(id) {
      const item = this.selectOptions.feekindsfinanceList.find((item) => {
        return item.id === id
      })
      this.inputForm.feekindsfinanceName = item.financeKindsName
    },
    // 新增/编辑/查看 打开弹框
    operateData(type, item) {
      if (type !== 'del') {
        this.dialog.visible = true
      }
      this.operateType = type
      this.remarkPlaceHolder = '选填'
      this.$nextTick(() => {
        this.$refs['inputFormRef'].clearValidate()
      })
      if (this.operateType === 'add') {
        this.dialog.title = '新增收费项目'
        this.inputForm = Object.assign({}, this.baseForm)
      } else if (this.operateType === 'edit') {
        this.dialog.title = '修改收费项目'
        this.inputForm = item
      } else if (this.operateType === 'view') {
        this.dialog.title = '查看收费项目'
        this.inputForm = item
      } else {
        this.$confirm('是否删除收费项目【' + item.itemName + '】信息?', '提示', {
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
    // 新增/编辑/查看 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.operateType === 'add') {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.dialog.visible = false
                this.handlerSearch(1)
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            const postData = Object.assign({}, this.inputForm)
            postData['isDefault'] = postData['isDefaultName'] === '是' ? 1 : 0
            putObj(postData).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.dialog.visible = false
                this.handlerSearch(1)
              } else {
                this.$message.error('修改失败,' + res.data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    cancelDialog() {
      this.dialog.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.feekinds {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 5px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }

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
