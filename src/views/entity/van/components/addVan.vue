<template>
  <div class="add-van">
    <el-dialog
      :title="dialogVo.title"
      :visible="dialogVo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelDialog"
      class="znp-crud-dialog"
      width="700px"
    >
      <el-form ref="inputFormRef" :model="inputForm" :rules="inputFormRules" label-width="110px">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="车牌号" prop="vanNum">
              <el-input v-model="inputForm.vanNum" placeholder="请输入车牌号" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="车辆类型" prop="vantypeId">
              <el-select
                v-model="inputForm.vantypeId"
                style="width: 100%"
                placeholder="请选择车辆类型"
                clearable
                :disabled="detailDisable"
                @change="vantypeIdChange"
              >
                <el-option
                  v-for="item in selectOptions.vehicleTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="车辆皮重" prop="vanWeight">
              <el-input-number
                v-model="inputForm.vanWeight"
                placeholder="请输入车辆皮重"
                :min="0"
                :precision="2"
                clearable
                :disabled="detailDisable"
                style="width: 100%"
                :controls="false"
              >
                <template slot="suffix">公斤</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="车主类型" prop="ownerType">
              <el-select
                v-model="inputForm.ownerType"
                style="width: 100%"
                placeholder="请选择车主类型"
                clearable
                :disabled="detailDisable || canNotChange"
                @change="ownerTypeChange"
              >
                <el-option
                  v-for="item in selectOptions.ownerTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="车主名称" prop="ownerName">
              <el-autocomplete
                class="inline-input"
                style="width: 100%"
                v-model="inputForm.ownerName"
                :fetch-suggestions="queryOwnerList"
                placeholder="请输入车主名称"
                @select="handleSelectOwner"
                :disabled="detailDisable || canNotChange"
              >
                <template slot-scope="{ item }">
                  <div>{{ item.name }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="车主电话" prop="phoneNum">
              <el-input v-model="inputForm.phoneNum" placeholder="请输入车主电话" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24">
            <el-form-item label="备注">
              <el-input
                v-model="inputForm.remark"
                type="textarea"
                placeholder="选填"
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

<script type="text/ecmascript-6">
import { addObj, putObj, getOwnerType } from '@/api/van'
import { remote } from '@/api/admin/dict'
export default {
  name: 'AddVan',
  props: {
    dialogVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      selectOptions: {
        vehicleTypeList: [], // 车辆类型
        ownerTypeList: [] // 车主类型
      },
      inputForm: {
        ownerName: '',
        ownerId: '',
        ownerType: '',
        ownerTypeName: '',
        phoneNum: '',
        vanNum: '',
        vanWeight: '',
        vantypeName: '',
        vantypeId: '',
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      baseForm: {
        ownerName: '',
        ownerId: '',
        ownerType: '',
        phoneNum: '',
        vanNum: '',
        vanWeight: '',
        vantypeName: '',
        vantypeId: '',
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      inputFormRules: {
        vanNum: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        vanWeight: [
          { required: true, message: '请输入车辆皮重', trigger: 'blur' }
        ],
        vantypeId: [
          { required: true, message: '请选择车辆类型', trigger: 'change' }
        ],
        ownerType: [
          { required: true, message: '请选择车主类型', trigger: 'change' }
        ],
        ownerName: [
          { required: true, message: '请选择车主姓名', trigger: 'change' }
        ],
        phoneNum: [
          { required: true, message: '请输入正确车主手机号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    addDisable() {
      return this.dialogVo.operateType === 'add'
    },
    detailDisable() {
      return this.dialogVo.operateType === 'look'
    },
    editDisable() {
      return this.dialogVo.operateType === 'edit'
    },
    canNotChange() {
      return this.dialogVo.fromPageType === '0'
    }
  },
  watch: {
    'dialogVo': {
      handler(l) {
        if (l.visible) {
          if (this.dialogVo.operateType !== 'add') {
            this.inputForm = JSON.parse(JSON.stringify(l.vo))
            this.inputForm.ownerType = this.inputForm.ownerType + ''
            this.inputForm.vantypeId = this.inputForm.vantypeId + ''
          } else {
            // 清除表单数据
            this.inputForm = Object.assign({}, this.baseForm)
            if (l && l.vo) {
              this.inputForm.ownerName = l.vo.ownerName
              this.inputForm.ownerId = l.vo.ownerId
              this.inputForm.ownerTypeName = l.vo.ownerTypeName
              this.inputForm.ownerType = l.vo.ownerType
            }
            this.$nextTick(() => {
              this.$refs['inputFormRef'].clearValidate()
            })
          }
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    }
  },
  mounted() {
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
    getSelectList() {
      // 车主类型
      remote('car_owner_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.ownerTypeList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 车辆类型
      remote('van_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.vehicleTypeList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 车主类型变更填充车主类型名称
    ownerTypeChange(val) {
      const obj = this.selectOptions.ownerTypeList.find((item) => {
        return item.value === val
      })
      this.inputForm.ownerTypeName = obj.label
      // 车主类型修改同时清空车主名称和id
      this.inputForm.ownerName = ''
      this.inputForm.ownerId = ''
    },
    // 车辆类型变更填充车辆类型名称
    vantypeIdChange(val) {
      const obj = this.selectOptions.vehicleTypeList.find((item) => {
        return item.value === val
      })
      this.inputForm.vantypeName = obj.label
    },
    // 车主
    queryOwnerList(queryString, cb) {
      // 根据车主类型查询车主数据列表
      if (this.inputForm.ownerType && parseInt(this.inputForm.ownerType) !== 3) {
        getOwnerType(this.inputForm.ownerType).then(res => {
          if (res && parseInt(res.data.code) === 0) {
            var results = queryString ? res.data.data.filter(this.createFilter(queryString)) : res.data.data
            cb(results)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
      cb([])
    },
    createFilter(queryString) {
      return (item) => {
        return (item.name.indexOf(queryString) === 0)
      }
    },
    handleSelectOwner(item) {
      this.inputForm.ownerName = item.name
      this.inputForm.ownerId = item.id
    },
    // 新增/编辑/查看 保存数据
    saveBtn() {
      // if (!this.inputForm.ownerId) {
      //   this.$message.error('请先创建商户信息')
      //   return
      // }
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.dialogVo.operateType === 'add') {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.cancelDialog()
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
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
      this.$refs['inputFormRef'].clearValidate()
      this.$emit('cancelDialog', false)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.add-van {
  ::v-deep .el-input-number.is-without-controls .el-input__inner {
    text-align: left;
  }
}
</style>
