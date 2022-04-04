<template>
  <div class="trader-info">
    <div class="znp-form-wraper">
      <el-form
        ref="inputFormRef"
        label-position="right"
        label-width="150px"
        :rules="inputFormRules"
        :model="inputForm"
        class="dialog-add-course"
        size="small"
      >
        <el-row>
          <el-col v-if="detailDisable" :xs="24" :sm="24" :md="24" :lg="24" class="go-back">
            <el-link type="primary" :underline="false" @click="goBack">
              <i class="el-icon-d-arrow-left" />
              返 回
            </el-link>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <p class="form-title">{{ addDisable ? '新增采购商' : editDisable ? '修改采购商' : '查看采购商' }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="采购商编码" prop="traderCode" class="znp-remove-start" v-if="!addDisable">
              <el-input
                v-model="inputForm.traderCode"
                placeholder="自动生成，可自定义……"
                maxlength="13"
                show-word-limit
                clearable
                :disabled="detailDisable || editDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="采购商名称" prop="traderName">
              <el-input
                v-model="inputForm.traderName"
                placeholder="字数不能超过20个汉字"
                maxlength="20"
                show-word-limit
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="采购商类型" prop="typeId">
              <el-select
                v-model="inputForm.typeId"
                placeholder="请选择采购商类型"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.traderType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="经营类型" prop="saletypeId">
              <el-select
                v-model="inputForm.saletypeId"
                clearable
                placeholder="请选择经营类型"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.saleType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="经营业态" prop="operationtypesKindsId">
              <el-select
                v-model="inputForm.operationtypesKindsId"
                placeholder="请选择经营业态"
                :disabled="detailDisable"
                style="width: 100%"
                @change="operationTypesKindsChange"
              >
                <el-option
                  v-for="item in selectOptions.operationTypesKindsList"
                  :key="item.id"
                  :label="item.kindsName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <el-form-item label="主营品类" prop="kindsId">
              <el-select
                v-model="inputForm.kindsId"
                placeholder="请选择主营品类"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.kindsList"
                  :key="item.id"
                  :label="item.kindsName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <div v-if="inputForm.typeId !== '2'">
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="企业名称" prop="companyName">
                <el-input
                  v-model="inputForm.companyName"
                  placeholder="请输入营业执照上的企业名称"
                  clearable
                  :disabled="detailDisable"
                />
              </el-form-item>
            </el-col>
          </div>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="身份证号" prop="idNum">
              <el-input
                v-model="inputForm.idNum"
                placeholder="请输入正确的身份证号"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item
              label="联系人姓名"
              prop="contactName"
              :rules="[{ required: true, message: '请输入联系人姓名', trigger: 'blur' }]"
            >
              <el-input
                v-model="inputForm.contactName"
                placeholder="请输入联系人姓名"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="联系人手机号" prop="phoneNum">
              <el-input
                v-model="inputForm.phoneNum"
                placeholder="请输入正确手机号"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="备注">
              <el-input
                v-model="inputForm.remark"
                type="textarea"
                :placeholder="remarkPlaceHolder"
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
        <el-row v-if="!detailDisable">
          <el-col style="text-align: right">
            <el-button type="primary" plain @click="goBack">返 回</el-button>
            <el-button type="primary" @click="saveBtn">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="znp-tables-wrap">
      <div class="common-person">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="车辆档案" name="van">
            <Van
              :table-data="vanTableData"
              :detail-disable="detailDisable"
              :owner-vo="inputForm"
              owner-type="1"
              @queryVoById="queryVoById"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { addObj, getObj, putObj } from '@/api/trader'
import { getSelectKindsList, getSelectKindsByParentId } from '@/api/category'
import { remote } from '@/api/admin/dict'
import Van from '@/views/entity/van/components/vanListPage'// 车辆档案
export default {
  name: 'TraderDetail',
  components: { Van },
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.operateType === 'add' && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
      }
      callback()
    }
    var checkIdNumValid = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号码'))
      } else {
        // 校验身份证号码的准确性
        if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
          callback(new Error('输入身份证号码不合法'))
        }
      }
      callback()
    }
    return {
      activeName: 'van',
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '选填',
      selectOptions: {
        traderType: [], // 采购商类型
        saleType: [], // 经营类型
        operationTypesKindsList: [], // 经营业态
        kindsList: [] // 主营品类
      },
      inputForm: {
        id: 0,
        traderCode: '', // 采购商编码
        traderName: '', // 采购商名称
        typeId: '0', // 采购商类型
        saletypeId: '', // 经营类型
        operationtypesKindsId: '', // 经营业态
        kindsId: '', // 主营品类
        companyName: '', // 企业名称
        contactName: '', // 联系人姓名
        phoneNum: '', // 联系人手机号
        idNum: '', // 身份证号
        remark: '' // 备注
      },
      inputFormRules: {
        traderCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        traderName: [
          { required: true, message: '请输入采购商名称', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择采购商类型', trigger: 'change' }
        ],
        saletypeId: [
          { required: true, message: '请选择经营类型', trigger: 'change' }
        ],
        operationtypesKindsId: [
          { required: true, message: '请选择经营业态', trigger: 'change' }
        ],
        kindsId: [
          { required: true, message: '请选择主营品类', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请输入营业执照上的企业名称', trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (/^1[34578]\d{9}$/.test(value) === false) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        idNum: [
          { required: true, validator: checkIdNumValid, trigger: 'blur' }
        ]
      },
      vanTableData: [], // 车辆数据表
      baseObj: {
        flag: 'add' // 添加那行的标记
      }
    }
  },
  computed: {
    detailDisable() {
      return this.$route.query.operateType === 'look'
    },
    editDisable() {
      return this.$route.query.operateType === 'edit'
    },
    addDisable() {
      return this.$route.query.operateType === 'add'
    }
  },
  watch: {
    '$route.id': {
      handler() {
        if (this.$route.path === '/trader/detail') {
          this.$refs['inputFormRef'].clearValidate()
          // 获取下拉框数据
          this.getSelectList()
          // 修改产品进来的话
          const info = this.$route.query
          if (info.id) {
            // 加载商品详细信息
            this.queryVoById(info)
          } else {
            // 新增的时候填充车辆数据
            this.vanTableData = []
            this.vanTableData.push(this.baseObj)
          }
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    },
    $route(to, from) {
      if (from.query.operateType !== 'add' && to.path !== '/trader/detail') {
        this.$refs['inputFormRef'].resetFields()
      }
    }
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 修改产品进来的话
    const info = this.$route.query
    if (info.id) {
      // 加载商品详细信息
      this.queryVoById(info)
    } else {
      // 新增的时候填充车辆数据
      this.vanTableData = []
      this.vanTableData.push(this.baseObj)
    }
  },
  methods: {
    getSelectList() {
      // 采购商类型
      remote('merchant_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.traderType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 经营类型
      remote('sale_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.saleType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 经营业态(level = 0 只查询第1级)
      getSelectKindsList('0').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.operationTypesKindsList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 根据选择的经营业态查询主营品类列表
    operationTypesKindsChange(val) {
      getSelectKindsByParentId(val).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.kindsList = res.data.data
          if (this.selectOptions.kindsList.length <= 0) {
            this.inputForm.kindsId = ''
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 查看
    queryVoById() {
      getObj(this.$route.query.id || this.inputForm.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm = res.data.data
          this.operationTypesKindsChange(this.inputForm.operationtypesKindsId)
          this.inputForm.typeId = this.inputForm.typeId + ''
          this.inputForm.saletypeId = this.inputForm.saletypeId + ''
          // 清空采购商编码
          if (this.addDisable) {
            this.inputForm.traderCode = ''
          }
          // 车辆
          this.vanTableData = []
          this.vanTableData = res.data.data.vanList
          if (!this.detailDisable) {
            this.vanTableData.push(this.baseObj)
          }
        } else {
          this.$message.error('查询采购商失败，请联系系统管理员')
        }
      })
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.addDisable) {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.inputForm.id = res.data.data.id
                this.queryVoById()
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
                this.queryVoById()
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
    // 返回
    goBack() {
      this.$router.push({ path: '/entity/trader/index' })
      // this.$router.go(-1)// 返回上一层
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
</style>
