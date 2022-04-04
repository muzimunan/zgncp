<template>
  <div class="feebill-info">
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
          <el-col v-if="isView" :xs="24" :sm="24" :md="24" :lg="24" class="go-back">
            <el-link type="primary" @click="goBack">
              <i class="el-icon-d-arrow-left" />
              返回列表
            </el-link>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <p class="form-title">{{ isAdd ? '新增费用账单' : isEdit ? '修改费用账单' : '查看费用账单' }}</p>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="账单编码" prop="feebillCode" class="znp-remove-start" v-if="!isAdd">
              <el-input v-model="inputForm.feebillCode" placeholder="自动生成，可自定义" clearable :disabled="isView" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="商户名称" prop="merchantId">
              <el-select
                v-model="inputForm.merchantId"
                filterable
                style="width: 100%"
                placeholder="请选择商户"
                :disabled="isView"
                @change="merchantNameChange"
              >
                <el-option
                  v-for="item in selectOptions.merchantNameList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="收费项目" prop="feeformName">
              <el-select
                v-model="inputForm.feeformId"
                style="width: 100%"
                placeholder="请选择收费项目"
                clearable
                :disabled="isView"
                @change="feeformNameChange"
              >
                <el-option
                  v-for="item in selectOptions.feeformNameList"
                  :key="item.id"
                  :label="item.feeformName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="科目名称" prop="feeitemName">
              <el-input v-model="inputForm.feeitemName" placeholder="科目名称" maxlength="20" disabled />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="生成日期" prop="generateTime">
              <el-date-picker
                v-model="inputForm.generateTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="请选择生成日期"
                clearable
                :disabled="isView"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="账单状态" prop="feebillStatus">
              <el-select
                v-model="inputForm.feebillStatus"
                style="width: 100%"
                placeholder="请选择账单状态"
                clearable
                :disabled="isView || isAdd"
              >
                <el-option
                  v-for="item in selectOptions.feebillStatusList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="inputForm.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="请选择开始日期"
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="inputForm.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="请选择结束日期"
                :disabled="isView"
              />
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
                :disabled="isView"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div v-if="isView">
          <el-divider />
          <el-row>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建人">
                <el-input v-model="inputForm.createBy" :disabled="isView" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="创建时间">
                <el-input v-model="inputForm.createTime" :disabled="isView" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改人">
                <el-input v-model="inputForm.updateBy" :disabled="isView" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12">
              <el-form-item label="修改时间">
                <el-input v-model="inputForm.updateTime" :disabled="isView" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row>
          <el-col v-if="!isView" style="text-align: right">
            <el-button type="primary" plain @click="goBack">返 回</el-button>
            <el-button type="primary" @click="saveBtn">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-if="isView" class="znp-tables-wrap">
      <div class="rent-contract">
        <el-tabs v-model="activeName1" type="border-card">
          <el-tab-pane label="费用单" name="feebillitem">
            <feebillitem :table-data="feeBillDetailData" :feebill-item="inputForm" @queryVoById="fetchFeebillById" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { addObj, fetchDataById, putObj } from '@/api/feeBill'
import { getRemoteMerchantList } from '@/api/merchant'
import { getRemoteFeeformList } from '@/api/feeform'
import { remote } from '@/api/admin/dict'
import '@/assets/css/fileIcon/iconfont.js' // 自定义生成的文件icon  :detail-disable="isView"
import feebillitem from './feebillitem'// 费用单明细

