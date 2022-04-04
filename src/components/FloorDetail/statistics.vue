<template>
  <div class="statistics-info">
    <!-- <div>
        <el-descriptions class="margin-top" :column="6" size="small" v-if="activeName === 'rent'">
          <el-descriptions-item label="不可租总数(个)">{{ statistics.rent.cannotRentTotal }}</el-descriptions-item>
          <el-descriptions-item label="不可租总面积(㎡)">{{ statistics.rent.cannotRentTotalAcr }}</el-descriptions-item>
          <el-descriptions-item label="可租总数(个)">{{ statistics.rent.rentedTotal }}</el-descriptions-item>
          <el-descriptions-item label="可租总面积(㎡)">{{ statistics.rent.rentedTotal }}</el-descriptions-item>
          <el-descriptions-item label="未租总数(个)">{{ statistics.rent.unRentTotal }}</el-descriptions-item>
          <el-descriptions-item label="未租总面积(㎡)">{{ statistics.rent.unRentTotalAcr }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" :column="6" size="small" v-if="activeName === 'sale'">
          <el-descriptions-item label="不可售总数(个)">{{ statistics.sale.cannotSaleTotal }}</el-descriptions-item>
          <el-descriptions-item label="不可售总面积(㎡)">{{ statistics.sale.cannotSaleTotalAcr }}</el-descriptions-item>
          <el-descriptions-item label="可售总数(个)">{{ statistics.sale.saledTotal }}</el-descriptions-item>
          <el-descriptions-item label="可售总面积(㎡)">{{ statistics.sale.saledTotalAcr }}</el-descriptions-item>
          <el-descriptions-item label="未售总数(个)">{{ statistics.sale.unSaleTotal }}</el-descriptions-item>
          <el-descriptions-item label="未售总面积(㎡)">{{ statistics.sale.unSaleTotalAcr }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" :column="2" size="small" v-else-if="activeName === 'opendoor'">
          <el-descriptions-item label="开门总数(个)">{{ statistics.open.openCount }}</el-descriptions-item>
          <el-descriptions-item label="未开门总数(个)">{{ statistics.open.unOpenCount }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" :column="6" size="small" v-else-if="activeName === 'kinds'">
          <el-descriptions-item label="不可租总数(个)">{{ statistics.rent.cannotRentTotal }}</el-descriptions-item>
          <el-descriptions-item label="不可租总面积(㎡)">{{ statistics.rent.cannotRentTotalAcr }}</el-descriptions-item>
          <el-descriptions-item label="可租总数(个)">{{ statistics.rent.rentedTotal }}</el-descriptions-item>
          <el-descriptions-item label="可租总面积(㎡)">{{ statistics.rent.rentedTotal }}</el-descriptions-item>
          <el-descriptions-item label="未租总数(个)">{{ statistics.rent.unRentTotal }}</el-descriptions-item>
          <el-descriptions-item label="不可租总面积(㎡)">{{ statistics.rent.unRentTotalAcr }}</el-descriptions-item>
        </el-descriptions>
      </div> -->
    <el-row class="des-container" v-if="activeName === 'rent'">
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">不可租总数:</span>
        <span class="des-container-item_content">{{ statistics.rent.cannotRentTotal }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">不可租总面积:</span>
        <span class="des-container-item_content">{{ statistics.rent.cannotRentTotalAcr }}</span>
        <span class="des-container-item_label">㎡</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">已租总数:</span>
        <span class="des-container-item_content">{{ statistics.rent.rentedTotal }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">已租总面积:</span>
        <span class="des-container-item_content">{{ statistics.rent.rentedTotalAcr }}</span>
        <span class="des-container-item_label">㎡</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">未租总数:</span>
        <span class="des-container-item_content">{{ statistics.rent.unRentTotal }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">未租总面积:</span>
        <span class="des-container-item_content">{{ statistics.rent.unRentTotalAcr }}</span>
        <span class="des-container-item_label">㎡</span>
      </el-col>
    </el-row>
    <el-row class="des-container" v-else-if="activeName === 'sale'">
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">不可售总数:</span>
        <span class="des-container-item_content">{{ statistics.sale.cannotSaleTotal }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">不可售总面积:</span>
        <span class="des-container-item_content">{{ statistics.sale.cannotSaleTotalAcr }}</span>
        <span class="des-container-item_label">㎡</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">可售总数:</span>
        <span class="des-container-item_content">{{ statistics.sale.saledTotal }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">可售总面积:</span>
        <span class="des-container-item_content">{{ statistics.sale.saledTotal }}</span>
        <span class="des-container-item_label">㎡</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">未售总数:</span>
        <span class="des-container-item_content">{{ statistics.sale.unSaleTotal }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4" class="des-container-item">
        <span class="des-container-item_label">未售总面积:</span>
        <span class="des-container-item_content">{{ statistics.sale.unSaleTotalAcr }}</span>
        <span class="des-container-item_label">㎡</span>
      </el-col>
    </el-row>
    <el-row class="des-container" v-else-if="activeName === 'opendoor'">
      <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8" class="des-container-item">
        <span class="des-container-item_label">开门总数:</span>
        <span class="des-container-item_content">{{ statistics.open.openCount }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8" class="des-container-item">
        <span class="des-container-item_label">未开门总数:</span>
        <span class="des-container-item_content">{{ statistics.open.unOpenCount }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
    </el-row>
    <el-row class="des-container" v-else>
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4" class="des-container-item" v-for="(item, index) in statistics.kinds" :key="index" :label="item.kindsName">
        <span class="des-container-item_label">{{ item.kindsName }}:</span>
        <span class="des-container-item_content">{{ item.count }}</span>
        <span class="des-container-item_label">个</span>
      </el-col>
    </el-row>
    <!-- <el-descriptions class="margin-top" :column="6" size="small" v-else-if="activeName === 'kinds'">
      <el-descriptions-item v-for="(item, index) in statistics.kinds" :key="index" :label="item.kindsName">
        {{ item.count }}
        <span class="el-descriptions-item_content_unit">个</span>
      </el-descriptions-item>
    </el-descriptions> -->
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'StatisticsPage',
  props: {
    // 对象
    statistics: {
      type: Object,
      default: () => null
    },
    activeName: {
      type: String,
      default: ''
    }
  },
  components: {
  },
  data() {
    return {
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.statistics-info {
  // ::v-deep .el-descriptions-item__cell {
  //   padding-bottom: 0px !important;
  //   .el-descriptions-item__container {
  //     // background-color: #e1f3d8;
  //     // padding: 15px;
  //     .el-descriptions-item__label {
  //       font-size: 15px;
  //       font-weight: 400;
  //       line-height: 45px;
  //     }
  //     .el-descriptions-item__content {
  //       font-size: 30px;
  //       font-weight: 600;
  //       .el-descriptions-item_content_unit {
  //         font-size: 15px;
  //         font-weight: 400;
  //       }
  //     }
  //   }
  // }
  .des-container {
    margin-bottom: 15px;
    .el-col{
      margin-bottom: 0px;
    }
    .des-container-item_label {
      font-size: 15px;
      font-weight: 400;
      line-height: 45px;
    }
    .des-container-item_content {
      font-size: 24px;
      font-weight: 600;
    }
  }
}
</style>

