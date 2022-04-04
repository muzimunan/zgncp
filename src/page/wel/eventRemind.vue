<template>
  <div class="znp-filter-container event-remind">
    <div class="article">
      <div class="navs">
        <div @click="num = 1" :class="{ activeName: num === 1 }" class="tabs cursor">合同提醒</div>
        <div @click="num = 2" :class="{ activeName: num === 2 }" class="tabs cursor">收费提醒</div>
        <div @click="num = 3" :class="{ activeName: num === 3 }" class="tabs cursor">欠费提醒</div>
      </div>
      <div class="more-btn" @click="goto">
        <span>更多</span>
        <img src="@/assets/img/more.png" alt="" />
      </div>
    </div>
    <div class="tableList">
      <el-table class="wel-table" :data="tableData" height="100%" border style="width: 100%">
        <el-table-column prop="buildingNums" label="楼号" width="80" align="center"></el-table-column>
        <el-table-column prop="kindsName" show-overflow-tooltip label="业态"></el-table-column>
        <el-table-column prop="estateNames" label="物业名称" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="days"
          :label="num !== 3 ? '距离天数' : '欠费时间'"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="contractUsername"
          :label="num === 1 ? '合同乙方' : num === 2 ? '缴费人' : '欠费人'"
          width="80"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRemindList } from '@/api/wel'
export default {
  name: 'EstateRentRate',
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      num: 1,
      tableData: []
    }
  },
  watch: {
    num() {
      this.getRemindList()
    }
  },
  mounted() {
  },
  created() {
    this.getRemindList()
  },
  methods: {
    getRemindList() {
      getRemindList(this.num).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    goto() {
      // 跳转到事件提醒菜单下
      this.$router.push({
        path: '/entity/eventReminder/index'
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.event-remind {
  height: 100%;
  .article {
    .title {
      font-size: 18px;
      color: #333;
      margin-bottom: 24px;
      font-weight: 550;
    }
    .navs {
      display: inline-block;
      border: 1px solid #299ffc;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 14px;
      .cursor {
        cursor: pointer;
      }
      .tabs {
        font-size: 14px;
        color: #299ffc;
        padding: 5px 17px;
        display: inline-block;
        border-right: 1px solid #299ffc;
      }
      .activeName {
        color: #fff;
        background: #299ffc;
      }
    }
    .more-btn {
      float: right;
      padding: 5px 8px;
      cursor: pointer;
      span {
        font-size: 14px;
        color: #299ffc;
        vertical-align: middle;
      }
      img {
        width: 14px;
        height: 12px;
        vertical-align: middle;
      }
    }
  }
  .tableList {
    height: 72%;
  }
}
</style>