export default {
  name: 'FeebillDetail',
  components: { feebillitem },
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.isAdd && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
      }
      callback()
    }

    var feeformNameValidator = (rule, value, callback) => {
      if (_that.isAdd) {
        if (!_that.inputForm.feeformId) {
          callback(new Error('请先选择商户'))
        } else if (!_that.inputForm.feeformId) {
          callback(new Error('请选择收费项目'))
        }
      }
      callback()
    }

    // 校验结束日期要大于等于开始日期
    var checkEndDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择结束日期'))
      } else {
        if (!_that.inputForm.startDate) {
          value = ''
          callback(new Error('请选择开始日期'))
        } else if (Date.parse(_that.inputForm.startDate) > Date.parse(value)) {
          callback(new Error('结束日期必须大于开始日期'))
        }
      }
      callback()
    }
    return {
      remarkPlaceHolder: '选填',
      selectOptions: {
        feebillStatusList: [], // 账单状态下拉列表
        feeformNameList: [], // 收费项目
        merchantNameList: [] // 商户名称
      },
      inputForm: {
        feebillCode: '', // 账单编码
        feeformId: null, // 收费项目id
        feeformName: '', // 收费项目名称
        marketCodename: '', // 关联市场
        merchantId: '', // 商户id
        merchantName: '', // 商户名称
        feeitemName: '', // 科目名称
        feebillStatus: 1, // 账单状态
        generateTime: '', // 生成日期
        startDate: '', // 开始日期
        endDate: '', // 结束日期
        remark: '', // 备注
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      inputFormRules: {
        feebillCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        merchantId: [
          { required: true, message: '请选择商户名称', trigger: 'blur' }
        ],
        feeformName: [
          { required: true, validator: feeformNameValidator, trigger: 'blur' }
        ],
        feeitemName: [
          { required: true, message: '请选择收费项目', trigger: 'blur' }
        ],
        feebillStatus: [
          { required: true, message: '请选择账单状态', trigger: 'blur' }
        ],
        generateTime: [
          { required: true, message: '请选择生成日期', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, validator: checkEndDate, trigger: 'blur' }
        ]
      },
      activeName1: 'feebillitem',
      feeBillDetailData: [], // 费用单
      baseObj: {
        flag: 'add' // 添加那行的标记
      }
    }
  },
  computed: {
    isView() {
      return this.$route.query.operateType === 'view'
    },
    isEdit() {
      return this.$route.query.operateType === 'edit'
    },
    isAdd() {
      return this.$route.query.operateType === 'add'
    }
  },
  watch: {},
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 修改产品进来的话
    const info = this.$route.query
    if (info.id) {
      // 加载商品详细信息
      this.fetchFeebillById(info.id)
    }
  },
  methods: {
    getSelectList() {
      getRemoteMerchantList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          if (res.data.data && res.data.data.length > 0) {
            const merchantData = res.data.data
            merchantData.map(item => {
              this.selectOptions.merchantNameList.push({
                value: item.id,
                name: item.merchantName
              })
            })
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
      remote('feebill_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          if (res.data.data.length > 0) {
            const dataList = res.data.data
            dataList.map(item => {
              this.selectOptions.feebillStatusList.push({
                value: parseInt(item.value),
                name: item.label
              })
            })
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 根据商户查询收费项目 begin
    merchantNameChange(value) {
      const selectedMerchant = this.selectOptions.merchantNameList.find((item) => {
        return item.value === value
      })
      this.inputForm.merchantName = selectedMerchant.name
      this.fetchFeeformNameList(value)
    },
    // 根据商户id查询收费项目的下拉框
    fetchFeeformNameList(merchantId) {
      getRemoteFeeformList(merchantId).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.feeformNameList = res.data.data
          // 如果下拉框没有当前的收费项目，将当前的收费项目id和name塞到收费项目下拉框中
          const index = this.selectOptions.feeformNameList.findIndex(o => o.id === this.inputForm.feeformId)
          if (index === -1 && this.inputForm.feeformId) {
            this.selectOptions.feeformNameList.push({ id: this.inputForm.feeformId, feeformName: this.inputForm.feeformName })
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 根据商户查询收费项目 end
    // 根据选择的收费项目显示收费科目
    feeformNameChange(value) {
      const obj = this.selectOptions.feeformNameList.find((item) => {
        return item.id === value
      })
      this.inputForm.feeformName = obj.feeformName
      this.inputForm.feeitemName = obj.feeitemName
    },
    // 修改和查看
    fetchFeebillById() {
      fetchDataById(this.$route.query.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm = res.data.data.data
          this.feeBillDetailData = this.inputForm.feebillDetailsList
          const queryParams = this.$route.query
          if (queryParams.operateType === 'view' || queryParams.operateType === 'edit') {
            this.fetchFeeformNameList(parseInt(this.inputForm.merchantId))
          }
        } else {
          this.$message.error('获取费用账单记录失败, 请联系系统管理员')
        }
      })
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
              } else {
                this.$message.error('新增失败,' + res.data.msg)
              }
            })
          } else {
            putObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('修改成功')
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
      this.$router.push({ path: '/entity/feeBill/index' })
    },
    // 跳转页面
    goto(type) {
      if (type === 'estate') {
        // 物业详情
        this.$router.push({
          path: '/eatate/detail',
          query: {
            operateType: 'view',
            id: this.inputForm.estateId
          }
        })
      } else {
        // 商户详情
        this.$router.push({
          path: '/merchant/detail',
          query: {
            operateType: 'view',
            id: this.inputForm.merchantId
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.feebill-info {
  ::v-deep .el-form-item__content {
    line-height: 30px !important;
  }
}
</style>
