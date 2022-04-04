<template>
  <div class="kanban-info">
    <div class="kanban-wraper">
      <el-radio-group v-model="flag" size="mini">
        <el-radio-button label="0">落位图</el-radio-button>
        <el-radio-button label="1">线框图</el-radio-button>
      </el-radio-group>
      &nbsp;
      <el-radio-group v-model="isExpand" size="mini">
        <el-radio-button label="0">折叠</el-radio-button>
        <el-radio-button label="1">展开</el-radio-button>
      </el-radio-group>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="租赁看板" name="rent"></el-tab-pane>
        <el-tab-pane label="业态看板" v-if="parseInt(this.$route.query.type) === 1" name="kinds"></el-tab-pane>
        <el-tab-pane label="销售看板" name="sale"></el-tab-pane>
        <el-tab-pane label="开门看板" v-if="parseInt(this.$route.query.type) === 0" name="opendoor"></el-tab-pane>
      </el-tabs>
      <Statistics :statistics="statistics" :activeName="activeName" />
      <div class="control-area">
        <Legend :kinds-list="selectOptions.kindsList" :activeName="activeName" />
        <!-- <div class="legend-etc-warning" v-if="activeName === 'opendoor'">
          <i class="legend-warning el-icon-warning"></i>
          <span>温馨提示：双击可开/关门</span>
        </div> -->
        <!-- <Legend :kinds-list="selectOptions.kindsList" :activeName="activeName" /> -->
      </div>
      <div v-if="parseInt(flag) === 0 && parseInt(isExpand) === 0" v-loading="loading">
        <KanbanWithSvg
          v-for="item in buildingList"
          :key="item.buildingNum"
          :key-id="item.buildingNum"
          :type="activeName"
          :floor-data-list="item.floorDataList"
          :building-num="item.buildingNum"
          :kinds-list="selectOptions.kindsList"
          :is-expand="isExpand"
          @refreshTab="refreshTab"
        />
      </div>
      <div v-else-if="parseInt(flag) === 0 && parseInt(isExpand) === 1" v-loading="loading">
        <KanbanWithSvg
          v-for="item in buildingListExpand"
          :key="item[0].buildingNum + '-' + item[0].floor"
          :key-id="item[0].buildingNum + '-' + item[0].floor"
          :type="activeName"
          :floor-data-list="item"
          :building-num="item[0].buildingNum"
          :kinds-list="selectOptions.kindsList"
          :is-expand="isExpand"
          @refreshTab="refreshTab"
        />
      </div>
      <div v-else-if="parseInt(flag) === 1 && parseInt(isExpand) === 0" v-loading="loading">
        <KanbanNoSvg
          v-for="item in buildingListByLine"
          :key="item.buildingNum"
          :key-id="item.buildingNum"
          :type="activeName"
          :floor-data-list="item.floorDataList"
          :building-num="item.buildingNum"
          :kinds-list="selectOptions.kindsList"
          :is-expand="isExpand"
        />
      </div>
      <div v-else-if="parseInt(flag) === 1 && parseInt(isExpand) === 1" v-loading="loading">
        <KanbanNoSvg
          v-for="item in buildingListExpandByLine"
          :key="item[0].buildingNum + '-' + item[0].floor"
          :key-id="item[0].buildingNum + '-' + item[0].floor"
          :type="activeName"
          :floor-data-list="item"
          :building-num="item[0].buildingNum"
          :kinds-list="selectOptions.kindsList"
          :is-expand="isExpand"
        />
      </div>
    </div>
  </div>
</template>

<script>
import KanbanWithSvg from './kanbanwithsvg'
import KanbanNoSvg from './kanbannosvg'
import Statistics from './statistics'
import Legend from './legend'
import { fetchFloorInfoList } from '@/api/marketSvg'
import { getSelectKindsList } from '@/api/category'
import { queryStatisticsByRent, queryStatisticsBySale, queryStatisticsByOpen, queryStatisticsByKinds } from '@/api/kanban'

