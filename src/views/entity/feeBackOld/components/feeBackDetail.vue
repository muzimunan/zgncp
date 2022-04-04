<template>
  <div class="merchant-papers">
    <div class="znp-table-add-btn">
      <el-button
        v-if="!detailDisable"
        size="mini"
        type="primary"
        :disabled="!feeBackVo.id"
        @click.stop="bringbyFeeItem()"
      >
        通过费用单带入
      </el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border size="small" align="center">
      <el-table-column prop="feeItemName" label="科目名称" />
      <el-table-column prop="payTypeName" label="计费方式" />
      <el-table-column prop="startDate" label="开始日期" />
      <el-table-column prop="endDate" label="结束日期" />
      <el-table-column prop="count" label="数量" />
      <el-table-column prop="unitPrice" label="收费金额/单价" />
      <el-table-column prop="realPrice" label="实退金额" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <div v-if="!detailDisable">
            <div v-if="scope.row.flag === 'add'">
              <el-button
                v-if="permissions.entity_feebackdetails_add"
                :disabled="!feeBackVo.id"
                size="mini"
                type="text"
                @click.stop="openDialog('add', scope.row)"
              >
                添加
              </el-button>
            </div>
            <div v-else>
              <el-button
                v-if="permissions.entity_feebackdetails_edit"
                size="mini"
                type="text"
                @click.stop="openDialog('edit', scope.row)"
              >
                修改
              </el-button>
              <el-button
                v-if="permissions.entity_feebackdetails_del && scope.row.realPrice <= 0"
                type="text"
                size="mini"
                @click.stop="openDialog('del', scope.row)"
              >
                删除
              </el-button>
            </div>
          </div>
          <div v-else>
            <el-button
              v-if="permissions.entity_feebackdetails_registe"
              size="mini"
              type="text"
              @click.stop="openDialog('registration', scope.row)"
            >
              退款登记
            </el-button>
            <el-button
              v-if="permissions.entity_feebackdetails_view"
              size="mini"
              type="text"
              @click.stop="openDialog('look', scope.row)"
            >
              查看
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑退款单明细 -->
    <AddFeeBackDetail :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
    <!-- 通过费用带入 -->
    <BringFeeItem :bring-dialog-vo="bringDialogVo" @setBringDialogVisiable="setDialogVisiable" />
    <!-- 收款登记 -->
    <el-dialog
      :title="registrationDialog.title"
      :visible.sync="registrationDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog znp-crud-dialog-inner-table"
      width="600px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="应退金额">
              <el-input v-model="inputForm.unitPrice" placeholder="单位（元）" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实退金额" prop="realPrice">
              <el-input v-model="inputForm.realPrice" placeholder="单位（元）" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="chargeRegistration">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import AddFeeBackDetail from './addFeeBackDetail'// 【添加或者编辑退款单明细】
import BringFeeItem from './bringFeeItem'// 【添加或者编辑退款单明细】
import { mapGetters } from 'vuex'
import { delObj, chargeRegistration } from '@/api/feebackdetails'
export default {
  name: 'FeeBackDetail',
  components: { AddFeeBackDetail, BringFeeItem },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    detailDisable: {
      type: Boolean,
      default: false
    },
    feeBackVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    var checkPriceValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入实际退款金额'))
      } else {
        if (value && !(/(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value))) {
          callback(new Error('请输入大于等于0的数字，最多两位小数'))
        }
      }
      callback()
    }
    return {
      registrationDialog: {
        title: '退款等级',
        visible: false
      },
      inputForm: {
        id: '', // 退款单明细id
        unitPrice: '', // 应收金额
        realPrice: ''// 登记的实收金额
      },
      inputFormRules: {
        realPrice: [
          { required: true, validator: checkPriceValid, trigger: 'blur' }
        ]
      },
      bringDialogVo: {
        title: '参照费用单带入',
        visible: false
      },
      dialogVo: {
        title: '新增退费单明细',
        visible: false,
        operateType: 'add',
        vo: {
          feebackId: '', // 退款单id
          startDate: '',
          endDate: '',
          payType: '', // 计费方式
          unitPrice: '', // 收费金额/单价
          count: '' // 数量有效期终止日期
        } // 退款单明细信息
      }// 添加或编辑退款单明细弹框
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {},
  mounted() {
  },
  created() {
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
    openDialog(type, item) {
      item.feeBackId = this.feeBackVo.id
      if (type === 'add') {
        this.dialogVo = {
          title: '新增退款单明细',
          visible: true,
          operateType: 'add',
          vo: item
        }
      } else if (type === 'edit') {
        this.dialogVo = {
          title: '修改退款单明细',
          visible: true,
          operateType: 'edit',
          vo: item
        }
      } else if (type === 'look') {
        this.dialogVo = {
          title: '查看退款单明细',
          visible: true,
          operateType: 'look',
          vo: item
        }
      } else if (type === 'del') {
        // 删除
        this.$confirm('删除后，退费时不能参照该条数据，是否执行此操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('删除成功')
              this.queryVoById()
            } else {
              this.$message.error('删除失败,请联系系统管理员')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        // 打开收款登记窗口
        this.registrationDialog.visible = true
        this.inputForm = {
          id: item.id, // 退款单明细id
          unitPrice: item.unitPrice, // 应收金额
          realPrice: item.realPrice// 登记的实收金额
        }
      }
    },
    // 收款登记
    chargeRegistration() {
      const _that = this
      _that.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          chargeRegistration({
            id: this.inputForm.id,
            realPrice: this.inputForm.realPrice
          }).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('登记成功')
              this.cancelDialog()
            } else {
              this.$message.error('登记失败,请联系系统管理员')
            }
          })
        } else {
          return false
        }
      })
    },
    // 子组件控制弹框展示或者隐藏
    setDialogVisiable(data) {
      this.dialogVo.visible = data
      this.bringDialogVo.visible = data
      this.queryVoById()
    },
    queryVoById() {
      this.$emit('queryVoById')
    },
    cancelDialog() {
      this.registrationDialog.visible = false
      this.queryVoById()
    },
    // 通过费用单带入
    bringbyFeeItem() {
      this.bringDialogVo.visible = true
      this.bringDialogVo.merchantId = this.feeBackVo.merchantId
      this.bringDialogVo.feebackId = this.feeBackVo.id
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.merchant-papers {
  .imgWraper {
    text-align: center;
    padding: 40px 120px;
  }
}
</style>

