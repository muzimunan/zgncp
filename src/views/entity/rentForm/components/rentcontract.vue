<template>
  <div>
    <div v-if="!isExistValidContract" class="znp-table-add-btn">
      <el-button size="mini" type="primary" @click.stop="openRentcontract('add')">创建合同</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border size="small">
      <el-table-column prop="contractCode" label="合同编码" width="180px" />
      <el-table-column prop="startDate" label="开始日期" />
      <el-table-column prop="endDate" label="结束日期" />
      <el-table-column prop="contractStatusName" label="合同状态" />
      <el-table-column prop="estateName" label="物业档案" />
      <el-table-column prop="contractPrice" label="合同金额" />
      <el-table-column prop="payTypeLabel" label="付款方式" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.entity_merchantcontact_view"
            size="mini"
            type="text"
            @click.stop="openRentcontract('look', scope.row)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
export default {
  name: 'RentConcatTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    detailDisable: {
      type: Boolean,
      default: false
    },
    isExistValidContract: {
      type: Boolean,
      default: false
    },
    rentformVo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      concatData: [],
      dialogVo: {
        title: '新增联系人',
        visible: false,
        operateType: 'add',
        vo: {
          merchantId: '',
          contactName: '', // 联系人姓名
          phone: '', // 手机号
          wechat: '', // 微信号
          email: '', // 邮箱
          address: '', // 常住地址
          idNum: '', // 身份证号
          idFront: '', // 身份证照片正面
          idBack: '' // 身份证照片反面
        } // 联系人信息
      }// 添加或编辑联系人弹框
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {},
  mounted() {
  },
  created() {
  },
  activated() {
  },
  destroyed() {
  },
  methods: {
    // 创建合同
    openRentcontract(type, item) {
      this.$router.push({
        path: '/rentContract/detail',
        query: {
          operateType: type,
          rentformVo: type === 'add' ? JSON.stringify(this.rentformVo) : undefined,
          id: type !== 'add' ? item.id : undefined
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>

