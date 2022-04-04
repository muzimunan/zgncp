<template>
  <div class="kanban znp-table-container content-p24" v-loading="loading">
    <!-- svg图形显示容器 -->
    <div v-if="svgPath" id="svgTemplate" ref="svgWrap"></div>
    <el-empty v-else description="请在集团端上传看板总图"></el-empty>
    <!-- svg元件鼠标悬浮提示框 -->
    <div
      id="svgTipBox"
      v-show="svgTipBoxVisible && !svgControlBoxVisible"
      v-bind:style="{ left: svgTipBoxPositionX + 'px', top: svgTipBoxPositionY + 'px' }"
    >
      {{ svgTipBoxData }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import * as d3 from 'd3'
export default {
  name: 'KanBan',
  props: {
    kanbantype: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      svgPath: '', // svg文件路径
      svgControlBoxVisible: false,
      svgData: '', // svg文件内容
      svgTipBoxData: '', // svg元件鼠标悬浮提示框内容
      svgTipBoxVisible: false, // svg元件鼠标悬浮提示框显示状态
      svgTipBoxPositionX: 0, // svg元件鼠标悬浮提示框x坐标
      svgTipBoxPositionY: 0 // svg元件鼠标悬浮提示框y坐标
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo'])
  },
  watch: {
  },
  // 由于svg上添加的鼠标事件无法直接调用vue里的methods方法，需要将这些方法绑定到window下面，提供给外部调用
  async mounted() {
    // 将svgClick方法绑定到window下面，提供给外部调用
    window['handleClick'] = (evt, id) => {
      this.svgClick(evt, id)
    }
  },
  created() {
    this.loadSvgData()
  },
  methods: {
    // 加载按钮点击
    loadSvgData() {
      // ajax请求数据，并携带参数
      this.loading = true
      this.svgPath = parseInt(this.kanbantype) === 1 ? this.userInfo.planGraph : this.userInfo.buildingGraph
      if (this.svgPath) {
        axios.get(this.svgPath)
          .then(response => {
            // 将svg平面图显示在制定容器中
            var svgContainer = document.getElementById('svgTemplate')
            svgContainer.innerHTML = response.data
            // 遍历svg里面的元素，自动添加鼠标事件
            this.addMouseEvent(document.getElementById(this.userInfo.marketCode + '-' + (parseInt(this.kanbantype) === 1 ? 'area' : 'building')))
          }, err => {
            console.log(err)
          })
          .catch((error) => {
            console.log(error)
          })
      }
      this.loading = false
    },
    // 遍历svg里面的元素，自动添加鼠标事件
    addMouseEvent(parent) {
      for (var i = 0; i < parent.childNodes.length; i++) { // 循坏svg里面的元素
        var child = parent.childNodes[i]
        // 判断是不是g元素，并且具有id值，是的话，就添加鼠标事件
        if ((child.tagName === 'g') && child.id != null && child.id.length > 0) {
          child.setAttribute('onclick', "handleClick(evt,'" + child.id + "')")
          for (var j = 0; j < child.childNodes.length; j++) { // 循坏svg里面的元素
            var childDeep = child.childNodes[j]
            // 判断是不是text元素，是的话，修改文字样式
            if ((childDeep.tagName === 'text')) {
              childDeep.setAttribute('cursor', 'default')
            }
          }
        }
      }
      const width = this.$refs.svgWrap.clientWidth
      const widthSvg = d3.select('#svgTemplate svg').attr('width')
      const heightSvg = d3.select('#svgTemplate svg').attr('height')
      const height = (width * heightSvg) / widthSvg
      d3.select('#svgTemplate svg')
        .attr('width', width)
        .attr('height', height)

      // .attr('style', 'cursor: default')
    },
    // svg图元件点击事件
    svgClick(evt, id) {
      this.$router.push({
        path: '/floorDetail',
        query: { estateCode: id, type: parseInt(this.kanbantype) } // 0:根据楼号查询，1:根据区域查询
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.kanban {
  #svgTemplate {
    margin: 3% auto 9%;
    width: 50%;
    text-align: center;
  }
  #svgTipBox {
    position: absolute;
    padding: 10px;
    background: #ffffff;
    color: blue;
    border: 1px red solid;
  }
  ::v-deep .el-empty__image {
    width: 300px;
  }
}
</style>
