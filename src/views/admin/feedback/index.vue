<template>
  <div class="feed-back-list">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="问题描述" prop="feedback">
          <el-input v-model="formParams.feedback" placeholder="问题描述" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button type="primary" v-if="permissions.entity_feedback_add" size="mini" @click="operateData('add')">新增</el-button>
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
        <el-table-column prop="feedback" label="问题描述" align="center" />
        <el-table-column label="问题截图">
          <template slot-scope="scope">
            <el-link type="primary" @click="viewPicture(scope.row.picUrl)">{{ scope.row.picName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column prop="createBy" label="创建人" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.entity_feedback_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_feedback_del"
              type="text"
              size="mini"
              @click.stop="operateData('del', scope.row)"
            >
              删除
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
            <el-form-item label="问题描述" prop="feedback">
              <el-input
                v-model="inputForm.feedback"
                type="textarea"
                placeholder="请描述您的问题……"
                clearable
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="问题截图" prop="picUrl">
              <el-upload
                ref="imgUpload"
                action="#"
                :before-upload="beforeUpload"
                :http-request="uploadRequest"
                :show-file-list="false"
                :limit="1"
              >
                <el-button size="small" type="primary">
                  上传图片
                  <i class="el-icon-upload el-icon--right" />
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
              </el-upload>
              <div v-if="inputForm.picUrl" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.picUrl" />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="备注">
              <el-input
                v-model="inputForm.remark"
                type="textarea"
                placeholder="选填"
                clearable
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="saveBtn">提交问题</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj } from '@/api/admin/feedback'
import { queryDeptSelectList } from '@/api/admin/dept'
import { deptRoleList } from '@/api/admin/role'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
import { importFile } from '@/api/upload'
export default {
  name: 'FeeBackList',
  components: {
    pagination
  },
  data() {
    return {
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      dialog: {
        title: '意见反馈',
        visible: false
      },
      formParams: {
        feedback: ''
      },
      selectOptions: {
        deptList: [], // 部门
        roleList: [] // 角色
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
        feedback: '',
        picUrl: '',
        picName: '',
        picId: '',
        remark: ''
      },
      baseForm: {
        feedback: '',
        picUrl: '',
        picName: '',
        picId: '',
        remark: ''
      },
      inputFormRules: {
        feedback: [
          { required: true, message: '请描述您的问题……', trigger: 'blur' }
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
      // 所属部门
      queryDeptSelectList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.deptList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 角色
      deptRoleList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.roleList = res.data.data
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
        feedback: this.formParams.feedback || undefined
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
        this.dialog.title = '新增意见反馈'
        this.inputForm = Object.assign({}, this.baseForm)
      } else if (this.operateType === 'edit') {
        this.dialog.title = '修改意见反馈'
        this.inputForm = JSON.parse(JSON.stringify(item))
      } else {
        this.dialog.visible = false
        this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).then(() => {
          delObj(item.id)
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
    // 上传图片相关 begin
    uploadRequest(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.file)
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm.picUrl = res.data.data.url
          this.inputForm.picId = res.data.data.fileId
          this.inputForm.picName = res.data.data.fileName
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 上传成功之后清除历史记录
      this.$refs.imgUpload.clearFiles()
    },
    // 文件上传之前校验
    beforeUpload(file) {
      const fileSize = file.size
      if (!file) {
        this.$message.error('请先选取上传的文件')
        return false
      }
      if (file.name.search(/(.jpg)$/) < 1 && file.name.search(/(.png)$/) < 1) {
        this.$message.error('图片格式只支持jpg或png')
        return false
      }
      if (fileSize / 1024 / 1024 > 10) {
        this.$notify.error('图片大小不超过10M')
        return false
      }
    },
    // 上传图片 end
    viewPicture(url) {
      window.open(this.url + url + '/preview')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.feed-back-list {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
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
