<script setup>
import { computed } from 'vue'
import { OpenFileViewer } from '@open-file-viewer/vue'
import { defaultViewerPlugins } from './viewerPlugins'

const props = defineProps({
  file: {
    type: [String, Blob, ArrayBuffer, File],
    default: undefined,
  },
  files: {
    type: Array,
    default: () => [],
  },
  fileName: {
    type: String,
    default: '',
  },
  mimeType: {
    type: String,
    default: '',
  },
  height: {
    type: [String, Number],
    default: '680px',
  },
  width: {
    type: [String, Number],
    default: '100%',
  },
  fit: {
    type: String,
    default: 'contain',
  },
  theme: {
    type: String,
    default: 'light',
  },
  toolbar: {
    type: [Boolean, Object],
    default: true,
  },
  plugins: {
    type: Array,
    default: () => defaultViewerPlugins,
  },
})

const emit = defineEmits(['load', 'error', 'unsupported'])

const hasSource = computed(() => Boolean(props.file) || props.files.length > 0)

const resolvedFileName = computed(() => {
  if (props.fileName) return props.fileName
  if (props.file instanceof File) return props.file.name
  return undefined
})
</script>

<template>
  <div class="document-viewer">
    <OpenFileViewer
      v-if="hasSource"
      :file="file"
      :files="files.length ? files : undefined"
      :file-name="resolvedFileName"
      :mime-type="mimeType || undefined"
      :width="width"
      :height="height"
      :fit="fit"
      :theme="theme"
      :toolbar="toolbar"
      :plugins="plugins"
      fallback="download"
      locale="zh-CN"
      class-name="document-viewer__canvas"
      @load="emit('load', $event)"
      @error="(error, source) => emit('error', error, source)"
      @unsupported="emit('unsupported', $event)"
    />

    <div v-else class="document-viewer__empty">
      <span class="document-viewer__empty-icon">＋</span>
      <strong>请选择需要预览的文件</strong>
      <p>支持本地 File、Blob、ArrayBuffer 和允许跨域访问的 URL。</p>
    </div>
  </div>
</template>

<style scoped>
.document-viewer {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dfe5ec;
  border-radius: 16px;
  background: #f5f7fa;
  box-shadow: 0 18px 50px rgb(15 23 42 / 8%);
}

.document-viewer__canvas {
  min-width: 0;
}

.document-viewer__empty {
  display: grid;
  min-height: 420px;
  place-content: center;
  justify-items: center;
  padding: 32px;
  color: #64748b;
  text-align: center;
}

.document-viewer__empty-icon {
  display: grid;
  width: 52px;
  height: 52px;
  margin-bottom: 16px;
  place-items: center;
  border-radius: 14px;
  background: #e8eef7;
  color: #2563eb;
  font-size: 30px;
}

.document-viewer__empty strong {
  color: #1e293b;
  font-size: 17px;
}

.document-viewer__empty p {
  margin-top: 8px;
  font-size: 13px;
}
</style>
