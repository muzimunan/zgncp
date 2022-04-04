<template>
  <div class="category">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="kindsName">
          <el-input v-model="formParams.kindsName" placeholder="请输入品类名称" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_category_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
        <!-- &nbsp;&nbsp;
        <el-radio-group v-model="isExpandAll" size="mini" @change="isExpandAllChange">
          <el-radio-button :label="false">折叠</el-radio-button>
          <el-radio-button :label="true">展开</el-radio-button>
        </el-radio-group> -->
      </div>
      <el-table
        v-if="refreshTable"
        ref="filterTable"
        v-loading="tableLoading"
        :data="tableData"
        row-key="id"
        style="width: 100%"
        border
        size="small"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="kindsCode" label="品类编码" />
        <el-table-column prop="kindsName" label="品类名称" />
        <el-table-column prop="label" label="标签名称" />
        <el-table-column prop="level" label="级次">
          <template slot-scope="scope">
            <span>{{ scope.row.level === 0 ? '一级' : scope.row.level === 1 ? '二级' : '三级' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.level != 2" size="mini" type="text" @click.stop="operateData('add', scope.row)">
              新增下级
            </el-button>
            <el-button
              v-if="permissions.entity_category_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_category_view"
              type="text"
              size="mini"
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
            <el-form-item label="上级">
              <el-input v-model="inputForm.uplevel" disabled />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="品类编码" prop="kindsCode" class="znp-remove-start" v-if="!isAdd">
              <el-input
                v-model="inputForm.kindsCode"
                placeholder="自动生成，可自定义"
                maxlength="12"
                clearable
                show-word-limit
                :disabled="isView || isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="品类名称" prop="kindsName">
              <el-input
                v-model="inputForm.kindsName"
                placeholder="请输入品类名称"
                maxlength="20"
                clearable
                show-word-limit
                :disabled="isView || (isEdit && checkIsDefault)"
              />
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
                :disabled="isView"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="交易均价" prop="price">
              <el-input
                v-model="inputForm.price"
                placeholder="请输入大于0的数字(单位：元/吨)"
                clearable
                show-word-limit
                :disabled="isView"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="isView || isEdit" :xs="24" :sm="24" :lg="24">
            <el-form-item label="系统默认" prop="isDefault">
              <el-select
                v-model="inputForm.isDefault"
                placeholder="是否系统默认"
                :disabled="isView"
                style="width: 100%"
              >
                <el-option value="0" label="否" />
                <el-option value="1" label="是" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="备注">
              <el-input
                v-model="inputForm.remark"
                type="textarea"
                :placeholder="remarkPlaceHolder"
                clearable
                maxlength="300"
                show-word-limit
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="isView">
          <el-divider />
          <el-row>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建人">
                <el-input v-model="inputForm.createBy" :disabled="isView" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建时间">
                <el-input v-model="inputForm.createTime" :disabled="isView" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改人">
                <el-input v-model="inputForm.updateBy" :disabled="isView" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改时间">
                <el-input v-model="inputForm.updateTime" :disabled="isView" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">{{ isView ? '关 闭' : '取 消' }}</el-button>
        <el-button v-if="!isView" type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, putObj } from '@/api/category'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
import { rule } from '@/util/validateRules'
export default {
  name: 'CategoryPage',
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
      refreshTable: true,
      isExpandAll: false,
      remarkPlaceHolder: '选填',
      adminKey: 'admin_key',
      dialog: {
        title: '新增',
        visible: false
      },
      formParams: {
        kindsName: ''
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: [],
      operateType: 'add',
      inputForm: {
        kindsCode: '',
        kindsName: '',
        uplevel: '', // 上级
        level: '', // 当前级别
        label: '', // 品类标签
        price: '', // 交易均价
        isDefault: '0', // 是否系统默认
        isDefaultName: '',
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      baseForm: {
        kindsCode: '',
        kindsName: '',
        level: '',
        label: '', // 品类标签
        price: '', // 交易均价
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      inputFormRules: {
        kindsCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        kindsName: [
          { required: true, message: '请输入品类名称', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        price: [
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    isView() {
      return this.operateType === 'view'
    },
    isEdit() {
      return this.operateType === 'edit'
    },
    isAdd() {
      return this.operateType === 'add'
    },
    checkIsDefault() {
      return parseInt(this.inputForm.isDefault) === 1
    }
  },
  watch: {
    operateType: {
      handler(l) {
        if (l === 'view') {
          this.inputFormRules.kindsName[0].required = false
        } else {
          this.inputFormRules.kindsName[0].required = true
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    }
  },
  created() {
    // 获取列表数据
    this.fetchData()
  },
  methods: {
    // 条件查询
    handlerSearch(page) {
      this.listQuery.current = page
      this.fetchData()
    },
    isExpandAllChange() {
      this.refreshTable = false
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 翻页
    handleFilter(page) {
      this.listQuery.current = page.page
      this.fetchData()
    },
    // 查询列表
    fetchData() {
      this.tableLoading = true
      const pageQueryVo = {
        kindsName: this.formParams.kindsName || undefined,
        current: this.listQuery.current || undefined,
        size: this.listQuery.size || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          const dataList = res.data.data
          this.tableData = dataList
          this.total = res.data.data.length
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
      this.dialog.visible = true
      this.operateType = type
      this.remarkPlaceHolder = '选填'
      this.$nextTick(() => {
        this.$refs['inputFormRef'].clearValidate()
      })
      if (this.operateType === 'add') {
        this.dialog.title = '新增品类'
        this.inputForm = Object.assign({}, this.baseForm)
        if (!item) {
          this.inputForm.uplevel = '顶级'
          this.inputForm.level = 0
        } else {
          this.inputForm.uplevel = item.level === 0 ? '一级' : (item.level === 1 ? '二级' : '三级')
          let count = parseInt(item.level)
          count++
          this.inputForm.level = count
        }
        this.inputForm.parentId = item.id
      } else if (this.operateType === 'edit') {
        this.dialog.title = '修改品类'
        this.inputForm = item
        this.inputForm.uplevel = `${item.kindsCode}/${item.kindsName}`
        this.inputForm.levelName = item.level === 0 ? '一级' : (item.level === 1 ? '二级' : '三级')
        this.inputForm.isDefault = this.inputForm.isDefault + ''

        this.inputFormRules.kindsName[0].required = this.inputForm.isDefault === '0'
        this.inputFormRules.label[0].required = true
      } else {
        this.dialog.title = '查看品类'
        this.inputForm = item
        this.inputForm.uplevel = `${item.kindsCode}/${item.kindsName}`
        this.inputForm.levelName = item.level === 0 ? '一级' : (item.level === 1 ? '二级' : '三级')
        this.inputForm.isDefault = this.inputForm.isDefault + ''

        this.inputFormRules.kindsName[0].required = false
        this.inputFormRules.label[0].required = false
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
                this.fetchData()
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.dialog.visible = false
                this.fetchData()
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
.category {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
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
