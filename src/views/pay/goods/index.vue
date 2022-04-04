<template>
  <div class="goods-list">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="formParams.status" style="width: 100%" placeholder="订单状态" clearable>
            <el-option
              v-for="item in selectOptions.statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="支付订单号" prop="payOrderId">
          <el-input v-model="formParams.payOrderId" placeholder="支付订单号" clearable />
        </el-form-item>
        <el-form-item label="收费项目" prop="feeName">
          <el-input v-model="formParams.feeName" placeholder="收费项目" clearable />
        </el-form-item>
        <el-form-item label="收款渠道" prop="online">
          <el-select v-model="formParams.online" style="width: 100%" placeholder="收款渠道" clearable>
            <el-option label="线上" value="1" />
            <el-option label="线下" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期起" prop="beginCreateTime">
          <el-date-picker
            v-model="formParams.beginCreateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="创建日期起"
          />
        </el-form-item>
        <el-form-item label="创建日期止" prop="endCreateTime">
          <el-date-picker
            v-model="formParams.endCreateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="创建日期止"
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
        <!--v-if="permissions.market_area_add"-->
        <!-- <el-button v-if="permissions.market_user_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button> -->
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
        <el-table-column type="index" label="序号" align="center" width="45" />
        <el-table-column prop="feeCode" label="收费编码" align="center" />
        <el-table-column prop="feeName" label="收费项目名称" align="center" />
        <el-table-column prop="amount" label="金额/元" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.amount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="订单状态" align="center" />
        <el-table-column prop="payOrderId" label="支付订单号" align="center" />
        <el-table-column prop="onlineName" label="收款渠道" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button
              v-if="permissions.market_user_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.market_user_del"
              size="mini"
              type="text"
              @click.stop="operateData('del', scope.row)"
            >
              删除
            </el-button> -->
            <el-button v-if="permissions.pay_refund_request" size="mini" type="text" @click.stop="refund(scope.row)">
              退款
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
            <el-form-item label="退款金额" prop="refundAmount">
              <el-input-number
                v-model="inputForm.refundAmount"
                placeholder="请输入退款金额"
                :precision="2"
                :controls="false"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="备注" prop="refundDesc">
              <el-input
                v-model="inputForm.refundDesc"
                type="textarea"
                placeholder="请输入退款原因"
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
        <el-button type="primary" @click="payRefundHandle">退款</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj } from '@/api/pay/payorder'
import { payRefundHandle } from '@/api/pay/payrefund'
import { remote } from '@/api/admin/dict'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'GoodsList',
  components: {
    pagination
  },
  data() {
    return {
      dialog: {
        title: '退款',
        visible: false
      },
      formParams: {
        payOrderId: '',
        status: '',
        online: '',
        feeName: '',
        beginCreateTime: '',
        endCreateTime: ''
      },
      selectOptions: {
        statusList: [] // 订单状态
      },
      listQuery: {
        size: 20, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // 列表loading
      tableData: [],
      operateType: 'add',
      inputForm: {
        'online': '',
        'orderDate': '',
        'orderNum': '',
        'refundAmount': 0,
        'refundDesc': '',
        'refundOrderNum': ''
      },
      inputFormRules: {
        refundAmount: [
          { required: true, message: '请输入退款金额', trigger: 'blur' }
        ],
        refundDesc: [
          { required: true, message: '请输入退款原因', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    addDisable() {
      return this.operateType === 'add'
    },
    detailDisable() {
      return this.operateType === 'look'
    },
    editDisable() {
      return this.operateType === 'edit'
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
      // 订单状态
      remote('order_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.statusList = res.data.data
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
        descs: 'create_time',
        status: this.formParams.status || undefined,
        payOrderId: this.formParams.payOrderId || undefined,
        online: this.formParams.online || undefined,
        feeName: this.formParams.feeName || undefined,
        beginCreateTime: this.formParams.beginCreateTime ? this.formParams.beginCreateTime + ' 00:00:00' : undefined,
        endCreateTime: this.formParams.endCreateTime ? this.formParams.endCreateTime + ' 23:59:59' : undefined
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
      this.$nextTick(() => {
        this.$refs['inputFormRef'].clearValidate()
      })
      if (this.operateType === 'add') {
        this.dialog.title = '新增用户'
        this.inputForm = Object.assign({}, this.baseForm)
      } else if (this.operateType === 'edit') {
        this.dialog.title = '修改用户'
        this.inputForm = JSON.parse(JSON.stringify(item))
        this.inputForm.password = undefined
        this.inputForm.role = this.inputForm.roleList.map(o => { return o.roleId })
      } else {
        this.dialog.visible = false
        this.$confirm('此操作将永久删除该用户(用户名:' + item.username + '), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).then(() => {
          delObj(item.userId)
            .then(() => {
              this.handlerSearch(1)
              this.$message.success('删除成功')
            }).catch(() => {
              this.$message.error('删除失败')
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
            if (this.inputForm.phone && this.inputForm.phone.indexOf('*') > 0) {
              this.inputForm.phone = undefined
            }
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
    // 关闭弹框
    cancelDialog() {
      this.dialog.visible = false
    },
    refund(item) {
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['inputFormRef'].clearValidate()
        this.inputForm.refundAmount = item.refundAmount
        this.inputForm.refundDesc = item.refundDesc
      })
      this.inputForm.orderDate = item.orderDate
      this.inputForm.orderNum = item.payOrderId
      this.inputForm.online = item.online
    },
    // 操作退款
    payRefundHandle() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          payRefundHandle(this.inputForm).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              const errCode = res.data.data.errCode
              if (errCode === 'SUCCESS') {
                this.$message.success('退款成功')
                this.dialog.visible = false
                this.handlerSearch(1)
              } else {
                this.$message.error('退款失败,失败原因' + res.data.data.errMsg)
              }
            } else {
              this.$message.error('退款失败,' + res.data.msg)
            }
            loading.close()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.goods-list {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 10px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
  ::v-deep .el-input-number__increase,
  ::v-deep .el-input-number__decrease {
    right: 1px !important;
  }
  ::v-deep .el-radio {
    margin-right: 0px;
  }
}
</style>
