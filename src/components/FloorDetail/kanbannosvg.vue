<template>
  <div class="floor-detail">
    <div class="svg-container" ref="svgWrap">
      <Floorbtn :floor-list="floorList" :building-num="buildingNum" @floorChange="floorChange" />
      <!-- 线框图显示容器 -->
      <el-row class="row-line-wrap">
        <el-col
          :xs="12"
          :sm="4"
          :md="4"
          :lg="6"
          :xl="4"
          v-for="(item, index) in estateList"
          :key="index"
          class="col-line-item"
        >
          <el-popover width="200" trigger="hover" placement="right">
            <div>
              <div>物业编码: {{ item.estateCode }}</div>
              <div>物业名称: {{ item.estateName }}</div>
              <div>物业类型: {{ item.estateType }}</div>
              <div v-if="item.name">{{ parseInt(item.nameType) === 2 ? '商户名' : '业主名' }}: {{ item.name }}</div>
              <div v-if="type === 'kinds' && item.kindsName">业态名称: {{ item.kindsName }}</div>
              <div>
                {{ type === 'rent' || type === 'kinds' ? '出租状态' : type === 'sale' ? '销售状态' : '开门状态' }}:
                {{
                  type === 'rent'
                    ? item.rentStatus === 0
                      ? '不可租(' + item.useStatus + ')'
                      : item.rentStatus === 1
                      ? '未租'
                      : '已租'
                    : type === 'sale'
                    ? item.saleStatus === 0
                      ? '不可售(' + item.useStatus + ')'
                      : item.saleStatus === 1
                      ? '未售'
                      : '已售'
                    : type === 'kinds'
                    ? item.kindsStatus === 0
                      ? '不可租(' + item.useStatus + ')'
                      : item.kindsStatus === 1
                      ? '未租'
                      : '已租'
                    : item.openStatus === 0
                    ? item.useStatus
                    : item.openStatus === 1
                    ? '未开门'
                    : '已开门'
                }}
              </div>
            </div>
            <el-button
              slot="reference"
              type="primary"
              class="col-line-item-btn"
              :style="styleObject(item)"
              @click="btnClick(item.estateCode)"
              @dblclick.native="btndbClick(item)"
            >
              <div style="margin-bottom: 5px">{{ item.estateName }}</div>
              <div :style="isExpire(item)">{{ item.name }}</div>
            </el-button>
          </el-popover>
        </el-col>
      </el-row>
    </div>
    <!--店铺详情弹框-->
    <ShopDetailDialog :dialog="dialog" @cancelDialog="cancelDialog" />
  </div>
</template>

<script>
import ShopDetailDialog from './shopDetailDialog'
import Floorbtn from './floorbtn'
import { updateOpenStatus } from '@/api/kanban'
var time = null //  在这里定义time 为null
export default {
  name: 'KanbanNoSvg',
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
  computed: {
    styleObject() {
      return (item) => {
        const status = this.type === 'rent' ? item.rentStatus : (this.type === 'sale' ? item.saleStatus : (this.type === 'opendoor' ? item.openStatus : item.kindsStatus))
        const style0 = { background: '#909399', color: '#FFF', border: '1px solid #DCDFE6' }
        const style1 = { background: '#fff', color: '#409EFF' }
        const style2 = { background: '#409EFF', color: '#FFF' }
        if (this.type === 'kinds') {
          if (parseInt(status) === 0) {
            return style0
          } else if (parseInt(status) === 1) {
            return style1
          } else {
            // 已租根据业态判断颜色
            const kindVo = this.kindsList.find(vo => vo.kindsCode === item.kindsCode)
            return { background: `${kindVo ? kindVo.color : 'red'}`, border: '1px solid #DCDFE6' }
          }
        } else {
          if (parseInt(status) === 0) {
            return style0
          } else if (parseInt(status) === 1) {
            return style1
          } else {
            return style2
          }
        }
      }
    },
    isExpire() {
      // 过期变红
      return (item) => {
        const style = { color: 'red' }
        if (item.toExpire) {
          return style
        }
      }
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
  mounted() {
  },
  created() {
    this.showfloor()
  },
  methods: {
    cancelDialog() {
      this.dialog.visible = false
    },
    btndbClick(estateVo) {
      clearTimeout(time) // 清除
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
                  parseInt(estateVo.openStatus) === 1 ? estateVo.openStatus = 2 : estateVo.openStatus = 1
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
    btnClick(estateCode) {
      clearTimeout(time) // 首先清除计时器
      time = setTimeout(() => {
        this.dialog.visible = true
        this.dialog.estateCode = estateCode
        this.dialog.type = this.type
      }, 300) // 大概时间300ms
    },
    // svg图元件鼠标移入事件
    svgMouseOver(evt, estateCode) {
      this.svgTipBoxPositionX = evt.pageX - 200
      this.svgTipBoxPositionY = evt.pageY - 50
      // this.item = this.estateList.find(item => item.estateCode === estateCode)
      this.svgTipBoxVisible = true
    },
    // svg图元件鼠标移动事件
    svgMouseMove(evt, estateCode) {
      this.svgTipBoxPositionX = evt.pageX - 200
      this.svgTipBoxPositionY = evt.pageY - 50
    },
    // svg图元件鼠标移出事件
    svgMouseOut(evt, estateCode) {
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
          this.estateList = this.type === 'rent' ? item.estateRentList : (this.type === 'sale' ? item.estateSaleList : (this.type === 'opendoor' ? item.estateOpenList : item.estateKindsList))
        }
      })
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
  width: 50%;
  .svg-container {
    display: flex;
    margin: 0 auto;
    text-align: center;
    .row-line-wrap {
      width: 100%;
      margin-bottom: 50px;
      padding-top: 16px;
      .col-line-item {
        padding: 0 10px;
        .col-line-item-btn {
          width: 100%;
          height: 45px;
        }
      }
    }
  }
}
</style>
