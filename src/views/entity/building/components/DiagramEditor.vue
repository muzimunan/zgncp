<template>
  <div id="editor">
    <el-button type="primary" plain v-if="!editable" @click="editable = true">编辑</el-button>
    <!-- <span > -->
      <!-- <el-button type="primary" plain @click="openModal">添加新节点</el-button> -->
      <el-button v-else type="primary" plain @click="endEdit">结束编辑</el-button>
    <!-- </span> -->
    <el-button type="primary" plain @click="openInputModal">导入svg</el-button>
    <el-button type="primary" plain @click="downloadSVG">下载svg</el-button>
    <el-button type="primary" plain @click="askClearDiagram">清空画布</el-button>
    <el-button type="primary" plain @click="openSettingsModal">设置画布</el-button>
    <EditNodeModal :node="{ content: {} }" :isActive="isModalActive" @ok="addNode" @cancel="cancel" />
    <EditNodeModal :node="tmpNode" :isActive="isEditModalActive" @ok="editNode" @cancel="cancel" />
    <EditLinkModal :link="tmpLink" :isActive="isEditLinkModalActive" @ok="editLink" @cancel="cancel" />
    <InputModal :text="json" :isActive="isInputModalActive" @ok="importData" @cancel="cancel" />
    <SettingsModal :isActive="isSettingsModalActive" :settings="settings" @ok="updateSettings" @cancel="cancel" />
    <Diagram
      :width="graphData.width || 2000"
      :height="graphData.height || 1000"
      :fluid="settings.isFluid"
      :scale="settings.scale"
      :background="graphData.background || '#fafafa'"
      :showGrid="graphData.showGrid"
      :nodes="graphData.nodes"
      :links="graphData.links"
      :editable="editable"
      :labels="
        graphData.labels || {
          edit: '编辑',
          remove: '移除',
          link: '新的连线',
          select: '选中',
          cancel: '取消',
          copy: '复制',
        }
      "
      @editNode="openNodeEdit"
      @editLink="openLinkEdit"
      @nodeClicked="nodeClicked"
      @linkClicked="linkClicked"
      @nodeChanged="nodeChanged"
      @linkChanged="linkChanged"
      @nodeRemoved="nodeRemoved"
      @linkRemoved="linkRemoved"
    ></Diagram>
  </div>
</template>

