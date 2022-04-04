<template>
  <div class="legend-info">
    <div class="svg-symbol-info" v-if="activeName === 'rent' || activeName === 'sale'">
      <div class="legend-etc">
        <i class="legend non-rentable"></i>
        <span>不可{{ activeName === 'rent' ? '租' : '售' }}</span>
      </div>
      <div class="legend-etc">
        <i class="legend rentable"></i>
        <span>已{{ activeName === 'rent' ? '租' : '售' }}</span>
      </div>
      <div class="legend-etc">
        <i class="legend not-rented"></i>
        <span>{{ activeName === 'rent' ? '未租' : '不可售-未售' }}</span>
      </div>
    </div>
    <div class="svg-symbol-info" v-else-if="activeName === 'kinds'">
      <div class="legend-etc">
        <i class="legend non-rentable"></i>
        <span>不可租</span>
      </div>
      <div v-for="(item, index) in kindsList" :key="index" class="legend-etc">
        <i class="legend" :style="{ background: item.color }"></i>
        <span>{{ item.label }}</span>
      </div>
      <div class="legend-etc">
        <i class="legend not-rented"></i>
        <span>未租</span>
      </div>
    </div>
    <div class="svg-symbol-info" v-else>
      <div class="legend-etc">
        <i class="legend non-rentable"></i>
        <span>闲置/自用</span>
      </div>
      <div class="legend-etc">
        <i class="legend rentable"></i>
        <span>已开门</span>
      </div>
      <div class="legend-etc">
        <i class="legend not-rented"></i>
        <span>未开门</span>
      </div>
      <div class="legend-etc">
        <i class="legend-warning el-icon-warning"></i>
        <span>温馨提示：双击可开/关门</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'LegendPage',
  props: {
    // 对象
    kindsList: {
      type: Array,
      default: () => []
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
.legend-info {
  .svg-symbol-info {
    font-size: 10px;
    color: #606266;
    .legend-etc {
      display: inline-block;
      margin-right: 7px;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .legend {
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: middle;
        border: 0.1px solid #eee;
      }
      .legend-warning {
        display: inline-block;
        vertical-align: middle;
        border: 0px;
        color: #e6a23c;
        font-size: 14px;
      }
      /* 冲突 */
      .clash {
        background-color: #f71a1a;
      }
      /* 不可租 */
      .non-rentable {
        background-color: #909399;
      }
      /* 已租 */
      .rentable {
        background-color: #409eff;
      }
      /* 未发布 */
      .not-rented {
        background-color: #fff;
        border: 0.1px solid #c0c4cc;
      }
    }
  }
}
</style>

