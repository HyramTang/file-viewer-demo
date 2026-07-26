<script setup>
import { computed, onMounted, ref } from 'vue'
import { DocumentViewer } from '@/components/document-viewer'
import { createDemoFiles } from '@/demo/sampleFiles'

const demos = ref([])
const selectedId = ref('word')
const sourceMode = ref('single')
const theme = ref('light')
const loading = ref(true)
const status = ref({ kind: 'loading', text: '正在生成本地示例文件…' })

const currentDemo = computed(() => demos.value.find((item) => item.id === selectedId.value))
const activeFile = computed(() => currentDemo.value?.file)
const queueFiles = computed(() => (sourceMode.value === 'queue' ? demos.value.map((item) => item.file) : []))

onMounted(async () => {
  try {
    demos.value = await createDemoFiles()
    status.value = { kind: 'ready', text: '示例文件已就绪' }
  } catch (error) {
    status.value = { kind: 'error', text: error instanceof Error ? error.message : '示例生成失败' }
  } finally {
    loading.value = false
  }
})

function selectDemo(id) {
  selectedId.value = id
  sourceMode.value = 'single'
  status.value = { kind: 'loading', text: '正在加载预览…' }
}

function showQueue() {
  sourceMode.value = 'queue'
  status.value = { kind: 'loading', text: '正在加载多文件队列…' }
}

function handleUpload(event) {
  const files = Array.from(event.target.files || [])
  if (!files.length) return

  demos.value = files.map((file, index) => ({
    id: `upload-${Date.now()}-${index}`,
    label: file.name,
    extension: file.name.split('.').pop()?.toUpperCase() || 'FILE',
    description: `${formatFileSize(file.size)} · 本地文件`,
    file,
  }))
  selectedId.value = demos.value[0].id
  sourceMode.value = files.length > 1 ? 'queue' : 'single'
  status.value = { kind: 'loading', text: '正在读取本地文件…' }
  event.target.value = ''
}

function handleLoad(file) {
  status.value = { kind: 'success', text: `${file?.name || activeFile.value?.name || '文件'} 加载成功` }
}

function handleError(error) {
  status.value = { kind: 'error', text: error?.message || '文件预览失败' }
}

function handleUnsupported(file) {
  status.value = { kind: 'error', text: `${file?.name || '当前格式'}暂不支持在线预览` }
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`
  return `${(size / 1024).toFixed(1)} KB`
}
</script>

<template>
  <main class="page-shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Vue 3 · Open File Viewer</p>
        <h1>文档在线预览</h1>
        <p class="hero__description">
          一个可复用的预览组件，统一承载 Office、PDF、图片与文本文件；支持本地文件、远程 URL
          和多文件队列。
        </p>
      </div>

      <a
        class="github-link"
        href="/preview"
      >
        打开 URL 预览页 →
      </a>
    </header>

    <section class="workspace">
      <aside class="control-panel">
        <div class="control-panel__heading">
          <div>
            <span class="section-kicker">DEMO FILES</span>
            <h2>预览示例</h2>
          </div>
          <label class="upload-button">
            本地上传
            <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.png,.jpg" @change="handleUpload" />
          </label>
        </div>

        <div class="demo-list" aria-label="文档预览示例">
          <button
            v-for="demo in demos"
            :key="demo.id"
            type="button"
            class="demo-card"
            :class="{ 'demo-card--active': sourceMode === 'single' && selectedId === demo.id }"
            @click="selectDemo(demo.id)"
          >
            <span class="demo-card__extension">{{ demo.extension }}</span>
            <span class="demo-card__content">
              <strong>{{ demo.label }}</strong>
              <small>{{ demo.description }}</small>
            </span>
            <span class="demo-card__arrow">›</span>
          </button>

          <button
            v-if="demos.length > 1"
            type="button"
            class="demo-card demo-card--queue"
            :class="{ 'demo-card--active': sourceMode === 'queue' }"
            @click="showQueue"
          >
            <span class="demo-card__extension">ALL</span>
            <span class="demo-card__content">
              <strong>多文件队列</strong>
              <small>在工具栏中前后切换文件</small>
            </span>
            <span class="demo-card__arrow">›</span>
          </button>
        </div>

        <div class="settings">
          <label>
            <span>预览主题</span>
            <select v-model="theme">
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="auto">跟随系统</option>
            </select>
          </label>
          <div class="architecture-note">
            <strong>通用封装</strong>
            <p>插件配置、PDF Worker、加载事件和失败降级集中在 DocumentViewer 中维护。</p>
          </div>
        </div>
      </aside>

      <section class="preview-panel">
        <div class="preview-panel__bar">
          <div class="file-heading">
            <span class="file-heading__dot"></span>
            <div>
              <strong>{{ sourceMode === 'queue' ? '多文件预览队列' : activeFile?.name || '准备预览' }}</strong>
              <small v-if="activeFile">{{ sourceMode === 'queue' ? `${demos.length} 个文件` : formatFileSize(activeFile.size) }}</small>
            </div>
          </div>
          <span class="status-pill" :class="`status-pill--${status.kind}`">{{ status.text }}</span>
        </div>

        <div v-if="loading" class="viewer-skeleton">正在准备 DOCX、XLSX、PPTX 和 PDF 示例…</div>
        <DocumentViewer
          v-else
          :key="`${sourceMode}-${selectedId}`"
          :file="activeFile"
          :files="queueFiles"
          :theme="theme"
          height="680px"
          @load="handleLoad"
          @error="handleError"
          @unsupported="handleUnsupported"
        />
      </section>
    </section>

    <section class="capabilities">
      <article>
        <span>01</span>
        <strong>统一输入模型</strong>
        <p>File、Blob、ArrayBuffer、URL 与多文件数组共用一个组件入口。</p>
      </article>
      <article>
        <span>02</span>
        <strong>插件式扩展</strong>
        <p>PDF、Office、图片、文本与兜底插件集中配置，可按项目体积裁剪。</p>
      </article>
      <article>
        <span>03</span>
        <strong>业务可感知</strong>
        <p>加载成功、失败、不支持格式均向上抛出事件，便于接入监控与提示。</p>
      </article>
    </section>
  </main>
</template>