export default {
  name: 'KanBanInfo',
  components: { KanbanWithSvg, KanbanNoSvg, Statistics, Legend },
  data() {
    return {
      loading: false,
      queryVo: {},
      isExpand: '0',
      colorList: ['#ee6666', '#266838', '#fac858', '#5470c6', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#edb7b7', '#91cc75', '#795548'],
      selectOptions: {
        kindsList: []// 业态
      },
      activeName: 'rent',
      buildingList: [],
      buildingListExpand: [], // 展开数据存储
      buildingListByLine: [], // 线框图
      buildingListExpandByLine: [], // 展开数据存储线框图
      flag: '0', // 默认该市场不存在svg图
      statistics: {
        rent: {},
        sale: {},
        open: {},
        kinds: {}
      }
    }
  },
  computed: {
  },
  watch: {},
  created() {
    const info = this.$route.query
    if (info.estateCode) {
      this.queryVo = {
        areaCode: parseInt(info.type) === 1 ? info.estateCode : undefined,
        buildingNum: parseInt(info.type) === 0 ? (info.estateCode).substring(6, info.estateCode.length) : undefined,
        queryType: info.type,
        type: info.type
      }
      this.queryVoById()
      this.getSelectList()
      this.queryStatisticsByRent()
    }
  },
  methods: {
    refreshTab() {
      this.queryVoById()
    },
    isExpandChange(val) {
      if (parseInt(val) === 1) {
        // 展开
        if (this.flag) {
          // svg
          this.buildingListExpand = []
          this.buildingList.forEach(item => {
            item.floorDataList.forEach(vo => {
              const arr = []
              arr.push(vo)
              this.buildingListExpand.push(arr)
            })
          })
        } else {
          // 线框图
          this.buildingListExpandByLine = []
          this.buildingListByLine.forEach(item => {
            item.floorDataList.forEach(vo => {
              const arr = []
              arr.push(vo)
              this.buildingListExpandByLine.push(arr)
            })
          })
        }
      }
    },
    getSelectList() {
      // 主营品类(level = 0 只查询第1级)
      getSelectKindsList('0').then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.selectOptions.kindsList = res.data.data
          this.selectOptions.kindsList.forEach((item, index) => {
            item.color = this.colorList[index % 12]
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    queryVoById() {
      this.loading = true
      fetchFloorInfoList(this.queryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.buildingList = res.data.data.floorSvgInfoList
          this.buildingListByLine = res.data.data.floorSvgInfoLineList
          // this.flag = res.data.data.existSvg ? '0' : '1'
          // 展开后的数据展示
          this.buildingListExpand = []
          this.buildingList.forEach(item => {
            item.floorDataList.forEach(vo => {
              const arr = []
              arr.push(vo)
              this.buildingListExpand.push(arr)
            })
          })
          //  展开后的数据展示 线框图
          this.buildingListExpandByLine = []
          this.buildingListByLine.forEach(item => {
            item.floorDataList.forEach(vo => {
              const arr = []
              arr.push(vo)
              this.buildingListExpandByLine.push(arr)
            })
          })
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false
      })
    },
    handleTabsClick(tab, event) {
      if (tab.name === 'rent') {
        this.queryStatisticsByRent()
      } else if (tab.name === 'sale') {
        this.queryStatisticsBySale()
      } else if (tab.name === 'opendoor') {
        this.queryStatisticsByOpen()
      } else {
        this.queryStatisticsByKinds()
      }
    },
    queryStatisticsByRent() {
      queryStatisticsByRent(this.queryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.statistics.rent = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    queryStatisticsBySale() {
      queryStatisticsBySale(this.queryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.statistics.sale = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    queryStatisticsByOpen() {
      queryStatisticsByOpen(this.queryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.statistics.open = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    queryStatisticsByKinds() {
      queryStatisticsByKinds(this.queryVo).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.statistics.kinds = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.kanban-info {
  background-color: #fff;
  .kanban-wraper {
    padding: 25px 35px 35px;
    width: 100%;
    ::v-deep .el-radio-group {
      margin-bottom: 20px;
    }
    .control-area {
      display: flex;
      justify-content: space-between;
      vertical-align: middle;
      align-items: center;
      margin-bottom: 15px;
      .legend-etc-warning {
        display: inline-block;
        margin-right: 7px;
        span {
          display: inline-block;
          vertical-align: middle;
        }
        .legend-warning {
          display: inline-block;
          vertical-align: middle;
          border: 0px;
          color: #e6a23c;
          font-size: 17px;
        }
      }
    }
  }
}
</style>
