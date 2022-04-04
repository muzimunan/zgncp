<template>
  <div class="edit-svg-wrap">
    <div class="znp-form-wraper" style="width: 100%; height: 100%">
      <DiagramEditor v-model="graph"></DiagramEditor>
    </div>
  </div>
</template>

<script>
import DiagramEditor from './DiagramEditor'// 【在线svg编辑器】
import data from './data.json'
export default {
  name: 'EditSvg',
  components: {
    DiagramEditor
  },
  data() {
    return {
      graph: {}
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.graph = data
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/znp-common.scss';
</style>
