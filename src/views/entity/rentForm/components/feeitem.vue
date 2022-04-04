<template>
  <div class="merchant-papers">
    <div class="znp-table-add-btn">
      <el-button
        v-if="permissions.entity_feeform_add"
        size="mini"
        type="primary"
        plain
        @click.stop="quickChargeItems()"
      >
        快速生成收费项
      </el-button>
      <el-button size="mini" type="primary" @click="createFeeBill()">生成费用账单</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border size="small" align="center">
      <el-table-column prop="feeformName" label="收费项名称" />
      <el-table-column prop="feeitemName" label="收费科目" />
      <el-table-column prop="feeFormStatusLabel" label="状态" width="60" />
      <el-table-column prop="feeFormCycleLabel" label="收费周期" width="75" />
      <el-table-column prop="payTypeLabel" label="计费方式" width="80" />
      <el-table-column prop="unitPrice" label="参考单价" width="80" />
      <el-table-column prop="startDate" label="开始日期" width="85" />
      <el-table-column prop="endDate" label="结束日期" width="85" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <div v-if="scope.row.flag === 'add'">
            <el-button
              v-if="permissions.entity_feeform_add"
              size="mini"
              type="text"
              @click.stop="openDialog('add', scope.row)"
            >
              添加
            </el-button>
          </div>
          <div v-else>
            <el-button
              v-if="permissions.entity_feeform_edit"
              size="mini"
              type="text"
              @click.stop="openDialog('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feeform_view"
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
    <!-- 添加/编辑收费项 -->
    <addFeeItem :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script type="text/ecmascript-6">
import { genFeeForm } from '@/api/rentform'
import { billeCheck, createFeeBill } from '@/api/feeform'
import addFeeItem from './addFeeItem'// 【添加或者编辑收费项】
import { mapGetters } from 'vuex'
export default {
  name: 'FeeItem',
  components: { addFeeItem },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    detailDisable: {
      type: Boolean,
      default: false
    },
    isExistFeeForm: {
      type: Boolean,
      default: false
    },
    rentformVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      dialogImage: {
        url: '',
        visible: false
      }, // 预览图片对象
      concatData: [],
      dialogVo: {
        title: '新增收费项',
        visible: false,
        operateType: 'add',
        vo: {
          merchantId: '',
          id: '', //
          paperType: '', // 证件类型
          paperRealcode: '', // 证件编号
          valdateS: '', // 证件有效期起始日期
          valdateE: '', // 证件有效期终止日期
          paperPicture: ''
        } // 收费项信息
      }// 添加或编辑收费项弹框
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
    // 收费项相关 begin
    openDialog(type, item) {
      item.rentformId = this.rentformVo.id
      item.merchantId = this.rentformVo.merchantId
      item.merchantName = this.rentformVo.merchantName
      if (type === 'add') {
        this.dialogVo = {
          title: '新增收费项',
          visible: true,
          operateType: 'add',
          vo: item
        }
      } else if (type === 'edit') {
        this.dialogVo = {
          title: '修改收费项',
          visible: true,
          operateType: 'edit',
          vo: item
        }
      } else if (type === 'look') {
        this.dialogVo = {
          title: '查看收费项',
          visible: true,
          operateType: 'look',
          vo: item
        }
      }
    },
    // 子组件控制弹框展示或者隐藏
    setDialogVisiable(data) {
      this.dialogVo.visible = data
      this.queryVoById()
    },
    queryVoById() {
      this.$emit('queryVoById')
    },
    // 快速生成收费项按钮
    quickChargeItems() {
      if (!this.isExistFeeForm) {
        this.$alert('当前物业的计费项没有维护数据，请联系运营人员或手动添加收费项。', '提示', {
          confirmButtonText: '我知道了'
        })
      } else {
        this.$confirm('会依据不同的物业类型生成收费项目，是否执行此操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 快速生成收费项目 传当前出租合同登记单id
          genFeeForm({
            rentFormId: this.rentformVo.id,
            estateId: this.rentformVo.estateId,
            estateName: this.rentformVo.estateName,
            merchantId: this.rentformVo.merchantId,
            merchantName: this.rentformVo.merchantName,
            startDate: this.rentformVo.startDate,
            endDate: this.rentformVo.endDate
          }).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('快速生成收费项目成功')
              this.queryVoById()
            } else {
              this.$message.error('快速生成收费项目失败,请联系系统管理员')
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
    // 收费项相关 end
    // 图片预览
    previewImg(url) {
      this.dialogImage.url = url
      this.dialogImage.visible = true
    },
    // 生成费用账单
    createFeeBill() {
      // 若后台未生成过账单
      billeCheck({
        merchantId: this.rentformVo.merchantId,
        rentformId: this.rentformVo.id
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          // 若后台已生成过账单【res.data.data】返回true
          if (res.data.data) {
            this.$confirm('费用账单已由后台自动生成，请前往费用账单功能中查看。', '提示', {
              confirmButtonText: '前往',
              cancelButtonText: '留在当前页',
              type: 'warning'
            }).then(() => {
              this.$router.push({ path: '/entity/feeBill/index' })
            }).catch(() => {
              this.queryVoById()
            })
          } else {
            // 若后台未生成过账单【res.data.data】返回false
            this.$confirm('该操作会根据收费项生成第一期的费用账单，是否执行此操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              createFeeBill({
                merchantId: this.rentformVo.merchantId,
                rentformId: this.rentformVo.id
              }).then(res => {
                if (res && parseInt(res.data.code) === 0) {
                  this.$message.success('操作成功')
                  this.queryVoById()
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
          }
        } else {
          this.$message.error('操作失败,请联系系统管理员')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.merchant-papers {
  .imgWraper {
    text-align: center;
    padding: 40px 120px;
  }
}
</style>

