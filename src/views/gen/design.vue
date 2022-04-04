<template>
  <div class="webapp">
    <basic-container>
      <avue-form-design :options="option" @submit="handleSubmit" />
    </basic-container>
  </div>
</template>

<script>
import AvueUeditor from 'avue-plugin-ueditor'
import { getForm, postForm } from '@/api/gen/gen'
import { validatenull } from '@/util/validate'

export default {
  name: 'GenPage',
  comments: {
    AvueUeditor
  },
  data() {
    return {
      option: {
        column: []
      }
    }
  },
  created() {
    this.getFormInfo()
  },
  methods: {
    handleSubmit(json) {
      const params = this.$route.query
      if (validatenull(params)) {
        return false
      }
      const result = JSON.stringify(json)
      postForm(result, params.tableName, params.dsName).then((response) => {
        this.$message.success('生成并保存成功')
      })
    },
    getFormInfo() {
      const params = this.$route.query
      if (validatenull(params)) {
        return false
      }
      getForm(params.tableName, params.dsName).then((response) => {
        if (!validatenull(response.data.data)) {
          this.option = JSON.parse(response.data.data)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.webapp {
  background-color: #fff;
  position: relative;
  width: 100%;
  height: 100%;

  .form-designer {
    height: 800px;
    overflow-y: scroll;
  }

  .form-designer .widget-config-container .el-tabs__header {
    position: relative;
  }
}
</style>
