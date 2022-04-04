<template>
  <div>
    <el-table :data="tableData" style="width: 100%" border size="small">
      <el-table-column prop="contactName" label="联系人" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="wechat" label="微信号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="address" label="常住地址" />
      <el-table-column prop="idNum" label="身份证号" width="150" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <div v-if="!detailDisable">
            <div v-if="scope.row.flag === 'add'">
              <el-button
                v-if="permissions.entity_merchantcontact_add"
                :disabled="!merchantId"
                size="mini"
                type="text"
                @click.stop="operatePersomData('add', scope.row)"
              >
                添加
              </el-button>
            </div>
            <div v-else>
              <el-button
                v-if="permissions.entity_merchantcontact_edit"
                size="mini"
                type="text"
                @click.stop="operatePersomData('edit', scope.row)"
              >
                修改
              </el-button>
              <el-button
                v-if="permissions.entity_merchantcontact_del"
                type="text"
                size="mini"
                @click.stop="operatePersomData('del', scope.row)"
              >
                删除
              </el-button>
            </div>
          </div>
          <div v-else>
            <el-button
              v-if="permissions.entity_merchantcontact_view"
              size="mini"
              type="text"
              @click.stop="operatePersomData('look', scope.row)"
            >
              查看
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑联系人 -->
    <addPerson :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script type="text/ecmascript-6">
import addPerson from './addPerson'// 【添加或者编辑联系人】
import { delObj } from '@/api/merchant-contact'
import { mapGetters } from 'vuex'
export default {
  name: 'ConcatPage',
  components: { addPerson },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    detailDisable: {
      type: Boolean,
      default: false
    },
    merchantId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      concatData: [],
      dialogVo: {
        title: '新增联系人',
        visible: false,
        operateType: 'add',
        vo: {
          merchantId: '',
          contactName: '', // 联系人姓名
          phone: '', // 手机号
          wechat: '', // 微信号
          email: '', // 邮箱
          address: '', // 常住地址
          idNum: '', // 身份证号
          idFront: '', // 身份证照片正面
          idBack: '' // 身份证照片反面
        } // 联系人信息
      }// 添加或编辑联系人弹框
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
    // 联系人相关 begin
    operatePersomData(type, item) {
      item.merchantId = this.merchantId
      if (type === 'add') {
        this.dialogVo = {
          title: '新增联系人',
          visible: true,
          operateType: 'add',
          vo: item
        }
      } else if (type === 'edit') {
        this.dialogVo = {
          title: '修改联系人',
          visible: true,
          operateType: 'edit',
          vo: item
        }
      } else if (type === 'look') {
        this.dialogVo = {
          title: '查看联系人',
          visible: true,
          operateType: 'look',
          vo: item
        }
      } else {
        // 删除联系人
        this.$confirm('删除后将不能恢复，是否要删除当前记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.queryVoById()
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
    // 子组件控制弹框展示或者隐藏
    setDialogVisiable(data) {
      this.dialogVo.visible = data
      this.queryVoById()
    },
    queryVoById() {
      this.$emit('queryVoById')
    }
    // 联系人相关 end
  }
}
</script>

<style scoped lang="scss">
</style>

