<template>
  <div class="estate-type">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="name">
          <el-input v-model="formParams.name" placeholder="请输入物业类型名称" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <!--v-if="permissions.market_area_add"-->
        <el-button v-if="permissions.entity_estatetype_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table
        ref="filterTable"
        v-loading="tableLoading"
        :data="tableData"
        row-key="id"
        style="width: 100%"
        border
        size="small"
      >
        <el-table-column prop="num" label="排序" align="center" />
        <el-table-column prop="name" label="类型名称" align="center" />
        <el-table-column prop="label" label="标签名" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button
              v-if="permissions.entity_feeitemestatetype_view"
              size="mini"
              type="text"
              @click.stop="setFeeItem(scope.row)"
            >
              设置收费项目
            </el-button> -->
            <el-button
              v-if="permissions.entity_estatetype_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_estatetype_view"
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
      width="600px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="排序" prop="num">
              <el-input-number
                v-model="inputForm.num"
                :min="0"
                step-strictly
                style="width: 100%"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="类型名称" prop="name">
              <el-input
                v-model="inputForm.name"
                placeholder="请输入物业类型名称"
                maxlength="20"
                clearable
                show-word-limit
                :disabled="detailDisable || (operateType === 'edit' && inputForm.isDefault === '1')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="标签名称" prop="label">
              <el-input
                v-model="inputForm.label"
                placeholder="请输入物业标签名称"
                maxlength="20"
                clearable
                show-word-limit
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="是否可租" prop="isRent">
              <el-select
                v-model="inputForm.isRent"
                clearable
                placeholder="请选择是否纳入租赁统计"
                style="width: 100%"
                :disabled="detailDisable"
              >
                <el-option
                  v-for="item in selectOptions.flagType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="是否可售" prop="isSale">
              <el-select
                v-model="inputForm.isSale"
                clearable
                placeholder="请选择是否纳入销售跟踪统计"
                style="width: 100%"
                :disabled="detailDisable"
              >
                <el-option
                  v-for="item in selectOptions.flagType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="operateType !== 'add'" :xs="24" :sm="24" :lg="24">
            <el-form-item label="系统默认">
              <el-select
                v-model="inputForm.isDefault"
                clearable
                placeholder="请选择管理该区域的市场人员"
                style="width: 100%"
                :disabled="detailDisable || inputForm.isDefault === '1'"
              >
                <el-option
                  v-for="item in selectOptions.flagType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
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
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="detailDisable">
          <el-divider />
          <el-row>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="创建人">
                <el-input v-model="inputForm.createBy" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="创建时间">
                <el-input v-model="inputForm.createTime" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="修改人">
                <el-input v-model="inputForm.updateBy" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="24">
              <el-form-item label="修改时间">
                <el-input v-model="inputForm.updateTime" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">{{ detailDisable ? '关 闭' : '取 消' }}</el-button>
        <el-button v-if="!detailDisable" type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
    <!--设置收费项目-->
    <el-dialog
      :title="chargeItemDialog.title"
      :visible.sync="chargeItemDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog znp-crud-dialog-inner-table"
      width="800px"
    >
      <div class="znp-table-container">
        <div style="margin-bottom: 16px">
          <p>类型名称:{{ chargeItemDialog.estateTypeItem.estatetypeName }}</p>
          <el-button
            v-if="permissions.entity_feeitemestatetype_add"
            type="primary"
            size="mini"
            @click="operateChargeData('add')"
          >
            新增
          </el-button>
        </div>
        <el-table
          ref="filterTable"
          v-loading="tableLoading"
          :data="chargeTableData"
          row-key="id"
          style="width: 100%"
          border
          size="small"
        >
          <el-table-column prop="feeitemName" label="收费项目" align="center" />
          <el-table-column prop="payType" label="计费方式" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.payType === 0 ? '固定金额' : '单价数量' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" label="参考单价" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="permissions.entity_feeitemestatetype_edit"
                size="mini"
                type="text"
                @click.stop="operateChargeData('edit', scope.row)"
              >
                修改
              </el-button>
              <el-button
                v-if="permissions.entity_feeitemestatetype_del"
                type="text"
                size="mini"
                @click.stop="operateChargeData('del', scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--新增修改收费项目 -->
    <el-dialog
      :title="ItemDialog.title"
      :visible.sync="ItemDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelChargeItemDialog"
      class="znp-crud-dialog"
      width="600px"
    >
      <el-form ref="chargeInputFormRef" :model="chargeInputForm" :rules="chargeInputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="收费项目" prop="feeitemId">
              <el-select
                v-model="chargeInputForm.feeitemId"
                clearable
                placeholder="请选择收费项目"
                style="width: 100%"
                @change="feeItemChange"
              >
                <el-option
                  v-for="item in selectOptions.chargeItem"
                  :key="item.id"
                  :label="item.itemName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="计费方式" prop="payType">
              <el-select v-model="chargeInputForm.payType" clearable placeholder="请选择计费方式" style="width: 100%">
                <el-option
                  v-for="item in selectOptions.chargeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="参考单价" prop="unitPrice">
              <el-input v-model="chargeInputForm.unitPrice" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelChargeItemDialog">取 消</el-button>
        <el-button type="primary" @click="saveChargeBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, fetchChargeList, addChargeObj, putChargeObj, delChargeObj } from '@/api/estate-type'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'EstateType',
  components: {
    pagination
  },
  data() {
    return {
      remarkPlaceHolder: '选填',
      adminKey: 'admin_key',
      dialog: {
        title: '新增',
        visible: false
      },
      chargeItemDialog: {
        title: '设置收费项目',
        visible: false,
        estateTypeItem: {
          estatetypeId: '',
          estatetypeName: ''
        }
      },
      ItemDialog: {
        title: '收费项目',
        visible: false
      },
      formParams: {
        name: ''
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // 列表loading
      tableData: [],
      selectOptions: {
        flagType: [], // 是否
        chargeItem: [], // 收费项目
        chargeType: [] // 计费方式
      },
      operateType: 'add',
      inputForm: {
        num: 0, // 排序
        name: '', // 类型名称
        label: '', // 标签名称
        isRent: '', // 是否纳入租赁统计
        isSale: '', // 是否纳入销售跟踪统计
        isDefault: '0', // 是否可修改该 0 不是系统默认 1 系统默认
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      baseForm: {
        num: 0, // 排序
        name: '', // 类型名称
        label: '', // 标签名称
        isRent: '', // 是否纳入租赁统计
        isSale: '', // 是否纳入销售跟踪统计
        isDefault: '0', // 是否可修改该 0 不是系统默认 1 系统默认
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      inputFormRules: {
        num: [
          { required: true, message: '请输入排序序号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        isRent: [
          { required: true, message: '请选择是否纳入租赁统计', trigger: 'change' }
        ],
        isSale: [
          { required: true, message: '请选择是否纳入销售跟踪统计', trigger: 'change' }
        ]
      },
      estateType: '', // 设置收费项目显示的类型名称
      chargeOperateType: 'add',
      chargeTableData: [], // 收费项目数据列表
      chargeInputForm: {
        estatetypeId: '', // 物业类型id
        estatetypeName: '', // 物业类型名称
        feeitemId: '', // 收费项目
        feeitemName: '', // 收费项目名称
        payType: '', // 计费方式
        unitPrice: '' // 参考单价
      },
      chargeBaseForm: {
        estatetypeId: '', // 物业类型id
        estatetypeName: '', // 物业类型名称
        feeitemId: '', // 收费项目
        feeitemName: '', // 收费项目名称
        payType: '', // 计费方式
        unitPrice: '' // 参考单价
      },
      chargeInputFormRules: {
        feeitemId: [
          { required: true, message: '请输入选择收费项目', trigger: 'change' }
        ],
        payType: [
          { required: true, message: '请选择计费方式', trigger: 'change' }
        ],
        unitPrice: [
          { required: true, message: '请填写参考单价', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!(/(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value))) {
                callback(new Error('请输入大于等于0的数字，最多两位小数'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
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
    operateType: {
      handler(l) {
        if (l === 'look') {
          this.inputFormRules.name[0].required = false
          this.inputFormRules.label[0].required = false
        } else {
          this.inputFormRules.name[0].required = true
          this.inputFormRules.label[0].required = true
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
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
      // 收费项目
      /* fetchFeeItemList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.chargeItem = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      }) */
      // 计费方式
      remote('charge_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.chargeType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 是否
      remote('flag_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.flagType = res.data.data
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
        name: this.formParams.name || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          const dataList = res.data.data
          this.tableData = dataList.records
          this.total = dataList.total
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
        this.dialog.title = '新增类型'
        this.inputForm = Object.assign({}, this.baseForm)
      } else if (this.operateType === 'edit') {
        this.dialog.title = '修改类型'
        this.inputForm = JSON.parse(JSON.stringify(item))
        this.inputForm.isDefault = item.isDefault + ''
        this.inputForm.isSale = item.isSale + ''
        this.inputForm.isRent = item.isRent + ''
      } else {
        this.dialog.title = '查看类型'
        this.inputForm = item
        this.inputForm.isDefault = item.isDefault + ''
        this.inputForm.isSale = item.isSale + ''
        this.inputForm.isRent = item.isRent + ''
        this.remarkPlaceHolder = ''
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
            putObj(this.inputForm).then(res => {
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
    // 设置收费项目
    setFeeItem(item) {
      this.chargeItemDialog.visible = true
      this.chargeItemDialog.estateTypeItem = {
        estatetypeName: item.name,
        estatetypeId: item.id
      }
      // 查询收费项目表数据
      this.searchChargeDataFun()
    },
    //  查询收费项目表数据
    searchChargeDataFun() {
      fetchChargeList(this.chargeItemDialog.estateTypeItem.estatetypeId).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          const dataList = res.data.data
          this.chargeTableData = dataList
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 新增/修改收费项目
    operateChargeData(type, item) {
      this.chargeOperateType = type
      if (this.chargeOperateType === 'add') {
        this.ItemDialog.visible = true
        this.chargeInputForm = Object.assign({}, this.chargeBaseForm)
        this.$nextTick(() => {
          this.$refs['chargeInputFormRef'].clearValidate()
        })
      } else if (this.chargeOperateType === 'edit') {
        this.ItemDialog.visible = true
        this.chargeInputForm = item
        this.chargeInputForm.payType = this.chargeInputForm.payType + ''
      } else {
        // 删除
        this.$confirm('删除后，将不能生成相应的费用项，是否要删除当前收费项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 重新查询设置收费项目表
          delChargeObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.searchChargeDataFun()
            } else {
              this.$message.error(res.data.msg)
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
    // 选择科目变更的同时保存科目对应的名称
    feeItemChange(val) {
      const obj = this.selectOptions.chargeItem.find((item) => {
        return item.id === val
      })
      this.chargeInputForm.feeitemName = obj.itemName
    },
    // 新增/编辑/查看 保存数据
    saveChargeBtn() {
      this.$refs['chargeInputFormRef'].validate((valid) => {
        if (valid) {
          this.chargeInputForm.estatetypeId = this.chargeItemDialog.estateTypeItem.estatetypeId
          this.chargeInputForm.estatetypeName = this.chargeItemDialog.estateTypeItem.estatetypeName
          if (this.chargeOperateType === 'add') {
            addChargeObj(this.chargeInputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.ItemDialog.visible = false
                this.searchChargeDataFun()
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putChargeObj(this.chargeInputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.ItemDialog.visible = false
                this.searchChargeDataFun()
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
    // 关闭弹框
    cancelDialog() {
      this.dialog.visible = false
      this.chargeItemDialog.visible = false
    },
    cancelChargeItemDialog() {
      this.ItemDialog.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.estate-type {
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
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  ::v-deep .el-input-number__increase,
  ::v-deep .el-input-number__decrease {
    right: 1px !important;
  }
}
</style>
