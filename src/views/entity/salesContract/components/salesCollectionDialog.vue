<template>
  <div class="floor-svgs-dialog">
    <el-dialog
      :title="salesCollectionDialog.title"
      :visible="salesCollectionDialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="1000px"
    >
      <el-form
        ref="inputFormRef"
        label-position="right"
        label-width="120px"
        :rules="inputFormRules"
        :model="inputForm"
        class="dialog-add-course"
        size="small"
      >
        <el-row>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="合同名称：" prop="contractName">
              <span>{{ inputForm.contractName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="合同金额：" prop="contractName">
              <span>{{ inputForm.contractPrice }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="收费项目：" prop="feeItemName">
              <span>{{ inputForm.feeItemName }}销售回款</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="收款次序：" prop="payCycle">
              <el-input-number :min="1" :controls="false" v-model="inputForm.payCycle" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="本次应收金额：" prop="realPrice">
              <el-input-number
                :min="0.0"
                :controls="false"
                :precision="2"
                v-model="inputForm.realPrice"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8">
            <el-form-item label="收费日期：" prop="startDate">
              <el-date-picker
                v-model="inputForm.startDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="收费日期"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" style="text-align: right">
            <el-button type="primary" size="small" @click="saveBtn" v-if="permissions.entity_feepaydetailsale_add">
              销售回款登记
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="znp-table-container content-p24">
        <el-table :data="tableData" style="width: 100%" border size="small" v-loading="tableLoading">
          <el-table-column prop="payCycle" label="收款次序" />
          <el-table-column prop="realPrice" label="收款金额" />
          <el-table-column prop="startDate" label="收款日期" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                v-if="permissions.entity_feepaydetailsale_del"
                size="mini"
                type="text"
                @click="delObj(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--  <div style="margin-top: 24px; display: flex; align-items: center; justify-content: flex-end">
          <pagination
            :total="total"
            :page.sync="listQuery.current"
            :limit.sync="listQuery.size"
            @pagination="handleFilter"
          />
        </div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { fetchList, addObj, delObj } from '@/api/feepaydetailsale'
import { mapGetters } from 'vuex'
export default {
  name: 'FloorSvgsDialog',
  props: {
    salesCollectionDialog: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      inputForm: {
        contractId: '', // 合同编码
        contractName: '', // 合同名称
        payCycle: '', // 收费次序
        realPrice: '', // 实收金额
        startDate: '', // 收费日期
        remark: '' // 备注
      },
      inputFormRules: {
      },
      listQuery: {
        size: 10, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true,
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    'salesCollectionDialog': {
      handler(l) {
        if (l.visible) {
          const contractVo = l.vo
          this.inputForm = {
            contractId: contractVo.id, // 合同编码
            contractName: contractVo.contractName, // 合同名称
            contractPrice: contractVo.contractPrice // 合同总金额
          }
          this.handlerSearch(1)
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    }
  },
  mounted() {
  },
  created() {
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
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
    searchDataFun() {
      this.tableLoading = true
      fetchList({
        contractId: this.inputForm.contractId
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data
          this.tableLoading = false
        } else {
          this.$message.error('查询失败，请联系系统管理员')
        }
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          addObj(this.inputForm).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('新增成功')
              this.handlerSearch(1)
              // 清空
              this.inputForm.realPrice = ''
              this.inputForm.startDate = ''
              this.inputForm.payCycle = ''
            } else {
              this.$message.error('新增失败,' + res.data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    delObj(item) {
      // 删除
      this.$confirm('删除后将不能恢复，是否要删除当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(item.id).then(res => {
          if (res && parseInt(res.data.code) === 0) {
            this.handlerSearch(1)
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
    },
    cancelDialog() {
      this.$emit('cancelDialog', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.floor-svgs-dialog {
  .znp-crud-dialog[data-v-d96e1492] .el-dialog__body {
    padding: 20px 50px 5px 50px !important;
  }
  .content-p24 {
    padding: 15px 0px;
  }
  ::v-deep .el-input-number.is-without-controls .el-input__inner {
    text-align: left !important;
  }
}
</style>
