<template>
  <div class="standing-book-detail">
    <div class="znp-filter-container">
      <el-form ref="formParams" size="small" :inline="true" :model="formParams">
        <el-form-item label="" prop="estateType">
          <el-select v-model="formParams.estateType" placeholder="物业类型" filterable clearable>
            <el-option
              v-for="item in selectOptions.estateTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="buildingNum">
          <el-select v-model="formParams.buildingNum" placeholder="楼号" filterable clearable>
            <el-option
              v-for="(item, index) in selectOptions.buildingList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="" prop="ownership">
          <el-select v-model="formParams.ownership" placeholder="所有权" filterable clearable>
            <el-option
              v-for="item in selectOptions.ownerShipType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="" prop="useStatus">
          <el-select v-model="formParams.useStatus" placeholder="使用状态" filterable clearable>
            <el-option
              v-for="item in selectOptions.useStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-button type="primary" size="small" @click="handlerSearch(1)">查询</el-button>
          <el-button type="default" size="small" @click="resetSearch('formParams')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="znp-table-container content-p24">
      <div style="margin-bottom: 16px">
        <el-button type="success" size="mini" @click="exportExcel()" v-if="permissions.entity_rentstandingbook_export">
          导出
        </el-button>
      </div>
      <el-table ref="report-table" :data="tableData" style="width: 100%" v-loading="tableLoading" align="center">
        <el-table-column :label="tableTitle" align="center">
          <el-table-column prop="rowNO" label="序号" align="center"></el-table-column>
          <el-table-column prop="buildingNumName" label="楼号(-单元号)" align="center"></el-table-column>
          <el-table-column prop="floorName" label="层号/通道号" align="center"></el-table-column>
          <el-table-column prop="boothNO" label="铺位号/摊位号" align="center"></el-table-column>
          <el-table-column prop="propertyOwnership" label="物业权属" align="center"></el-table-column>
          <el-table-column prop="buildingAcr" label="面积m²" align="center"></el-table-column>
          <el-table-column prop="operationKindsName" label="经营业态" align="center"></el-table-column>
          <el-table-column prop="contactName" label="客户姓名" align="center"></el-table-column>
          <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
          <el-table-column label="租赁标准(元/年)" align="center">
            <el-table-column prop="refRent" label="租金" align="center"></el-table-column>
            <el-table-column prop="date" label="保证金" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="租赁合同信息" align="center">
            <el-table-column prop="rentStartDate" label="租赁起始日" align="center"></el-table-column>
            <el-table-column prop="rentEndDate" label="租赁到期日" align="center"></el-table-column>
            <el-table-column prop="rentPrice" label="租金/元" align="center"></el-table-column>
            <el-table-column prop="deposit" label="保证金/元" align="center"></el-table-column>
            <el-table-column prop="propertyFee" label="物业费/元" align="center"></el-table-column>
            <el-table-column prop="contractPrice" label="合同总金额" align="center"></el-table-column>
            <el-table-column prop="rentPayType" label="付款方式" align="center"></el-table-column>
          </el-table-column>
          <el-table-column prop="payTime" label="交款日期" align="center"></el-table-column>
          <!-- <el-table-column prop="isPay" label="是否欠费" align="center"></el-table-column> -->
          <el-table-column prop="date" label="优惠政策" align="center"></el-table-column>
          <el-table-column prop="date" label="备注" show-overflow-tooltip align="center"></el-table-column>
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
  </div>
</template>
<script>
import { getEstateTypeList } from '@/api/estate-type'
import { remote } from '@/api/admin/dict'
import { getSelectBuildingList } from '@/api/building'
import { fetchList } from '@/api/rentstandingbook'
import { exportRentstandingbook, exportExcelCb } from '@/api/export'
import pagination from '@/components/Pagination' // 分页
import { mapGetters } from 'vuex'
export default {
  name: 'StandingBookDetail',
  components: { pagination },
  data() {
    return {
      tableTitle: '',
      formParams: {
        estateType: '', // 物业类型
        buildingNum: '', // 所属楼号
        ownership: '', // 所有权
        useStatus: '' // 使用状态
      },
      selectOptions: {
        useStatus: [], // 使用状态
        ownerShipType: [], // 所有权
        estateTypeList: [], // 物业类型
        buildingList: [] // 楼号集合
      },
      listQuery: {
        size: 20, // 每页显示多少条
        current: 1 // 当前页数
      },
      total: 0, // 总条数
      tableLoading: true, // loading
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo'])
  },
  watch: {
  },
  created() {
    // 获取列表数据
    this.tableTitle = '中国农批' + this.userInfo.marketName + this.userInfo.yearByWeek + '年物业租赁台账明细表'
    this.handlerSearch(1)
    // 获取下拉框数据
    this.getSelectList()
  },
  methods: {
    getSelectList() {
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
      // 楼层 参数传0 代表只查询楼层
      getSelectBuildingList(0).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.buildingList = res.data.data
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
        estateType: this.formParams.estateType || undefined,
        buildingNum: this.formParams.buildingNum || undefined,
        ownership: this.formParams.ownership || undefined,
        useStatus: this.formParams.useStatus || undefined
      }
      fetchList(pageQueryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.msgg)
        }
        this.tableLoading = false
      })
    },
    // 重置
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.handlerSearch(1)
    },
    exportExcel() {
      const pageQueryVo = {
        estateType: this.formParams.estateType || undefined,
        buildingNum: this.formParams.buildingNum || undefined,
        ownership: this.formParams.ownership || undefined,
        useStatus: this.formParams.useStatus || undefined
      }
      exportRentstandingbook(pageQueryVo).then((res) => {
        exportExcelCb(res.data, this.tableTitle)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.standing-book-detail {
  .znp-filter-container {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0px !important;
    }
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    color: #747579;
  }
}
</style>
