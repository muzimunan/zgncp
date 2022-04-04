<template>
  <div class="home" id="homeBody">
    <el-row>
      <el-col :span="8" class="item-col1">
        <span class="item-border item-wrap item1">
          <EventRemind type="contract" />
        </span>
        <span class="item-border item-wrap item2">
          <Trade />
        </span>
      </el-col>
      <el-col :span="8">
        <span class="item-border item-wrap item3">
          <MerchantAndInvestor />
        </span>
        <span class="item-wrap item4">
          <RentAreaMerchant />
        </span>
      </el-col>
      <el-col :span="8" class="item-col6">
        <span class="item-wrap item5">
          <Fee />
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EventRemind from './wel/eventRemind'
import Fee from './wel/fee'
import RentAreaMerchant from './wel/rentAreaMerchant'
import MerchantAndInvestor from './wel/merchantAndInvestor'
import Trade from './wel/trade'
export default {
  name: 'WelPage',
  components: { EventRemind, Fee, RentAreaMerchant, MerchantAndInvestor, Trade },
  data() {
    return {
    }
  },
  created() {
    // 防止浏览器放大布局乱掉
    document.getElementsByTagName('body')[0].style.zoom = 1 / window.devicePixelRatio
    // document.getElementById('homeBody')[0].style.zoom = 1 / window.devicePixelRatio
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped="scoped" lang="scss">
.home {
  // min-width: 1200px;
  // min-height: 900px;
  overflow-x: scroll;
  background: #ffffff;
  padding: 0px;
  // background: url("/img/bg/bg.png") 0% 0% / 100% 100% rgb(3, 12, 59);
  // background-size: cover;
  height: 100%;
  .el-row {
    height: 100%;
  }
  .el-col {
    margin-bottom: 0px;
    height: 100%;
  }
  .item-col1 {
    border-right: 6px #f0f2f5 solid;
  }
  .item-col6 {
    border-left: 6px #f0f2f5 solid;
  }
  span.item-wrap {
    display: inline-block;
    width: 100%;
    overflow: hidden;
  }
  span.item-border {
    border-bottom: 6px #f0f2f5 solid;
  }
  span.item1 {
    height: 30%;
  }
  span.item2 {
    height: calc(100% - 31%); // 1vh表示屏幕高度的1%
  }
  span.item3 {
    height: 53%;
  }
  span.item4 {
    height: calc(100% - 58%); // 1vh表示屏幕高度的1%
  }
  span.item5 {
    height: 99%;
  }
}
::v-deep .el-table.wel-table {
  border-radius: 15px !important;
  overflow: hidden !important;
  box-shadow: 0 2px 10px 0 rgb(41 159 252 / 15%) !important;
  thead tr th {
    background: #e0ecfd !important;
    color: #333 !important;
  }
  td {
    border: none;
  }
}
</style>
