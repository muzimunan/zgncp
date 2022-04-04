<template>
  <div class="merchant-van">
    <el-table :data="tableData" style="width: 100%" border size="small">
      <el-table-column prop="vanNum" label="车牌号" />
      <el-table-column prop="vantypeName" label="车辆类型" />
      <el-table-column prop="vanWeight" label="车辆皮重(公斤)" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <div v-if="!detailDisable">
            <div v-if="scope.row.flag === 'add'">
              <el-button
                v-if="permissions.entity_van_add"
                :disabled="!ownerVo.id"
                size="mini"
                type="text"
                @click.stop="operateData('add', scope.row)"
              >
                添加
              </el-button>
            </div>
            <div v-else>
              <el-button
                v-if="permissions.entity_van_edit"
                size="mini"
                type="text"
                @click.stop="operateData('edit', scope.row)"
              >
                修改
              </el-button>
              <el-button
                v-if="permissions.entity_van_edit"
                type="text"
                size="mini"
                @click.stop="operateData('del', scope.row)"
              >
                删除
              </el-button>
            </div>
          </div>
          <div v-else>
            <el-button
              v-if="permissions.entity_van_view"
              size="mini"
              type="text"
              @click.stop="operateData('look', scope.row)"
            >
              查看
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑车辆档案信息 -->
    <addVan :dialog-vo="dialogVo" @cancelDialog="cancelDialog" />
  </div>
</template>

<script type="text/ecmascript-6">
import addVan from '@/views/entity/van/components/addVan'// 车辆档案
import { delObj } from '@/api/van'
import { mapGetters } from 'vuex'
export default {
  name: 'VanListPage',
  components: { addVan },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    detailDisable: {
      type: Boolean,
      default: false
    },
    ownerType: {
      type: String,
      default: ''
    },
    ownerVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      dialogVo: {
        title: '新增车辆档案',
        visible: false,
        fromPageType: '0', // 0来自商户/采购商页面的CRUD，车主类型和车主名称不允许修改 1来自车辆档案中的允许修改车主类型和车主名称
        operateType: 'add',
        vo: {} // 车辆档案信息信息
      }// 添加或编辑车辆档案信息弹框
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
    // 车辆档案信息相关 begin
    operateData(type, item) {
      if (type !== 'del') {
        this.dialogVo.visible = true
        this.dialogVo.operateType = type
        this.dialogVo.vo = item
        this.dialogVo.vo.ownerName = (this.ownerType === '0' ? this.ownerVo.merchantName : this.ownerVo.traderName) || undefined // 车主名称
        this.dialogVo.vo.ownerId = this.ownerVo.id || undefined // 车主名称
        this.dialogVo.vo.ownerType = this.ownerType // 车主类型
        this.dialogVo.vo.ownerTypeName = this.ownerType === '0' ? '商户' : '采购商' // 车主类型名称
      }
      if (type === 'add') {
        this.dialogVo.title = '新增车辆档案'
      } else if (type === 'edit') {
        this.dialogVo.title = '修改车辆档案'
      } else if (type === 'look') {
        this.dialogVo.title = '查看车辆档案'
      } else {
        this.$confirm('是否删除该车辆信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(item.id).then(res => {
            if (res && parseInt(res.data.code) === 0) {
              this.$message.success('删除成功')
              this.queryVoById()
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
    // 子组件控制弹框展示或者隐藏
    cancelDialog(data) {
      this.dialogVo.visible = data
      this.queryVoById()
    },
    queryVoById() {
      this.$emit('queryVoById')
    }
    // 车辆档案信息相关 end
  }
}
</script>

<style scoped lang="scss">
</style>

