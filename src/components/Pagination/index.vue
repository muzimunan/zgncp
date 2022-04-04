<template>
  <div :class="{ hidden: hidden }" class="pagination-container pagination-sign">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/util/scroll-to'

export default {
  name: 'PaGination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.pagination-container {
  background: #fff;
  /* padding: 32px 16px; */
  padding: 0px;
}
.pagination-container.hidden {
  display: none;
}
.pagination-sign {
  ::v-deep .el-pager li,
  ::v-deep .el-pagination button,
  ::v-deep .el-input--mini .el-input__inner,
  ::v-deep .el-pagination__editor.el-input .el-input__inner {
    height: 21px !important;
    line-height: 21px !important;
    margin-top: 5px;
    font-size: 12px;
  }
  ::v-deep .el-pagination {
    padding: 0px;
  }
  ::v-deep .el-pagination__total {
    font-size: 12px;
  }
  ::v-deep .el-pagination__jump {
    font-size: 12px;
  }
  ::v-deep .el-pager .more::before {
    line-height: 21px;
  }
}
</style>
