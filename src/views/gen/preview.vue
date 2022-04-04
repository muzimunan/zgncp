<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane v-for="item in data" :key="item.k" :lazy="true" :label="item.k" :name="item.k">
      <Java :value="item.v" height="600px" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Java from '@/components/editor/index'
import { preview } from '@/api/gen/gen'

export default {
  name: 'PreviewPage',
  components: { Java },
  props: {
    queryData: {}
  },
  data() {
    return {
      data: [], height: '', activeName: 'Entity.java'
    }
  },
  created() {
    preview(this.queryData).then(res => {
      const map = res.data.data

      for (const key in map) {
        const k = key.replace(/^template\/|.vm$/g, '')
        const v = map[key]
        const obj = { k, v }
        this.data.push(obj)
      }
    })
  }
}
</script>
