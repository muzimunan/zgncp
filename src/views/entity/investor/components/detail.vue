<template>
  <div class="investor-info">
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
            <p class="form-title">{{ addDisable ? '新增业主' : editDisable ? '修改业主' : '查看业主' }}</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="业主编码" prop="investorCode" class="znp-remove-start" v-if="!addDisable">
              <el-input
                v-model="inputForm.investorCode"
                placeholder="自动生成，可自定义……"
                maxlength="13"
                show-word-limit
                clearable
                :disabled="detailDisable || editDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="业主名称" prop="investorName">
              <el-input
                v-model="inputForm.investorName"
                placeholder="字数不能超过20个汉字"
                maxlength="20"
                show-word-limit
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="业主类型" prop="typeId">
              <el-select
                v-model="inputForm.typeId"
                placeholder="请选择业主类型"
                :disabled="detailDisable"
                style="width: 100%"
                @change="typeChange"
              >
                <el-option
                  v-for="item in selectOptions.investorType"
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
                @change="saleTypeChange"
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
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="业主性质" prop="qualitativeId">
              <el-select
                v-model="inputForm.qualitativeId"
                clearable
                placeholder="请选择业主性质"
                :disabled="detailDisable"
                style="width: 100%"
                @change="qualitativeChange"
              >
                <el-option
                  v-for="item in selectOptions.qualitativeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <div v-if="inputForm.qualitativeId === '1'">
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
              <el-form-item label="经营业态">
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
              <el-form-item label="主营品类">
                <el-select
                  multiple
                  collapse-tags
                  v-model="inputForm.kindsIds"
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
          </div>
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
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="法人姓名" prop="ceoName">
                <el-input
                  v-model="inputForm.ceoName"
                  placeholder="请输入营业执照上的法人姓名"
                  clearable
                  :disabled="detailDisable"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="统一信用代码" prop="creditCode">
                <el-input
                  v-model="inputForm.creditCode"
                  placeholder="请输入营业执照上的统一信用代码"
                  clearable
                  :disabled="detailDisable"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <el-form-item label="注册地址" prop="address">
                <el-input
                  v-model="inputForm.address"
                  placeholder="请输入营业执照上的注册地址"
                  clearable
                  :disabled="detailDisable"
                />
              </el-form-item>
            </el-col>
          </div>
          <!-- <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="身份证号" prop="idNum">
              <el-input
                v-model="inputForm.idNum"
                placeholder="请输入正确的身份证号"
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="资质与证件一">
              <el-upload
                ref="imgUpload1"
                action="#"
                :before-upload="beforeUpload"
                :http-request="
                  file => {
                    return uploadRequest(file, 'one')
                  }
                "
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
              <div v-if="inputForm.idPicture1" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.idPicture1" />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="资质与证件二" prop="f15">
              <el-upload
                ref="imgUpload2"
                action="#"
                :before-upload="beforeUpload"
                :http-request="
                  file => {
                    return uploadRequest(file, 'two')
                  }
                "
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
              <div v-if="inputForm.idPicture2" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.idPicture2" />
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="资质与证件三" prop="f15">
              <el-upload
                ref="imgUpload3"
                action="#"
                :before-upload="beforeUpload"
                :http-request="
                  file => {
                    return uploadRequest(file, 'three')
                  }
                "
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
              <div v-if="inputForm.idPicture3" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.idPicture3" />
                </div>
              </div>
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
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="联系人" name="concat">
          <el-table :data="personTableData" style="width: 100%" border size="small">
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
                      v-if="permissions.entity_investorcontact_add"
                      :disabled="!inputForm.id"
                      size="mini"
                      type="text"
                      @click.stop="operatePersomData('add', scope.row)"
                    >
                      添加
                    </el-button>
                  </div>
                  <div v-else>
                    <el-button
                      v-if="permissions.entity_investorcontact_edit"
                      size="mini"
                      type="text"
                      @click.stop="operatePersomData('edit', scope.row)"
                    >
                      修改
                    </el-button>
                    <el-button
                      v-if="permissions.entity_investorcontact_del"
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
                    v-if="permissions.entity_investorcontact_view"
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
        </el-tab-pane>
        <el-tab-pane label="销售合同" name="sale">
          <el-table :data="salesContractList" style="width: 100%" border size="small">
            <el-table-column label="合同编码" width="180px">
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="gotoDetail('salescontract', scope.row.id)">
                  {{ scope.row.contractCode }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="开始日期" />
            <el-table-column prop="endDate" label="结束日期" />
            <el-table-column prop="investorName" label="业主名称">
              <!-- <template slot-scope="scope">
              <el-link :underline="false" @click="gotoDetail('investor',scope.row.investorId)" type="primary">{{scope.row.investorName}}</el-link>
            </template> -->
            </el-table-column>
            <el-table-column prop="contractNum" label="纸质合同号" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加/编辑联系人 -->
    <addPerson :contact-dialog="contactdialog" @setDialogVisiable="setDialogVisiable" />
  </div>
</template>

<script>
import { addObj, getObj, putObj } from '@/api/investor'
import { delContactObj } from '@/api/investor-contact'
import { getSelectKindsList, getSelectKindsByParentId } from '@/api/category'
import { importFile } from '@/api/upload'
import { remote } from '@/api/admin/dict'
import addPerson from './addPerson'// 【添加或者编辑联系人】
import { mapGetters } from 'vuex'
export default {
  name: 'InvestorDetail',
  components: { addPerson },
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.addDisable && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
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
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '选填',
      selectOptions: {
        qualitativeList: [], // 业主性质
        investorType: [], // 业主类型
        saleType: [], // 经营类型
        operationTypesKindsList: [], // 经营业态
        kindsList: []// 主营品类
      },
      activeName: 'concat',
      inputForm: {
        id: '',
        investorCode: '', // 业主编码
        investorName: '', // 业主名称
        typeId: '0', // 业主类型
        typeLabel: '企业', // 业务类型名称
        saletypeId: '', // 经营类型
        saletypeLabel: '', // 经营类型名称
        qualitativeId: '', // 业主性质id
        qualitativeLabel: '', // 业主性质名称
        companyName: '', // 企业名称
        ceoName: '', // 法人姓名
        creditCode: '', // 统一信用代码
        address: '', // 注册地址
        idNum: '', // 身份证号
        idPicture1: '', // 资质与证件一
        idPicture2: '', // 资质与证件二
        idPicture3: '', // 资质与证件三
        remark: '', // 备注
        operationtypesKindsId: '',
        kindsIds: []
      },
      inputFormRules: {
        investorCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        investorName: [
          { required: true, message: '请输入业主名称', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择业主类型', trigger: 'change' }
        ],
        saletypeId: [
          { required: true, message: '请选择经营类型', trigger: 'change' }
        ],
        qualitativeId: [
          { required: true, message: '请选择业主性质', trigger: 'change' }
        ],
        operationtypesKindsId: [
          { required: true, message: '请选择经营业态', trigger: 'change' }
        ],
        kindsIds: [
          { required: true, message: '请选择主营品类', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入营业执照上的企业名称', trigger: 'blur' }
        ],
        ceoName: [
          { required: true, message: '请输入营业执照上的法人姓名', trigger: 'blur' }
        ],
        creditCode: [
          { required: true, message: '请输入营业执照上的统一信用代码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入营业执照上的注册地址', trigger: 'blur' }
        ],
        idNum: [
          { required: true, validator: checkIdNumValid, trigger: 'blur' }
        ],
        idPicture1: [
          { required: true, message: '请上传资质与证件', trigger: 'blur' }
        ]
      },
      contactdialog: {
        title: '新增联系人',
        visible: false,
        operateType: 'add',
        vo: {
          investorId: '',
          contactName: '', // 联系人姓名
          phone: '', // 手机号
          wechat: '', // 微信号
          email: '', // 邮箱
          address: '', // 常住地址
          idNum: '', // 身份证号
          idFront: '', // 身份证照片正面
          idBack: '' // 身份证照片反面
        } // 联系人信息
      }, // 添加或编辑联系人弹框
      personTableData: [], // 联系人数据表
      salesContractList: [], // 销售合同
      basePersonObj: {
        contactName: '', // 联系人姓名
        phone: '', // 手机号
        wechat: '', // 微信号
        email: '', // 邮箱
        address: '', // 常住地址
        idNum: '', // 身份证号
        flag: 'add' // 添加那行的标记
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
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
        if (this.$route.path === '/investor/detail') {
          this.$refs['inputFormRef'].clearValidate()
          // 获取下拉框数据
          this.getSelectList()
          // 修改产品进来的话
          const info = this.$route.query
          if (info.id) {
            // 加载商品详细信息
            this.queryVoById(info)
          } else {
            // 新增的时候填充联系人表数据
            this.personTableData = []
            this.personTableData.push(this.basePersonObj)
          }
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    },
    $route(to, from) {
      if (from.query.operateType !== 'add' && to.path !== '/investor/detail') {
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
      // 新增的时候填充联系人表数据
      this.personTableData = []
      this.personTableData.push(this.basePersonObj)
    }
  },
  methods: {
    getSelectList() {
      // 业主类型
      remote('investor_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.investorType = res.data.data
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
      // 业主性质
      remote('investor_qualitative').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.qualitativeList = res.data.data
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
      this.inputForm.kindsIds = []
      this.getSelectKindsByParentId(val)
    },
    getSelectKindsByParentId(val) {
      getSelectKindsByParentId(val).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.kindsList = res.data.data
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
          this.inputForm.typeId = this.inputForm.typeId + ''
          this.inputForm.saletypeId = this.inputForm.saletypeId + ''
          this.inputForm.qualitativeId = this.inputForm.qualitativeId + ''
          if (this.inputForm.qualitativeId === '1' && this.inputForm.operationtypesKindsId) {
            this.getSelectKindsByParentId(this.inputForm.operationtypesKindsId)
          }
          // 清空业主编码
          if (this.addDisable) {
            this.inputForm.investorCode = ''
          }
          // 联系人列表
          this.personTableData = []
          this.personTableData = res.data.data.investorContactList
          if (!this.detailDisable) {
            this.personTableData.push(this.basePersonObj)
          }
          // 销售合同
          this.salesContractList = res.data.data.salesContractList
        } else {
          this.$message.error('查询业主失败，请联系系统管理员')
        }
      })
    },
    // 业主类型修改(保存对应的lable)
    typeChange(val) {
      const obj = this.selectOptions.investorType.find((item) => {
        return item.value === val
      })
      this.inputForm.typeLabel = obj.label
    },
    // 销售类型修改(保存对应的lable)
    saleTypeChange(val) {
      const obj = this.selectOptions.saleType.find((item) => {
        return item.value === val
      })
      this.inputForm.saletypeLabel = obj.label
    },
    // 业主性质修改(保存对应的lable)
    qualitativeChange(val) {
      const obj = this.selectOptions.qualitativeList.find((item) => {
        return item.value === val
      })
      this.inputForm.qualitativeLabel = obj.label
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
    // 上传图片相关 begin
    uploadRequest(file, type) {
      const formData = new FormData()
      formData.append('file', file.file)
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          if (type === 'one') {
            this.inputForm.idPicture1 = res.data.data.url
          } else if (type === 'two') {
            this.inputForm.idPicture2 = res.data.data.url
          } else {
            this.inputForm.idPicture3 = res.data.data.url
          }
          this.$refs['inputFormRef'].clearValidate(['idPicture1'])
        } else {
          this.$message.error(res.data.msg)
        }
        // 上传成功之后清除历史记录
        this.$refs.imgUpload1.clearFiles()
        // 上传成功之后清除历史记录
        this.$refs.imgUpload2.clearFiles()
        // 上传成功之后清除历史记录
        this.$refs.imgUpload3.clearFiles()
      })
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
    // 页面跳转相关 begin
    // 返回
    goBack() {
      this.$router.push({ path: '/entity/investor/index' })
      // this.$router.go(-1)// 返回上一层
    },
    gotoDetail(type, id) {
      let path = ''
      if (type === 'merchant') {
        path = '/merchant/detail'
      } else if (type === 'investor') {
        path = '/investor/detail'
      } else if (type === 'salescontract') {
        path = '/salesContract/detail'
      }
      this.$router.push({
        path: path,
        query: {
          operateType: 'look',
          id: id
        }
      })
    },
    // 页面跳转相关 end
    // 联系人相关 begin
    operatePersomData(type, item) {
      item.investorId = this.inputForm.id
      if (type === 'add') {
        this.contactdialog = {
          title: '新增联系人',
          visible: true,
          operateType: 'add',
          vo: item
        }
      } else if (type === 'edit') {
        this.contactdialog = {
          title: '修改联系人',
          visible: true,
          operateType: 'edit',
          vo: item
        }
      } else if (type === 'look') {
        this.contactdialog = {
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
          delContactObj(item.id).then(res => {
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
      this.contactdialog.visible = data
      this.queryVoById()
    }
    // 联系人相关 end
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
</style>