<script>
import Diagram from './Diagram'
// import EditNodeModal from '@/lib/EditNodeModal'
// import EditLinkModal from '@/lib/EditLinkModal'
// import InputModal from '@/lib/InputModal'
// import AskModal from '@/lib/AskModal'
// import SettingsModal from '@/lib/SettingsModal'
export default {
  name: 'DiagramEditor',
  components: {
    Diagram
    // EditNodeModal,
    // EditLinkModal,
    // InputModal,
    // AskModal,
    // SettingsModal
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          width: 2000,
          height: 1000,
          background: '#fafafa',
          showGrid: false,
          labels: {
            edit: 'Edit',
            remove: 'Remove',
            link: 'New Link',
            select: 'Select',
            copy: 'Copy'
          },
          nodes: [],
          links: []
        }
      }
    }
  },
  computed: {
    graphData: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      name: '',
      url: '',
      color: '',
      json: '',
      isModalActive: false,
      isEditModalActive: false,
      isEditLinkModalActive: false,
      isInputModalActive: false,
      isSettingsModalActive: false,
      editable: true,
      settings: {
        width: 1500,
        height: 1000,
        isFluid: false,
        scale: '1',
        showGrid: false
      },
      tmpNode: {
        id: '',
        shape: 'rectangle',
        width: 0,
        height: 0,
        content: {
          text: '',
          url: '',
          color: ''
        }
      },
      tmpLink: {
        id: '',
        content: {
          color: '',
          pattern: 'solid',
          arrow: 'none'
        }
      }
    }
  },
  methods: {
    clearDiagram() {
      this.graphData.nodes = []
      this.graphData.links = []
    },
    generateID() {
      return (
        new Date().getTime().toString(16) +
        Math.floor(Math.random() * 1000000).toString(16)
      )
    },
    openModal() {
      this.isModalActive = true
    },
    cancel() {
      this.isModalActive = false
      this.isEditModalActive = false
      this.isEditLinkModalActive = false
      this.isInputModalActive = false
      this.isSettingsModalActive = false
    },
    addNode(item) {
      this.graphData.nodes.push({
        id: this.generateID(),
        content: {
          text: item.content.text,
          url: item.content.url,
          color: item.content.color
        },
        width: parseInt(item.width) || 150,
        height: parseInt(item.height) || 60,
        stroke: item.stroke,
        strokeWeight: item.strokeWeight,
        shape: item.shape,
        point: {
          x: 10,
          y: 100 + Math.random() * 100
        }
      })
      this.isModalActive = false
    },
    openNodeEdit(item) {
      this.tmpNode.id = item.id
      this.tmpNode.content.text = item.content.text
      this.tmpNode.content.url = item.content.url
      this.tmpNode.content.color = item.content.color
      this.tmpNode.shape = item.shape
      this.tmpNode.stroke = item.stroke
      this.tmpNode.strokeWeight = item.strokeWeight
      this.tmpNode.width = item.width
      this.tmpNode.height = item.height
      this.isModalActive = false
      this.isEditModalActive = true
    },
    editNode(item) {
      const tmp = this.graphData.nodes.find((x) => x.id === item.id)
      tmp.content.text = item.content.text
      tmp.content.url = item.content.url
      tmp.content.color = item.content.color
      tmp.shape = item.shape
      tmp.stroke = item.stroke
      tmp.strokeWeight = item.strokeWeight
      tmp.width = parseInt(item.width)
      tmp.height = parseInt(item.height)
      this.isEditModalActive = false
    },
    openLinkEdit(item) {
      this.tmpLink.id = item.id
      this.tmpLink.content = Object.assign({}, item.content)
      this.isEditLinkModalActive = true
    },
    editLink(item) {
      const tmp = this.graphData.links.find((x) => x.id === item.id)
      tmp.color = item.content.color
      tmp.shape = item.content.shape
      tmp.pattern = item.content.pattern
      tmp.arrow = item.content.arrow
      this.isEditLinkModalActive = false
    },
    endEdit() {
      this.editable = false
    },
    nodeClicked(id) {
      this.$emit('nodeClicked', id)
    },
    linkClicked(id) {
      this.$emit('linkClicked', id)
    },
    nodeRemoved(id) {
      this.$emit('nodeRemoved', id)
    },
    linkRemoved(id) {
      this.$emit('linkRemoved', id)
    },
    nodeChanged(obj) {
      this.graphData.nodes = obj.nodes
    },
    linkChanged(obj) {
      this.graphData.links = obj.links
    },
    openInputModal() {
      this.isInputModalActive = true
      this.json = JSON.stringify(this.graphData)
    },
    importData(value) {
      const obj = JSON.parse(value.text)
      if (obj) {
        this.graphData = obj
        this.isInputModalActive = false
      }
    },
    downloadSVG() {
      const blob = new Blob(
        [document.getElementById('svg-diagram-show-area').innerHTML],
        {
          type: 'image/svg+xml'
        }
      )
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'image.svg'
      link.click()
    },
    changeGrid() {
      this.graphData.width = parseInt(this.settings.width)
      this.graphData.height = parseInt(this.settings.height)
      this.graphData.showGrid = this.settings.showGrid
    },
    openSettingsModal() {
      this.isSettingsModalActive = true
      this.settings.width = this.graphData.width
      this.settings.height = this.graphData.height
      this.settings.showGrid = this.graphData.showGrid
    },
    updateSettings(val) {
      this.settings = Object.assign({}, val)
      this.changeGrid()
      this.isSettingsModalActive = false
    },
    askClearDiagram() {
      this.$confirm('清空画布之后将不能恢复，是否要清空画布？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.clearDiagram()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>
