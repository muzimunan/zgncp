<template>
  <div class="estate-board">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="areaId">
          <el-select v-model="formParams.areaId" placeholder="区域名称" filterable clearable @change="areaChange">
            <el-option v-for="item in selectOptions.areaList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="" prop="typeId">
          <el-select v-model="formParams.typeId" placeholder="物业类型" filterable clearable>
            <el-option
                v-for="item in selectOptions.estateTypeList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
          </el-select>
        </el-form-item> -->
        <el-form-item label="" prop="estateCodeAndName">
          <el-input v-model="formParams.estateCodeAndName" placeholder="物业编码/名称" clearable />
        </el-form-item>
        <el-form-item label="" prop="typeId">
          <el-select v-model="formParams.isOpen" placeholder="是否开门" clearable>
            <el-option value="0" label="否" />
            <el-option value="1" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="searchDataFun()">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px; text-align: right">
        <el-button
          v-if="formParams.areaName && formParams.planGraph"
          type="text"
          style="text-decoration: underline"
          size="small"
          @click.stop="previewImg"
        >
          区域规划图
        </el-button>
      </div>
      <el-row v-loading="tableLoading" style="min-height: 450px">
        <el-col v-for="item in tableData" :key="item.id" :xs="12" :sm="8" :md="6" :lg="2" style="min-width: 167px">
          <el-card
            class="box-card estate-board-item"
            shadow="hover"
            style="margin-right: 20px"
            :class="{ 'have-bg': item.status === 1 }"
          >
            <div class="merchant-or-investor-name estate-name">
              <span title="物业名称" @click="operateData('look', item)">{{ item.estateName }}</span>
              <span>
                <el-checkbox
                  v-model="item.isOpen"
                  true-label="1"
                  false-label="0"
                  :disabled="!permissions.entity_kanban_open_add"
                  @change="
                    val => {
                      updateOpenStatus(val, item)
                    }
                  "
                >
                  开门
                </el-checkbox>
              </span>
            </div>
            <div class="merchant-or-investor-name">
              {{ item.areaName }}
            </div>
            <!-- <div>{{item.estateCode}}</div> -->
            <!-- <div class="item-footer"><span>{{item.statusName}}</span><span>2021-12-06</span></div> -->
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 图片预览-->
    <el-dialog :visible.sync="dialogImage.visible" width="1000px">
      <div class="imgWraper">
        <img width="100%" :src="url + formParams.planGraph" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOpenList, updateOpenStatus } from '@/api/kanban'
import { getEstateTypeList } from '@/api/estate-type'
import { getSelectAreaList } from '@/api/area'
import { mapGetters } from 'vuex'
export default {
  name: 'EstateBoard',
  components: {
  },
  data() {
    return {
      // eslint-disable-next-line no-undef
      url: process.env.VUE_APP_FILE_API,
      tableLoading: true, // loading
      dialogImage: {
        visible: false
      }, // 预览图片对象
      dialog: {
        title: '状态变更',
        visible: false
      },
      formParams: {
        planGraph: '', // 区域规划图
        areaId: '', // 区域名称
        typeId: '', // 物业类型
        estateCodeAndName: '', // 物业编码/名称
        isOpen: '' // 是否开门
      },
      tableData: [],
      selectOptions: {
        areaList: [], // 区域
        estateTypeList: [] // 物业类型
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    detailDisable() {
      return this.operateType === 'look'
    },
    editDisable() {
      return this.operateType === 'edit'
    }
  },
  watch: {
  },
  created() {
    // 获取下拉框数据
    this.getSelectList()
    // 获取列表数据
    this.searchDataFun()
  },
  methods: {
    getSelectList() {
      // 一级区域
      getSelectAreaList('0').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.areaList = res.data.data
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
    },
    // 区域选择存储区域规划图链接
    areaChange(val) {
      const obj = this.selectOptions.areaList.find((item) => {
        return item.id === val
      })
      this.formParams.planGraph = obj.planGraph
    },
    // 查询列表
    searchDataFun() {
      this.tableLoading = true
      const pageQueryVo = {
        areaId: this.formParams.areaId || undefined,
        typeId: this.formParams.typeId || undefined,
        estateCodeAndName: this.formParams.estateCodeAndName || undefined,
        isOpen: this.formParams.isOpen || undefined
      }
      getOpenList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
        this.tableLoading = false
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
    },
    // 状态变更
    updateOpenStatus(val, item) {
      updateOpenStatus({
        estateId: item.id,
        isOpen: val
      }).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.$message.success('状态变更成功')
          this.searchDataFun()
        } else {
          this.$message.error(res.data.msg)
          item.isOpen = 0
        }
      })
    },
    // 图片预览
    previewImg() {
      this.dialogImage.visible = true
    },
    // 查看物业详情
    operateData(type, item) {
      this.$router.push({
        path: '/eatate/detail',
        query: {
          operateType: type,
          id: (type === 'edit' || type === 'look') ? item.id : undefined
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.estate-board {
  .znp-filter-container {
    //text-align: right;
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
  .estate-board-item {
    ::v-deep .el-card__body {
      padding: 10px 20px 5px 20px;
    }
    font-size: 14px;
    div {
      margin-bottom: 5px;
    }
    .merchant-or-investor-name {
      display: flex;
      justify-content: space-between;
      span:nth-child(1) {
        cursor: pointer;
        display: inline-block;
        width: 90%;
        height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .estate-name {
      color: #409eff;
    }
    .item-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
  }
  .have-bg {
    background-color: #f5f5f5;
  }
}
</style>
