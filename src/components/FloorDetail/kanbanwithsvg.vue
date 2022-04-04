<template>
  <div class="floor-detail">
    <div class="svg-container" ref="svgWrap">
      <Floorbtn :floor-list="floorList" :building-num="buildingNum" @floorChange="floorChange" />
      <!-- svg图形显示容器 -->
      <div v-show="existSvg" style="overflow: auto">
        <div class="svgTemplateCommon" :id="'svgTemplate' + keyId"></div>
      </div>
      <el-empty v-show="!existSvg" class="svgTemplateCommon" description="请上传落位图"></el-empty>
      <!-- svg元件鼠标悬浮提示框 -->
      <div
        class="svgTipBox"
        v-show="svgTipBoxVisible && !svgControlBoxVisible"
        v-bind:style="{ left: svgTipBoxPositionX + 'px', top: svgTipBoxPositionY + 'px' }"
      >
        <div>物业编码: {{ svgTipBoxData.estateCode }}</div>
        <div>物业名称: {{ svgTipBoxData.estateName }}</div>
        <div>物业类型: {{ svgTipBoxData.estateType }}</div>
        <div v-if="svgTipBoxData.name">
          {{ parseInt(svgTipBoxData.nameType) === 2 ? '商户名' : '业主名' }}: {{ svgTipBoxData.name }}
        </div>
        <div v-if="type === 'kinds' && svgTipBoxData.kindsName">业态名称: {{ svgTipBoxData.kindsName }}</div>
        <div>
          {{ type === 'rent' || type === 'kinds' ? '出租状态' : type === 'sale' ? '销售状态' : '开门状态' }}:
          {{
            type === 'rent'
              ? svgTipBoxData.rentStatus === 0
                ? '不可租(' + svgTipBoxData.useStatus + ')'
                : svgTipBoxData.rentStatus === 1
                ? '未租'
                : '已租'
              : type === 'sale'
              ? svgTipBoxData.saleStatus === 0
                ? '不可售(' + svgTipBoxData.useStatus + ')'
                : svgTipBoxData.saleStatus === 1
                ? '未售'
                : '已售'
              : type === 'kinds'
              ? svgTipBoxData.kindsStatus === 0
                ? '不可租(' + svgTipBoxData.useStatus + ')'
                : svgTipBoxData.kindsStatus === 1
                ? '未租'
                : '已租'
              : svgTipBoxData.openStatus === 0
              ? svgTipBoxData.useStatus
              : svgTipBoxData.openStatus === 1
              ? '未开门'
              : '已开门'
          }}
        </div>
      </div>
    </div>
    <!--店铺详情弹框-->
    <ShopDetailDialog :dialog="dialog" @cancelDialog="cancelDialog" />
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.esm.js'
import { mapGetters } from 'vuex'
import axios from 'axios'
import * as d3 from 'd3'
import ShopDetailDialog from './shopDetailDialog'
import Floorbtn from './floorbtn'
import { updateOpenStatus } from '@/api/kanban'
import { createArr } from '@/util/util'
var time = null //  在这里定义time 为null
export default {
  name: 'KanbanWithSvg',
  components: { ShopDetailDialog, Floorbtn },
  props: {
    keyId: {
      type: String,
      default: ''
    },
    isExpand: {
      type: String,
      default: '0'
    },
    type: {
      type: String,
      default: 'rent'
    },
    buildingNum: {
      type: String,
      default: ''
    },
    floorDataList: {
      type: Array,
      default: () => []
    },
    kindsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      existSvg: false, // 是否存在svg图
      dialog: {
        title: '查看详情',
        visible: false,
        estateCode: '',
        type: ''
      },
      floorList: [],
      estateList: [], // 当前tab的物业集合
      floorNum: '1',
      svgControlBoxVisible: false,
      svgPath: '', // svg文件路径
      svgData: '', // svg文件内容
      svgTipBoxData: {}, // svg元件鼠标悬浮提示框内容
      svgTipBoxVisible: false, // svg元件鼠标悬浮提示框显示状态
      svgTipBoxPositionX: 0, // svg元件鼠标悬浮提示框x坐标
      svgTipBoxPositionY: 0 // svg元件鼠标悬浮提示框y坐标
    }
  },
  watch: {
    floorDataList: {
      handler(newVal) {
        this.floorList = JSON.parse(JSON.stringify(newVal))
        if (this.floorList.length === 1) {
          this.floorNum = this.floorList[0].floor
        } else {
          const index = this.floorList.findIndex(item => item.floor.includes('B'))
          if (index !== -1) {
            if (index - 1 < 0) {
              this.floorNum = this.floorList[index].floor
            } else {
              this.floorNum = this.floorList[index - 1].floor
            }
          } else {
            this.floorNum = this.floorList[this.floorList.length - 1].floor
          }
        }
        this.showfloor()
      },
      // 立即生效属性
      immediate: true,
      // 对象内部的属性监听，深度监听
      deep: true
    },
    type: {
      handler(l) {
        this.showfloor()
      },
      // 对象内部的属性监听，深度监听
      deep: true
    }
  },
  async mounted() {
    // 将takePhoto方法绑定到window下面，提供给外部调用
    window['handleClick'] = (evt, item) => {
      this.svgClick(evt, item)
    }
    // 将svgMouseOver方法绑定到window下面，提供给外部调用
    window['handleMouseOver'] = (evt, item) => {
      this.svgMouseOver(evt, item)
    }
    // 将svgMouseMove方法绑定到window下面，提供给外部调用ping 20.
    window['handleMouseMove'] = (evt, item) => {
      this.svgMouseMove(evt, item)
    }
    // 将svgMouseOut方法绑定到window下面，提供给外部调用
    window['handleMouseOut'] = (evt, item) => {
      this.svgMouseOut(evt, item)
    }
    // 将Dblclick方法绑定到window下面，提供给外部调用
    window['handleDblclick'] = (evt, item) => {
      this.svgdblclick(evt, item)
    }
    // 将svgMouseOut方法绑定到window下面，提供给外部调用
    // window['handleMouseWheel'] = () => {
    //   this.zoomimg()
    // }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo'])
  },
  created() {
    this.showfloor()
  },
  methods: {
    cancelDialog() {
      this.dialog.visible = false
    },
    svgdblclick(evt, item) {
      clearTimeout(time) // 清除
      const estateVo = JSON.parse(item.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
      if (this.type === 'opendoor') {
        // 开门状态 0：不可开门，1：未开门，2：已开门
        // 未开门点击变蓝色
        if (parseInt(estateVo.openStatus) !== 0) {
          this.$confirm(`是否${parseInt(estateVo.openStatus) === 1 ? '开' : '关'}门?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              updateOpenStatus({
                estateId: estateVo.estateId,
                isOpen: parseInt(estateVo.openStatus) === 1 ? '1' : '0' // 开门传1 关门传0
              }).then(res => {
                if (res && parseInt(res.data.code) === 0) {
                  this.$message.success(`${parseInt(estateVo.openStatus) === 1 ? '开' : '关'}门成功`)
                  if (parseInt(estateVo.openStatus) === 1) {
                    d3.select('#svgTemplate' + this.keyId + ' svg #r-' + estateVo.estateCode)
                      .attr('style', 'fill:#409EFF; stroke: rgb(11, 11, 4); stroke-width: 0.418747; stroke-miterlimit: 4; stroke-dasharray: none; stroke-opacity: 1;')
                  } else {
                    d3.select('#svgTemplate' + this.keyId + ' svg #r-' + estateVo.estateCode)
                      .attr('style', 'fill:#FFF; stroke: rgb(11, 11, 4); stroke-width: 0.418747; stroke-miterlimit: 4; stroke-dasharray: none; stroke-opacity: 1;')
                  }
                  // 重新刷新
                  this.$emit('refreshTab')
                } else {
                  this.$message.error(res.data.msg)
                }
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        }
      }
    },
    svgClick(evt, item) {
      clearTimeout(time) // 首先清除计时器
      time = setTimeout(() => {
        const estateVo = JSON.parse(item.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
        this.dialog.visible = true
        this.dialog.estateCode = estateVo.estateCode
        this.dialog.type = this.type
      }, 300) // 大概时间300ms
    },
    // svg图元件鼠标移入事件
    svgMouseOver(evt, item) {
      this.svgTipBoxPositionX = evt.pageX - 200
      this.svgTipBoxPositionY = evt.pageY - 50
      this.svgTipBoxData = JSON.parse(item.replace(/\n/g, '\\n').replace(/\r/g, '\\r'))
      this.svgTipBoxVisible = true
    },
    // svg图元件鼠标移动事件
    svgMouseMove(evt, item) {
      this.svgTipBoxPositionX = evt.pageX - 200
      this.svgTipBoxPositionY = evt.pageY - 50
    },
    // svg图元件鼠标移出事件
    svgMouseOut(evt, item) {
      this.svgTipBoxVisible = false
    },
    floorChange(val) {
      this.floorNum = val
      this.showfloor()
    },
    showfloor() {
      this.floorList.forEach(item => {
        // 说明1.折叠判断parseInt(isExpand) === 0显示楼层 2.展开不需要判断直接遍历所有楼层（当然只会传进一层）
        if ((parseInt(this.isExpand) === 0 && item.floor === this.floorNum && item.buildingNum === this.buildingNum) || parseInt(this.isExpand) === 1) {
          /* axios请求2 */
          this.existSvg = true
          if (item.graphUrl) {
            axios.get(item.graphUrl)
              .then(res => {
                var parser = new DOMParser()
                // 将responseText转换成XML对象
                const resXML = parser.parseFromString(res.request.responseText, 'text/xml')
                this.svgDom = resXML.documentElement.cloneNode(true)
                this.addMouseEvent(this.svgDom, item)
              }, err => {
                console.log(err)
              })
          } else {
            this.existSvg = false
          }
        }
      })
    },
    addMouseEvent(svgDom, floorObj) {
      var eleWrap = svgDom.getElementById(this.userInfo.marketCode + '-' + floorObj.buildingNum + '-' + floorObj.floor)
      // 1.操作dom 增加业务逻辑 添加文字 修改颜色 绑定事件
      this.estateList = this.type === 'rent' ? floorObj.estateRentList : (this.type === 'sale' ? floorObj.estateSaleList : (this.type === 'opendoor' ? floorObj.estateOpenList : floorObj.estateKindsList))
      this.estateList.forEach(item => {
        var ele = svgDom.getElementById(item.estateCode)
        if (ele) {
          // 如果是path
          if (ele.getAttribute('d')) {
            var cmdRegEx = /[a-z][^a-z]*/ig
            var dArr = ele.getAttribute('d').match(cmdRegEx)
            ele.setAttribute('x', ((dArr[0].split(' '))[1].split(','))[0])
            ele.setAttribute('y', ((dArr[0].split(' '))[1].split(','))[1])
          }
          ele.setAttribute('id', 'r-' + item.estateCode)
          // 修改【rect】颜色 根据status状态
          // 租赁状态 0：不可租，1：未租，2：已组
          // 可售状态 0：不可售，1：未售，2：已售
          // 开门状态 0：不可开门，1：未开门，2：已开门
          const status = this.type === 'rent' ? item.rentStatus : (this.type === 'sale' ? item.saleStatus : (this.type === 'opendoor' ? item.openStatus : item.kindsStatus))
          if (this.type === 'kinds') {
            if (parseInt(status) === 0) {
              ele.setAttribute('style', `fill: #909399; stroke: rgb(11, 11, 4); stroke-width: 0.418747; stroke-miterlimit: 4; stroke-dasharray: none; stroke-opacity: 1;`)
            } else if (parseInt(status) === 1) {
              ele.setAttribute('style', `fill:#fff; stroke: rgb(11, 11, 4); stroke-width: 0.418747; stroke-miterlimit: 4; stroke-dasharray: none; stroke-opacity: 1;`)
            } else {
              // 已租根据业态判断颜色
              const kindVo = this.kindsList.find(vo => vo.kindsCode === item.kindsCode)
              ele.setAttribute('style', `fill:${kindVo ? kindVo.color : 'red'}; stroke: rgb(11, 11, 4); stroke-width: 0.418747; stroke-miterlimit: 4; stroke-dasharray: none; stroke-opacity: 1;`)
            }
          } else {
            if (parseInt(status) === 0) {
              ele.setAttribute('style', `fill: #909399; stroke: rgb(11, 11, 4); stroke-width: 0.418747; stroke-miterlimit: 4; stroke-dasharray: none; stroke-opacity: 1;`)
            } else if (parseInt(status) === 1) {
              ele.setAttribute('style', `fill:#fff; stroke: rgb(11, 11, 4); stroke-width: 0.418747; stroke-miterlimit: 4; stroke-dasharray: none; stroke-opacity: 1;`)
            } else {
              ele.setAttribute('style', `fill:#409EFF; stroke: rgb(11, 11, 4); stroke-width: 0.418747; stroke-miterlimit: 4; stroke-dasharray: none; stroke-opacity: 1;`)
            }
          }

          var group = document.createElement('g')
          group.setAttribute('id', item.estateCode)
          // 给【group】dom添加事件
          group.setAttribute('onclick', "handleClick(evt,'" + JSON.stringify(item) + "')") // click事件
          group.setAttribute('onmouseover', "handleMouseOver(evt,'" + JSON.stringify(item) + "')") // onmouseover事件
          group.setAttribute('onmousemove', "handleMouseMove(evt,'" + JSON.stringify(item) + "')") // onmousemove事件
          group.setAttribute('onmouseout', "handleMouseOut(evt,'" + JSON.stringify(item) + "')") // onmouseout事件
          if (this.type === 'opendoor') {
            // 如果是开门增加双击事件--为了双击将未开门变为已开门
            group.setAttribute('ondblclick', "handleDblclick(evt,'" + JSON.stringify(item) + "')") // ondblclick事件
          }
          group.appendChild(ele)
          // 给【group】dom添加文字
          // 物业名称
          let addcount = 5
          if (Number(ele.getAttribute('width')) > 23) {
            addcount = 15
          }
          const estateNameArr = createArr(item.estateName, 0, addcount, addcount)
          for (let i = 0; i < estateNameArr.length; i++) {
            const t = document.createElement('text')
            t.innerHTML = estateNameArr[i]
            group.appendChild(t)
            t.setAttribute('xml:space', 'preserve')
            t.setAttribute('text-anchor', 'start')
            t.setAttribute('id', 't-estate-' + item.estateCode)
            t.setAttribute('y', parseFloat(ele.getAttribute('y')) + 1 + ((i + 1) * 3))
            t.setAttribute('x', parseFloat(ele.getAttribute('x')) + 1)
            t.setAttribute('style', `font-style:normal;font-weight:normal;font-size:2px;line-height:1.25;font-family:sans-serif;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.115614;cursor: default`)
          }
          // 商户名称
          if (item.name) {
            const nameArr = createArr(item.name, 0, addcount, addcount)
            for (let j = 0; j < nameArr.length; j++) {
              const t1 = document.createElement('text')
              t1.innerHTML = nameArr[j]
              group.appendChild(t1)
              t1.setAttribute('xml:space', 'preserve')
              t1.setAttribute('text-anchor', 'start')
              t1.setAttribute('id', 't-name-' + item.estateCode)
              t1.setAttribute('y', parseFloat(ele.getAttribute('y')) + 1 + (estateNameArr.length * 3) + ((j + 1) * 3))
              t1.setAttribute('x', parseFloat(ele.getAttribute('x')) + 1)
              let fill = '#000000'
              if (item.toExpire) {
                fill = 'red'
              }
              t1.setAttribute('style', `font-style:normal;font-weight:normal;font-size:2px;line-height:1.25;font-family:sans-serif;fill:${fill};fill-opacity:1;stroke:none;stroke-width:0.115614;cursor: default`)
            }
          }
          eleWrap.appendChild(group)
        }
      })
      // 2.将svgDom对象转换成vue的虚拟dom
      var oSerializer = new XMLSerializer()
      var sXML = oSerializer.serializeToString(svgDom)
      var Profile = Vue.extend({
        template: "<div style='padding-top:17px;' id='svgTemplate" + this.keyId + "'>" + sXML + '</div>'
      })
      // 创建实例，并挂载到元素上
      new Profile().$mount('#svgTemplate' + this.keyId)
      // 可视区域的宽度
      const clientWidth = (this.$refs.svgWrap.clientWidth - 88 - 15) * 0.95// 88是楼层的宽 15是楼层距离svg图的margin 90%是可视图的90%
      const widthSvg = d3.select('#svgTemplate' + this.keyId + ' svg').attr('width')
      // (clientWidth / widthSvg) 放大的倍数 1.76是按照3-1A-1(clientWidth / widthSvg)算出来的倍数 作为所有svg图的倍数
      const beishu = (clientWidth / 1207.968) // 1207.968 按照延安区域的最大svg图的宽算所有图的倍数
      const width = beishu * widthSvg
      const heightSvg = d3.select('#svgTemplate' + this.keyId + ' svg').attr('height')
      const height = (width * heightSvg) / widthSvg
      d3.select('#svgTemplate' + this.keyId + ' svg')
        .attr('width', width)
        .attr('height', height)

      // // $('#svgTemplate svg').svgPanZoom()
      // const viewBoxArr = d3.select('#svgTemplate' + this.keyId + ' svg').attr('viewBox').split(' ')
      // const str = '0 0 ' + viewBoxArr[2] / 2 + ' ' + viewBoxArr[3] / 2
      // d3.select('#svgTemplate' + this.keyId + ' svg')
      //   .attr('viewBox', str)
    },
    // 返回
    goBack() {
      this.$router.go(-1)// 返回上一层
      // this.$router.push({path: '/entity/estate/index'})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
.floor-detail {
  background-color: #fff;
  display: inline-block;
  width: 100%;
  .svg-container {
    display: flex;
    margin: 0 auto;
    text-align: center;
    .go-back {
      font-size: 14px;
      display: inline-block;
    }
    .svgTemplateCommon {
      width: 100%;
      padding-top: 17px;
      svg {
        display: block;
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .svgTipBox {
      position: absolute;
      padding: 10px;
      background: #fff;
      min-width: 150px;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      padding: 12px;
      z-index: 2000;
      color: #606266;
      line-height: 1.4;
      text-align: justify;
      font-size: 14px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      word-break: break-all;
    }
  }
}
</style>
