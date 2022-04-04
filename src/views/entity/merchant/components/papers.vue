<template>
  <div class="merchant-papers">
    <el-table :data="tableData" style="width: 100%" border size="small">
      <el-table-column prop="paperTypeName" label="证件类型" />
      <el-table-column prop="paperRealcode" label="证件编号" width="160" />
      <el-table-column prop="valdateS" label="证件有效期(起)" />
      <el-table-column prop="valdateE" label="证件有效期(止)" />
      <el-table-column label="证件图片">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.paperPicture"
            type="text"
            size="mini"
            @click.stop="previewImg(scope.row.paperPicture)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
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
    <!-- 添加/编辑资质与证件 -->
    <addPapers :dialog-vo="dialogVo" @setDialogVisiable="setDialogVisiable" />
    <!-- 图片预览-->
    <el-dialog :visible.sync="dialogImage.visible" width="1000px">
      <div class="imgWraper">
        <!-- <span v-if="goodsForm.goods_background_type===1" class="img-text" :class="dialogImage.bindClass">{{ goodsForm.goods_background_text }}</span> -->
        <img width="100%" :src="url + dialogImage.url" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import addPapers from './addPapers'// 【添加或者编辑资质与证件】
import { delObj } from '@/api/merchant-paper'
import { mapGetters } from 'vuex'
export default {
  name: 'PapersPage',
  components: { addPapers },
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
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      dialogImage: {
        url: '',
        visible: false
      }, // 预览图片对象
      concatData: [],
      dialogVo: {
        title: '新增资质与证件',
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
        } // 资质与证件信息
      }// 添加或编辑资质与证件弹框
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
    // 资质与证件相关 begin
    operatePersomData(type, item) {
      item.merchantId = this.merchantId
      if (type === 'add') {
        this.dialogVo = {
          title: '新增资质与证件',
          visible: true,
          operateType: 'add',
          vo: item
        }
      } else if (type === 'edit') {
        this.dialogVo = {
          title: '修改资质与证件',
          visible: true,
          operateType: 'edit',
          vo: item
        }
      } else if (type === 'look') {
        this.dialogVo = {
          title: '查看资质与证件',
          visible: true,
          operateType: 'look',
          vo: item
        }
      } else {
        // 删除资质与证件
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
    },
    // 资质与证件相关 end
    // 图片预览
    previewImg(url) {
      this.dialogImage.url = url
      this.dialogImage.visible = true
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

