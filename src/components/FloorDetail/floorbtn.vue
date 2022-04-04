<template>
  <div class="floor-container">
    <div style="font-size: 12px">{{ buildingNum }}号楼</div>
    <el-radio-group v-model="floorNum" @change="floorChange" size="small">
      <el-radio-button v-for="(item, index) in floorList" :key="index" :label="item.floor" :value="item.floor" />
    </el-radio-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'FloorBtn',
  props: {
    buildingNum: {
      type: String,
      default: ''
    },
    floorList: {
      type: Array,
      default: () => []
    }
  },
  components: {
  },
  data() {
    return {
      floorNum: '1'
    }
  },
  watch: {
    floorList: {
      handler(newVal) {
        if (newVal.length === 1) {
          this.floorNum = newVal[0].floor
        } else {
          const index = newVal.findIndex(item => item.floor.includes('B'))
          if (index !== -1) {
            if (index - 1 < 0) {
              this.floorNum = newVal[index].floor
            } else {
              this.floorNum = newVal[index - 1].floor
            }
          } else {
            this.floorNum = newVal[newVal.length - 1].floor
          }
        }
      },
      // 立即生效属性
      immediate: true,
      // 对象内部的属性监听，深度监听
      deep: true
    }
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
    floorChange(val) {
      this.$emit('floorChange', val)
    }
  }
}
</script>

<style scoped lang="scss">
.floor-container {
  padding: 0px 15px 0px 0px;
  ::v-deep .el-radio-group {
    background-color: #fff;
    border: 1px #dcdfe6 solid;
    width: 42px;
    border-radius: 10px;
    .el-radio-button {
      display: block;
      .el-radio-button__inner {
        padding: 9px 6px;
        border-radius: 7px;
        width: 30px !important;
        height: 30px !important;
        border: 0px !important;
        margin: 5px 0px;
        font-size: 13px;
        font-weight: 600;
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        border: 0px !important;
      }
    }
  }
}
</style>

