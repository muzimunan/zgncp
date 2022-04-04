<template>
  <div class="znp-filter-container rent-area-merchant-wrapper" ref="getheight">
    <h4>按租赁面积十大商户</h4>
    <el-table class="wel-table" ref="tableBox" v-loading="tableLoading" :data="tableData" border size="small">
      <el-table-column prop="merchantName" show-overflow-tooltip label="商户名称" align="center" />
      <el-table-column prop="areaTotal" label="总面积" align="center" />
      <el-table-column prop="buildingNums" label="楼号" align="center" />
      <el-table-column prop="operationTypesKindsName" show-overflow-tooltip label="业态" align="center" />
      <el-table-column prop="estateNames" label="物业名称" show-overflow-tooltip align="center" width="200px" />
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
import { getMerchantTopList } from '@/api/wel'
export default {
  name: 'RentAreaMerchant',
  components: {
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      tableHeight: ''
    }
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.getMerchantTopList()
    var isScroll = true
    this.$nextTick(() => {
      this.tableHeight = this.$refs.getheight.offsetHeight
    })
    this.$nextTick(() => {
      const div = document.getElementsByClassName('el-table__body-wrapper')[1]
      div.style.height = (this.tableHeight * 0.63) + 'px'
      // _that.$refs.tableBox.addEventListener("mouseenter", function() {
      //   isScroll = false;
      // });
      // _that.$refs.tableBox.addEventListener("mouseleave", function() {
      //   isScroll = true;
      // });
      const t = document.getElementsByClassName('el-table__body')[1]
      setInterval(() => {
        if (isScroll) {
          var data = this.tableData[0]
          setTimeout(() => {
            this.tableData.push(data)
            t.style.transition = 'all .5s'
            t.style.marginTop = '-41px'
          }, 500)
          setTimeout(() => {
            this.tableData.splice(0, 1)
            t.style.transition = 'all 0s ease 0s'
            t.style.marginTop = '0'
          }, 1000)
        }
      }, 2500)
    })
  },
  methods: {
    getMerchantTopList() {
      this.tableLoading = true
      getMerchantTopList().then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.tableData = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/znp-common.scss';
.rent-area-merchant-wrapper {
  height: 100%;
  padding-bottom: 30px;
  h4 {
    margin: 0;
    font-size: 18px;
    margin-bottom: 20px;
  }
  ::v-deep .el-table th {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>

