<template>
  <div class="import-excel">
    <el-button
      type="success"
      size="mini"
      @click="exportData"
      v-if="
        (type === 'estate' && permissions.entity_estate_export) ||
        (type === 'merchant' && permissions.entity_merchant_export)
      "
      style="display: inline-block; margin-left: 10px"
    >
      导出
    </el-button>
    <el-upload
      ref="fileUpload"
      action="#"
      :before-upload="beforeUpload"
      :http-request="uploadRequest"
      :show-file-list="false"
      :limit="1"
      size="mini"
      style="display: inline-block; margin: 0px 10px"
    >
      <el-button size="mini" type="danger" v-if="permissions.entity_template_import">导入{{ uploadLabel }}</el-button>
    </el-upload>
    <el-button type="text" size="mini" @click="exportExcel" v-if="permissions.entity_template_download">
      {{ uploadLabel }}模板下载
    </el-button>
  </div>
</template>

<script>
import { importExcel } from '@/api/upload'
import { mapGetters } from 'vuex'
import {
  exportEstate,
  exportEstateRentcontract,
  exportEstateSalecontract,
  exportInvestor,
  exportSalesContract,
  exportMerchant,
  exportRentcontract,
  exportExcelCb,
  exportMerchantData,
  exportEstateData
} from '@/api/export'
export default {
  name: 'UploadExcel',
  props: {
    type: {
      type: String,
      default: ''
    },
    formParams: {
      type: Object,
      default: () => null
    },
    uploadLabel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    // 下载模板
    exportExcel() {
      if (this.type === 'estate') {
        exportEstate().then((res) => {
          exportExcelCb(res.data, '物业信息模板')
        })
      } else if (this.type === 'estaterent') {
        exportEstateRentcontract().then((res) => {
          exportExcelCb(res.data, '物业出租合同模板')
        })
      } else if (this.type === 'estatesale') {
        exportEstateSalecontract().then((res) => {
          exportExcelCb(res.data, '物业销售合同模板')
        })
      } else if (this.type === 'investor') {
        exportInvestor().then((res) => {
          exportExcelCb(res.data, '业主信息模板')
        })
      } else if (this.type === 'salescontract') {
        exportSalesContract().then((res) => {
          exportExcelCb(res.data, '销售合同模板')
        })
      } else if (this.type === 'merchant') {
        exportMerchant().then((res) => {
          exportExcelCb(res.data, '商户信息模板')
        })
      } else if (this.type === 'rentcontract') {
        exportRentcontract().then((res) => {
          exportExcelCb(res.data, '租赁合同模板')
        })
      }
    },
    // 数据导出
    exportData() {
      if (this.type === 'estate') {
        exportEstateData(this.formParams).then((res) => {
          exportExcelCb(res.data, '物业信息')
        })
      } else if (this.type === 'merchant') {
        exportMerchantData(this.formParams).then((res) => {
          exportExcelCb(res.data, '商户信息')
        })
      }
    },
    // 文件上传相关 begin
    uploadRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('type', this.type)
      importExcel(formData).then(res => {
        if (res && parseInt(res.data.code) === 0) {
          this.$message.success(res.data.msg)
          // 上传成功之后清除历史记录
        } else {
          this.$message.error(res.data.msg)
        }
      })
      this.$refs.fileUpload.clearFiles()
    },
    // 文件上传之前校验
    beforeUpload(file) {
      const fileSize = file.size
      if (!file) {
        this.$message.error('请先选取上传的文件')
        return false
      }
      if (file.name.search(/(.xls)$/) < 1 && file.name.search(/(.xlsx)$/) < 1) {
        this.$message.error('请上传xls,xlsx格式的文件')
        return false
      }
      if (fileSize / 1024 / 1024 > 10) {
        this.$notify.error('文件大小不超过10M')
        return false
      }
    }
    // 文件上传相关 end
  }
}
</script>

<style scoped>
.import-excel {
  display: inline-block;
}
</style>
