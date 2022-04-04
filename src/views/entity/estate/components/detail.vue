<template>
  <div class="estate-detail-info">
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
            <p class="form-title">{{ addDisable ? '新增物业档案' : editDisable ? '修改物业档案' : '查看物业档案' }}</p>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item class="form-item-block-title" label="基本信息"></el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" v-if="!addDisable">
            <el-form-item label="物业编码" prop="estateCode" class="znp-remove-start">
              <el-input
                v-model="inputForm.estateCode"
                placeholder="自动生成，可自定义……"
                maxlength="13"
                show-word-limit
                clearable
                :disabled="detailDisable || editDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="物业名称" prop="estateName">
              <el-input
                v-model="inputForm.estateName"
                placeholder="字数不能超过20个汉字"
                maxlength="20"
                show-word-limit
                clearable
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="所属类型" prop="typeId">
              <el-select
                v-model="inputForm.typeId"
                clearable
                placeholder="请选择物业类型"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.estateTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="所属区域" prop="areaId">
              <el-select
                v-model="inputForm.areaId"
                clearable
                placeholder="请选择区域"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option v-for="item in selectOptions.areaList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="位置" prop="address">
              <el-input v-model="inputForm.address" placeholder="请输入位置" clearable :disabled="detailDisable" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="楼号" prop="buildingNum">
              <el-select
                v-model="inputForm.buildingNum"
                clearable
                placeholder="请选择楼号信息"
                :disabled="detailDisable"
                style="width: 100%"
                @change="buildingChange"
              >
                <el-option
                  v-for="(item, index) in selectOptions.buildingList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="层号" prop="floor">
              <el-select
                v-model="inputForm.floor"
                clearable
                placeholder="请选择层号信息"
                :disabled="detailDisable"
                style="width: 100%"
                @change="floorChange"
              >
                <el-option
                  v-for="(item, index) in selectOptions.floorList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="块号" prop="block">
              <el-select
                v-model="inputForm.block"
                clearable
                placeholder="请选择块号信息"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in selectOptions.blockList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="建筑面积" prop="buidingAcr">
              <el-input v-model="inputForm.buidingAcr" placeholder="请输入建筑面积" clearable :disabled="detailDisable">
                <template slot="suffix">m²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="可用面积" prop="">
              <el-input
                v-model="inputForm.avaiableAcr"
                placeholder="请输入可用面积"
                clearable
                :disabled="detailDisable"
              >
                <template slot="suffix">m²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item class="form-item-block-title" label="经营信息"></el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="使用状态" prop="status">
              <el-select
                v-model="inputForm.status"
                clearable
                placeholder="请选择初始状态"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.useStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="所有权" prop="owner">
              <el-select
                v-model="inputForm.owner"
                clearable
                placeholder="请选择所有权"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.ownerShipType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="是否可售" prop="isSale">
              <el-select
                v-model="inputForm.isSale"
                clearable
                placeholder="请选择是否可售"
                :disabled="detailDisable"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.flagType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="开售日期">
              <el-date-picker
                v-model="inputForm.saleDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择开售日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="开租日期">
              <el-date-picker
                v-model="inputForm.rentDate"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="请选择开租日期"
                :disabled="detailDisable"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="出租面积" prop="useAcr">
              <el-input v-model="inputForm.useAcr" placeholder="请输入出租面积" clearable :disabled="detailDisable">
                <template slot="suffix">m²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="合同面积" prop="contractAcr">
              <el-input
                v-model="inputForm.contractAcr"
                placeholder="请输入合同面积"
                clearable
                :disabled="detailDisable"
              >
                <template slot="suffix">m²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="参考售价" prop="refPrice" class="znp-remove-start">
              <el-input v-model="inputForm.refPrice" placeholder="请输入参考售价" clearable :disabled="detailDisable">
                <template slot="suffix">元/平米</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12">
            <el-form-item label="参考租金" prop="refRent" class="znp-remove-start">
              <el-input v-model="inputForm.refRent" placeholder="请输入参考租金" clearable :disabled="detailDisable">
                <template slot="suffix">元/天/平米</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <el-form-item label="物业照片" prop="f15">
              <el-upload
                ref="imgUpload"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadRequest"
                :limit="1"
                :disabled="detailDisable"
              >
                <el-button size="small" :disabled="detailDisable" type="primary">
                  上传图片
                  <i class="el-icon-upload el-icon--right" />
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
              </el-upload>
              <div v-if="inputForm.picture" class="bg-image">
                <div class="block">
                  <el-image fit="cover" :src="url + inputForm.picture" />
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
        <el-row>
          <el-col v-if="!detailDisable" style="text-align: right">
            <el-button type="primary" plain @click="goBack">返 回</el-button>
            <el-button type="primary" @click="saveBtn">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="detailDisable" class="znp-tables-wrap">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="出租合同" name="rent">
          <el-table :data="rentContractList" style="width: 100%" border size="small">
            <el-table-column label="合同编码" width="180px">
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="gotoDetail('rentcontract', scope.row.id)">
                  {{ scope.row.contractCode }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="开始日期" />
            <el-table-column prop="endDate" label="结束日期" />
            <el-table-column label="商户名称">
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="gotoDetail('merchant', scope.row.merchantId)">
                  {{ scope.row.merchantName }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="是否到期" width="90px">
              <template slot-scope="scope">
                <span v-if="parseInt(scope.row.contractStatus) === 1">{{ scope.row.contractStatusName }}</span>
                <span v-else style="color: red">{{ scope.row.contractStatusName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contractNum" label="原合同编号" width="180px" />
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
            <el-table-column label="业主名称">
              <template slot-scope="scope">
                <el-link :underline="false" type="primary" @click="gotoDetail('investor', scope.row.investorId)">
                  {{ scope.row.investorName }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="contractNum" label="纸质合同号" width="180px" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { addObj, getObj, putObj } from '@/api/estate'
import { importFile } from '@/api/upload'
import { getEstateTypeList } from '@/api/estate-type'
import { getSelectAreaList } from '@/api/area'
import { remote } from '@/api/admin/dict'
import { fetchList as getSelectBuildingList } from '@/api/building'
import { rule } from '@/util/validateRules'
export default {
  name: 'EstateDetail',
  data() {
    const _that = this
    var checkCodeValid = (rule, value, callback) => {
      if (_that.addDisable && value && !(/^[0-9a-zA-Z_]{1,}$/.test(value))) {
        callback(new Error('字母、数字、横线组成'))
      }
      callback()
    }
    // 参考租金
    var checkRefRentValid = (rule, value, callback) => {
      if (value && !(/(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value))) {
        callback(new Error('请输入大于等于0的数字，最多两位小数'))
      }
      callback()
    }
    // 参考售价
    var checkRefPriceValid = (rule, value, callback) => {
      if (value && !(/(^[0-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value))) {
        callback(new Error('请输入大于等于0的数字，最多两位小数'))
      }
      callback()
    }
    return {
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      remarkPlaceHolder: '选填',
      activeName: 'rent',
      selectOptions: {
        flagType: [], // 是否
        areaList: [], // 所属区域
        useStatus: [], // 使用状态
        ownerShipType: [], // 所有权
        estateTypeList: [], // 物业类型
        buildingList: [], // 楼号集合
        floorList: [], // 层号集合
        blockList: [] // 快号集合
      },
      inputForm: {
        estateCode: '', // 物业编码
        estateName: '', // 物业名称
        address: '', // 位置
        areaId: '', // 区域id
        buildingNum: '', // 楼号
        floor: '', // 层号
        block: undefined, // 块号
        owner: '0', // 所有权
        typeId: '', // 物业类型id
        status: '0', // 状态
        buidingAcr: '', // 建筑面积
        avaiableAcr: '', // 可用面积
        contractAcr: '', // 合同面积
        useAcr: '', // 出租面积
        sharedRatio: '', // 公摊率
        refRent: '', // 参考租金
        refPrice: '', // 参考售价
        saleDate: '', // 开售日期
        rentDate: '', // 开租日期
        isSale: '0', // 是否可售
        picture: '', // 资源图片
        remark: '' // 备注
      },
      inputFormRules: {
        estateCode: [
          { required: true, validator: checkCodeValid, trigger: 'blur' }
        ],
        estateName: [
          { required: true, message: '请输入物业名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入位置', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择所属区域', trigger: 'change' }
        ],
        buildingNum: [
          { required: true, message: '请输入楼号信息', trigger: 'change' }
        ],
        floor: [
          { required: true, message: '请输入层号信息', trigger: 'change' }
        ],
        typeId: [
          { required: true, message: '请选择所属类型', trigger: 'change' }
        ],
        owner: [
          { required: true, message: '请选择所有权', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择使用状态', trigger: 'change' }
        ],
        buidingAcr: [
          { required: true, message: '请填写建筑面积', trigger: 'blur' },
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ],
        avaiableAcr: [
          { required: true, message: '请填写可用面积', trigger: 'blur' },
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ],
        contractAcr: [
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ],
        useAcr: [
          { validator: rule.checkMoneyOrArea, trigger: 'blur' }
        ],
        refRent: [
          { required: true, validator: checkRefRentValid, trigger: 'blur' }
        ],
        refPrice: [
          { required: true, validator: checkRefPriceValid, trigger: 'blur' }
        ],
        isSale: [
          { required: true, message: '请选择是否可售', trigger: 'change' }
        ]
      },
      rentContractList: [], // 出租登记
      salesContractList: [] // 销售合同
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
        if (this.$route.path === '/eatate/detail') {
          this.$refs['inputFormRef'].clearValidate()
          // 获取下拉框数据
          this.getSelectList()
          // 修改产品进来的话
          const info = this.$route.query
          if (info.id) {
            // 加载商品详细信息
            this.queryVoById(info)
          }
        }
      },
      // 对象内部的属性监听，深度监听
      deep: true
    },
    $route(to, from) {
      if (from.query.operateType !== 'add' && to.path !== '/eatate/detail') {
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
    }
  },
  methods: {
    getSelectList() {
      // 区域
      getSelectAreaList('0').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.areaList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 是否
      remote('flag_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.flagType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 物业类型
      getEstateTypeList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.estateTypeList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 所有权
      remote('owner_ship_type').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.ownerShipType = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 使用状态
      remote('use_status').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.useStatus = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
      // 楼下拉信息
      getSelectBuildingList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.buildingList = res.data.data
        } else {
          this.$message.error(res.data.msg)
          this.selectOptions.buildingList = []
          this.selectOptions.floorList = []
          this.selectOptions.blockList = []
        }
      })
    },
    // 楼号变更赋值层号下拉框
    buildingChange(val) {
      const obj = this.selectOptions.buildingList.find((item) => {
        return item.id === val
      })
      this.selectOptions.floorList = obj.children
      this.selectOptions.blockList = []
      this.inputForm.floor = ''
      this.inputForm.block = ''
    },
    // 层号变更赋值块号下拉框
    floorChange(val) {
      const obj = this.selectOptions.floorList.find((item) => {
        return item.id === val
      })
      this.selectOptions.blockList = obj.children
      this.inputForm.block = ''
    },
    // 查看
    queryVoById() {
      getObj(this.$route.query.id).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm = res.data.data
          // 所有的下拉框转换为字符串
          this.inputForm.owner = this.inputForm.owner + '' // 所有权
          this.inputForm.status = this.inputForm.status + '' // 状态
          this.inputForm.isSale = this.inputForm.isSale + '' // 是否可售
          this.inputForm.block = this.inputForm.block ? this.inputForm.block : undefined
          this.rentContractList = this.inputForm.rentContractList
          this.salesContractList = this.inputForm.salesContractList
          this.inputForm.salesContractList = undefined
          this.inputForm.rentContractList = undefined
          setTimeout(() => {
            // 层下拉列表
            const buildingObj = this.selectOptions.buildingList.find((item) => {
              return item.id === this.inputForm.buildingNum
            })
            this.selectOptions.floorList = buildingObj.children
            // 块下拉列表查询
            const floorObj = this.selectOptions.floorList.find((item) => {
              return item.id === this.inputForm.floor
            })
            this.selectOptions.blockList = floorObj.children
          }, 500)
        } else {
          this.$message.error('查询物业档案失败，请联系系统管理员')
        }
      })
    },
    // 新增/编辑 保存数据
    saveBtn() {
      this.$refs['inputFormRef'].validate((valid) => {
        if (valid) {
          if (this.inputForm.block && this.inputForm.block < 0) { this.$message.error('块号不可为负数') }
          if (this.addDisable) {
            addObj(this.inputForm).then(res => {
              if (res && parseInt(res.data.code) === 0) {
                this.$message.success('新增成功')
                this.inputForm.id = res.data.data.id
                // this.queryVoById()
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
    // 页面跳转相关 begin
    // 返回
    goBack() {
      // this.$router.go(-1)// 返回上一层
      // this.$router.push({path: '/entity/estate/index'})
      // 返回商品管理列表页面
      this.$router.push({ path: '/entity/estate/index' })
    },
    gotoDetail(type, id) {
      let path = ''
      if (type === 'merchant') {
        path = '/merchant/detail'
      } else if (type === 'investor') {
        path = '/investor/detail'
      } else if (type === 'rentcontract') {
        path = '/rentContract/detail'
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

    // 上传图片相关 begin
    uploadRequest(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.file)
      importFile(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.inputForm.picture = res.data.data.url
        } else {
          this.$message.error(res.data.msgg)
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
.estate-detail-info {
  .go-back {
    font-size: 14px;
  }
  ::v-deep .form-item-block-title .el-form-item__label {
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
