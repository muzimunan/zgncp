<template>
  <div class="fee-bill-item">
    <div class="znp-table-add-btn">
      <el-button
        v-if="permissions.entity_feebilldetails_add"
        size="mini"
        type="primary"
        :disabled="tableData.length > 0"
        @click.stop="openDialog('add')"
      >
        添加费用单
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border size="small">
      <el-table-column prop="detailsTypeName" label="计费方式" />
      <el-table-column prop="count" label="费用数量" />
      <el-table-column prop="unitPrice" label="收费金额/单价" />
      <el-table-column prop="billStatusName" label="收费状态" />
      <el-table-column prop="billTime" label="收费时间" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.entity_feebilldetails_edit"
            size="mini"
            type="text"
            @click.stop="openDialog('edit', scope.row)"
          >
            修改
          </el-button>
          <el-button
            v-if="permissions.entity_feebilldetails_del"
            size="mini"
            type="text"
            @click.stop="openDialog('delete', scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="600px"
    >
      <el-form ref="inputFormRef" label-width="110px" :model="inputForm" :rules="inputFormRules">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="计费方式" prop="detailsType">
              <el-select
                v-model="inputForm.detailsType"
                style="width: 100%"
                placeholder="请选择计费方式"
                clearable
                @change="detailsTypeChange"
              >
                <el-option
                  v-for="item in selectOptions.detailsTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="费用数量" prop="count">
              <el-input-number v-model="inputForm.count" style="width: 100%" :min="0" step-strictly :controls="false" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="收费金额/单价" prop="unitPrice">
              <el-input v-model="inputForm.unitPrice" placeholder="请输入收费金额或单价" clearable />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="备注">
              <el-input
                v-model="inputForm.remark"
                type="textarea"
                placeholder=""
                clearable
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { addDetail, putDetail, delDetailById } from '@/api/feeBill'
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex'
export default {
  name: 'FeeBillItem',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    feebillItem: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    // 收费金额或单价
    var checkUnitPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入收费金额或单价'))
      } else {
        if (value && !(/(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value))) {
          callback(new Error('请输入大于等于0的数字，最多两位小数'))
        }
      }
      callback()
    }
    return {
      dialog: {
        title: '新增费用单',
        visible: false,
        operateType: 'add'
      }, // 新增费用单弹框
      inputForm: {
        detailsType: '',
        detailsTypeName: '',
        feebillId: this.$route.query.id, // 费用账单id
        feebillName: '', // 费用账单名字
        count: '', // 费用计数
        unitPrice: '',
        remark: '',
        billStatus: 0,
        createBy: '',
        createById: 0,
        merchantId: 0,
        merchantName: '',
        marketCodename: '',
        marketId: 0
      },
      baseForm: {
        detailsType: '',
        detailsTypeName: '',
        feebillId: this.$route.query.id, // 费用账单id
        feebillName: '', // 费用账单名字
        count: '', // 费用计数
        unitPrice: '',
        remark: '',
        billStatus: 0,
        createBy: '',
        createById: 0,
        merchantId: 0,
        merchantName: '',
        marketCodename: '',
        marketId: 0
      },
      selectOptions: {
        detailsTypeList: [] // 计费方式列表
      },
      inputFormRules: {
        detailsType: [
          { required: true, message: '请选择计费方式', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '请输入具体使用数量', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, validator: checkUnitPrice, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {},
  mounted() {
  },
  created() {
    this.getSelectList()
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
    getSelectList() {
      remote('charge_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.detailsTypeList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 添加费用单
    openDialog(type, item) {
      this.dialog.operateType = type
      if (type === 'add') {
        this.dialog.visible = true
        this.dialog.title = '新增费用单'
        this.inputForm = Object.assign({}, this.baseForm)
        this.$nextTick(() => {
          this.$refs['inputFormRef'].clearValidate()
        })
      } else if (type === 'edit') {
        this.dialog.visible = true
        this.dialog.title = '修改费用单'
        this.inputForm = item
        this.inputForm.detailsType = item.detailsType + ''
        this.$nextTick(() => {
          this.$refs['inputFormRef'].clearValidate()
        })
      } else {
        // 删除提示
        // if (!hasRelatedFeeRecord) {
        this.$confirm('删除后, 收费或退费时不能参照该费用账单, 是否执行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDetailById(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('操作成功')
              this.cancelDialog()
            } else {
              this.$message.error('操作失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
        // } else {
        //   // 已与收费单或者退费单关联, 无法执行此操作
        //   this.$confirm('已与收费单或者退费单关联, 无法执行此操作', '提示', {
        //     cancelButtonText: '知道了',
        //     type: 'info'
        //   })
        // }
      }
    },
    detailsTypeChange(val) {
      const obj = this.selectOptions.detailsTypeList.find((item) => {
        return item.value === val
      })
      this.inputForm.detailsTypeName = obj.label
    },

    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.dialog.operateType === 'add') {
            const postData = Object.assign({}, this.inputForm)
            postData['billStatus'] = this.feebillItem.feebillStatus
            postData['marketId'] = this.feebillItem.marketId
            postData['marketCodename'] = this.feebillItem.marketCodename
            postData['merchantId'] = this.feebillItem.merchantId
            postData['merchantName'] = this.feebillItem.merchantName

            addDetail(postData).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.dialog.visible = false
                this.cancelDialog()
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putDetail(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.dialog.visible = false
                this.cancelDialog()
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
      this.$emit('queryVoById')
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.fee-bill-item {
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>

