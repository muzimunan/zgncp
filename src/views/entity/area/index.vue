<template>
  <div class="area">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="name">
          <el-input v-model="formParams.name" placeholder="请输入区域名称" clearable />
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button v-if="permissions.entity_area_add" type="primary" size="mini" @click="operateData('add')">
          新增
        </el-button>
      </div>
      <el-table
        ref="filterTable"
        v-loading="tableLoading"
        :data="tableData"
        row-key="id"
        element-loading-text="加载中"
        style="width: 100%"
        border
        size="small"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="isExpandAll"
      >
        <el-table-column prop="code" label="区域编码" />
        <el-table-column prop="name" label="区域名称" />
        <el-table-column prop="level" label="级次">
          <template slot-scope="scope">
            <span>{{ scope.row.level === 0 ? '一级' : scope.row.level === 1 ? '二级' : '三级' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button v-if="scope.row.level != 2" size="mini" type="text" @click.stop="operateData('add', scope.row)">
              新增下级
            </el-button> -->
            <el-button
              v-if="permissions.entity_area_edit"
              size="mini"
              type="text"
              @click.stop="operateData('edit', scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="permissions.entity_area_view"
              type="text"
              size="mini"
              @click.stop="operateData('look', scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div style="margin-top:24px;display:flex;align-items:center;justify-content:flex-end">
        <pagination :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="handleFilter" />
      </div> -->
    </div>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="700px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="上级">
              <el-input v-model="inputForm.uplevel" disabled />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="区域编码" prop="code" class="znp-remove-start" v-if="!addDisable">
              <el-input
                v-model="inputForm.code"
                placeholder="自动生成，可自定义"
                maxlength="10"
                clearable
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="区域名称" prop="name">
              <el-input
                v-model="inputForm.name"
                placeholder="请输入区域名称"
                maxlength="20"
                clearable
                show-word-limit
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="detailDisable || editDisable" :xs="24" :sm="24" :lg="24">
            <el-form-item label="级次">
              <el-input v-model="inputForm.levelName" disabled />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="业务管理员">
              <el-select
                v-model="inputForm.areaManager"
                style="width: 100%"
                placeholder="请选择业务管理员"
                clearable
                :disabled="detailDisable"
              >
                <el-option
                  v-for="item in selectOptions.areaManagerList"
                  :key="item.userId"
                  :label="item.username"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="规划图" prop="planGraph">
              <el-upload
                ref="imgUpload"
                action="#"
                :before-upload="beforeUpload"
                :http-request="uploadRequest"
                :show-file-list="false"
                :limit="1"
                :disabled="detailDisable"
              >
                <el-button size="small" :disabled="detailDisable" type="primary">
                  上传图片
                  <i class="el-icon-upload el-icon--right" />
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
              </el-upload>
              <div v-if="inputForm.planGraph" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.planGraph" />
                </div>
              </div>
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
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建人">
                <el-input v-model="inputForm.createBy" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建时间">
                <el-input v-model="inputForm.createTime" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改人">
                <el-input v-model="inputForm.updateBy" :disabled="detailDisable" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
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
  </div>
</template>

<script>
import { fetchList, addObj, putObj, fetchUserList } from '@/api/area'
import { importFile } from '@/api/upload'
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex'
export default {
  name: 'AreaPage',
  components: {
  },
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.operateType === 'add' && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
      }
      callback()
    }
    return {
      isExpandAll: false,
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '选填',
      adminKey: 'admin_key',
      dialog: {
        title: '新增',
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
      tableLoading: true, // loading
      tableData: [],
      selectOptions: {
        areaLevelType: [], // 区域级别
        areaManagerList: [] // 业务管理员
      },
      operateType: 'add',
      inputForm: {
        code: '',
        name: '',
        uplevel: '', // 上级
        level: '', // 当前级别
        planGraph: '', // 规划图
        areaManager: '', // 业务管理员
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      baseForm: {
        code: '',
        name: '',
        level: '',
        planGraph: '', // 规划图
        areaManager: '', // 业务管理员
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      inputFormRules: {
        code: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
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
  watch: {
    operateType: {
      handler(l) {
        if (l === 'look') {
          this.inputFormRules.name[0].required = false
        } else {
          this.inputFormRules.name[0].required = true
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
      // 级别
      remote('area_level_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.areaLevelType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 业务管理员
      fetchUserList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.areaManagerList = res.data.data
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
        name: this.formParams.name || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          const dataList = res.data.data
          this.tableData = dataList
          this.total = res.data.data.total
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
        this.dialog.title = '新增区域'
        this.inputForm = Object.assign({}, this.baseForm)
        if (!item) {
          this.inputForm.uplevel = '顶级'
          this.inputForm.level = 0
        } else {
          this.inputForm.uplevel = item.level === 0 ? '一级' : (item.level === 1 ? '二级' : '三级')
          let count = parseInt(item.level)
          count++
          this.inputForm.level = count
          this.inputForm.parentId = item.id
        }
      } else if (this.operateType === 'edit') {
        this.dialog.title = '修改区域'
        this.inputForm = JSON.parse(JSON.stringify(item))
        if (item.level === 0) {
          this.inputForm.uplevel = '顶级'
        } else {
          this.inputForm.uplevel = `${item.parentCode}/${item.parentName}`
        }
        this.inputForm.levelName = item.level === 0 ? '一级' : (item.level === 1 ? '二级' : '三级')
      } else {
        this.dialog.title = '查看区域'
        this.inputForm = item
        if (item.level === 0) {
          this.inputForm.uplevel = '顶级'
        } else {
          this.inputForm.uplevel = `${item.parentCode}/${item.parentName}`
        }
        this.inputForm.levelName = item.level === 0 ? '一级' : (item.level === 1 ? '二级' : '三级')
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
                this.$message.error('新增失败')
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.dialog.visible = false
                this.handlerSearch(1)
              } else {
                this.$message.error('修改失败')
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
    },
    // 上传图片相关 begin
    uploadRequest(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.file)
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm.planGraph = res.data.data.url
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
    }
    // 上传图片 end
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.area {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
  // ::v-deep .el-table .el-table__expand-icon{
  //   margin-right: 0px !important;
  //   margin-left: -20px !important;
  // }
  // ::v-deep .el-table__row--level-1{
  //   .el-table__expand-icon{
  //     margin-right: 0px !important;
  //     margin-left:  0px !important;
  //   }
  //   .el-table__indent{
  //     padding-left: 0px !important;
  //   }
  // }
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
}
</style>
