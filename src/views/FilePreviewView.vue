<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { DocumentViewer } from '@/components/document-viewer'
import { resolveDocumentType, supportedDocumentExtensions } from '@/utils/documentType'

const route = useRoute()
const router = useRouter()

const defaultExamples = [
  {
    id: 'inspection-report',
    title: '工厂设备巡检报告',
    description: '包含巡检摘要、检查项、问题记录、整改建议和签字区域的 Word 报告模板。',
    format: 'DOCX',
    size: '678 KB',
    url: '/samples/factory-inspection-report.docx',
    source: 'DocsAutomator Inspection Report Template',
    sourceUrl: 'https://www.docsautomator.co/templates/free-microsoft-word-reports-templates/inspection-report/',
  },
  {
    id: 'production-schedule',
    title: '生产线工序排程表',
    description: '按生产线和工序组织的日计划与实绩表，带进度条和计划完成率。',
    format: 'XLSX',
    size: '18 KB',
    url: '/samples/production-line-schedule.xlsx',
    source: 'ビズ研生产计划模板',
    sourceUrl: 'https://biztemplatelab.com/template/production_schedule/',
  },
  {
    id: 'machine-guarding',
    title: '机器防护与能源隔离培训',
    description: 'OSHA 制造业仓储安全课程，55 张幻灯片，涵盖机器防护、危险区和锁定挂牌。',
    format: 'PPTX',
    size: '1.5 MB',
    url: '/samples/machine-guarding-training.pptx',
    source: 'OSHA Susan Harwood Training Grant',
    sourceUrl: 'https://obis.osha.gov/dte/grant_materials/fy14/sh-26328-sh4.html',
  },
  {
    id: 'battery-inspection',
    title: '电池制造厂现场检查报告',
    description: 'EPA 对铅酸电池制造设施的实际检查报告，共 17 页，包含现场发现、法规和整改记录。',
    format: 'PDF',
    size: '458 KB',
    url: '/samples/battery-factory-inspection.pdf',
    source: 'U.S. EPA Inspection Report',
    sourceUrl: 'https://www.epa.gov/system/files/documents/2024-11/u.s.-battery-inspection-report.pdf',
  },
]

const defaultUrl = defaultExamples[0].url
const formUrl = ref('')
const formName = ref('')
const status = ref({ kind: 'loading', text: '正在读取文件…' })

const requestedUrl = computed(() => {
  const value = route.query.url
  return Array.isArray(value) ? value[0] || '' : String(value || '')
})

const requestedName = computed(() => {
  const value = route.query.name
  return Array.isArray(value) ? value[0] || '' : String(value || '')
})

const previewUrl = computed(() => requestedUrl.value || defaultUrl)
const documentMeta = computed(() => resolveDocumentType(previewUrl.value, requestedName.value))
const currentExample = computed(() => defaultExamples.find((example) => example.url === previewUrl.value))
const viewerKey = computed(() => `${previewUrl.value}|${documentMeta.value.fileName}`)

watch(
  [previewUrl, requestedName],
  ([url, name]) => {
    formUrl.value = url
    formName.value = name
    status.value = { kind: 'loading', text: '正在读取文件…' }
  },
  { immediate: true },
)

function previewInputUrl() {
  const url = formUrl.value.trim()
  if (!url) return

  router.push({
    name: 'file-preview',
    query: {
      url,
      ...(formName.value.trim() ? { name: formName.value.trim() } : {}),
    },
  })
}

function selectExample(example) {
  router.push({ name: 'file-preview', query: { url: example.url } })
}

function handleLoad(file) {
  status.value = { kind: 'success', text: `${file?.name || documentMeta.value.fileName} 加载成功` }
}

function handleError(error) {
  status.value = {
    kind: 'error',
    text: error?.message || '文件读取失败，请检查地址是否允许跨域访问',
  }
}

function handleUnsupported() {
  status.value = { kind: 'error', text: `暂不支持 .${documentMeta.value.extension || '未知'} 格式` }
}
</script>

<template>
  <main class="file-preview-page">
    <header class="preview-header">
      <div>
        <RouterLink class="back-link" to="/">← 返回 Demo 首页</RouterLink>
        <p class="preview-eyebrow">DOCUMENT PREVIEW ROUTE</p>
        <h1>文件 URL 在线预览</h1>
        <p>通过 <code>/preview?url=文件地址</code> 打开独立预览页，页面会根据 URL 文件后缀选择渲染器。</p>
      </div>
      <div class="format-tags" aria-label="支持格式">
        <span>WORD</span><span>EXCEL</span><span>PPT</span><span>PDF</span>
      </div>
    </header>

    <form class="url-form" @submit.prevent="previewInputUrl">
      <label class="url-field">
        <span>文件 URL</span>
        <input v-model="formUrl" type="text" placeholder="https://example.com/manual.docx" />
      </label>
      <label class="name-field">
        <span>文件名（可选）</span>
        <input v-model="formName" type="text" placeholder="URL 无后缀时填写，例如 manual.pdf" />
      </label>
      <button type="submit">读取并预览</button>
    </form>

    <p class="url-tip">
      外部地址需要允许浏览器跨域读取；支持的后缀包括 {{ supportedDocumentExtensions.join('、') }}。
    </p>

    <section class="preview-layout">
      <aside class="example-panel">
        <div class="example-panel__heading">
          <span>FACTORY DOCUMENTS</span>
          <h2>工厂场景示例</h2>
          <p>示例文件已放入项目静态目录，不依赖外部服务即可预览。</p>
        </div>

        <div class="factory-examples">
          <article
            v-for="example in defaultExamples"
            :key="example.id"
            class="factory-card"
            :class="{ 'factory-card--active': example.url === previewUrl }"
          >
            <button type="button" @click="selectExample(example)">
              <span class="factory-card__format">{{ example.format }}</span>
              <span class="factory-card__body">
                <strong>{{ example.title }}</strong>
                <small>{{ example.description }}</small>
                <em>{{ example.size }}</em>
              </span>
              <span class="factory-card__arrow">›</span>
            </button>
            <div class="factory-card__links">
              <RouterLink :to="{ name: 'pure-file-viewer', query: { url: example.url } }">
                纯净预览 ↗
              </RouterLink>
              <a :href="example.sourceUrl" target="_blank" rel="noreferrer">来源：{{ example.source }} ↗</a>
            </div>
          </article>
        </div>
      </aside>

      <section class="viewer-panel">
        <div class="viewer-panel__meta">
          <div>
            <span class="type-badge" :class="`type-badge--${documentMeta.type}`">
              {{ documentMeta.extension.toUpperCase() || 'FILE' }}
            </span>
            <div>
              <strong>{{ currentExample?.title || documentMeta.fileName || '远程文件' }}</strong>
              <small>{{ documentMeta.label }} · {{ documentMeta.fileName }}</small>
            </div>
          </div>
          <span class="route-status" :class="`route-status--${status.kind}`">{{ status.text }}</span>
        </div>

        <div v-if="!documentMeta.supported" class="unsupported-message">
          <strong>无法从地址识别受支持的文件类型</strong>
          <p>请确认 URL 以 Office 或 PDF 后缀结尾；如果下载地址没有后缀，可以填写“文件名”参数辅助识别。</p>
        </div>
        <DocumentViewer
          v-else
          :key="viewerKey"
          :file="previewUrl"
          :file-name="documentMeta.fileName"
          height="720px"
          theme="light"
          @load="handleLoad"
          @error="handleError"
          @unsupported="handleUnsupported"
        />
      </section>
    </section>
  </main>
</template>

<style scoped>
.file-preview-page {
  width: min(1640px, 100%);
  min-height: 100vh;
  margin: 0 auto;
  padding: 36px clamp(18px, 4vw, 60px) 54px;
}

.preview-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
}

.back-link {
  display: inline-block;
  margin-bottom: 22px;
  color: #64748b;
  font-size: 13px;
  font-weight: 650;
}

.preview-eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.17em;
}

.preview-header h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 780;
  letter-spacing: -0.045em;
}

.preview-header p:last-child {
  max-width: 780px;
  margin: 13px 0 0;
  color: #64748b;
  line-height: 1.7;
}

.preview-header code {
  padding: 2px 7px;
  border-radius: 6px;
  background: #dfe9f8;
  color: #174ea6;
}

.format-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.format-tags span {
  padding: 7px 9px;
  border: 1px solid #d6dfeb;
  border-radius: 7px;
  background: rgb(255 255 255 / 70%);
  color: #536176;
  font-size: 10px;
  font-weight: 800;
}

.url-form {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(220px, 0.38fr) auto;
  align-items: end;
  gap: 12px;
  margin-top: 28px;
  padding: 16px;
  border: 1px solid #dbe3ed;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 14px 40px rgb(25 39 65 / 7%);
}

.url-form label {
  display: grid;
  gap: 7px;
}

.url-form label span {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
}

.url-form input {
  width: 100%;
  height: 43px;
  padding: 0 12px;
  border: 1px solid #d6dee9;
  border-radius: 9px;
  outline: none;
  color: #253148;
}

.url-form input:focus {
  border-color: #6694e8;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 10%);
}

.url-form button {
  height: 43px;
  padding: 0 18px;
  border-radius: 9px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 720;
}

.url-tip {
  margin: 9px 4px 24px;
  color: #7b8799;
  font-size: 11px;
}

.preview-layout {
  display: grid;
  grid-template-columns: 350px minmax(0, 1fr);
  gap: 18px;
}

.example-panel {
  align-self: start;
  padding: 20px;
  border: 1px solid #dce4ed;
  border-radius: 18px;
  background: #f8fafc;
}

.example-panel__heading > span {
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.example-panel h2 {
  margin: 5px 0 0;
  color: #1a2639;
  font-size: 20px;
}

.example-panel__heading p {
  margin: 8px 0 18px;
  color: #77859a;
  font-size: 11px;
  line-height: 1.6;
}

.factory-examples {
  display: grid;
  gap: 10px;
}

.factory-card {
  overflow: hidden;
  border: 1px solid #dfe6ef;
  border-radius: 12px;
  background: #fff;
  transition: 150ms ease;
}

.factory-card--active {
  border-color: #9fbcf2;
  box-shadow: 0 8px 24px rgb(37 99 235 / 10%);
}

.factory-card button {
  display: grid;
  grid-template-columns: 43px minmax(0, 1fr) 14px;
  align-items: start;
  gap: 11px;
  width: 100%;
  padding: 13px;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.factory-card__format {
  display: grid;
  width: 43px;
  height: 43px;
  place-items: center;
  border-radius: 10px;
  background: #eaf0f8;
  color: #40536e;
  font-size: 9px;
  font-weight: 850;
}

.factory-card--active .factory-card__format {
  background: #2563eb;
  color: #fff;
}

.factory-card__body {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.factory-card__body strong {
  color: #253047;
  font-size: 12px;
  font-weight: 750;
}

.factory-card__body small {
  color: #748297;
  font-size: 10px;
  line-height: 1.5;
}

.factory-card__body em {
  color: #95a0af;
  font-size: 9px;
  font-style: normal;
}

.factory-card__arrow {
  color: #8b98aa;
  font-size: 20px;
}

.factory-card__links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 13px;
  border-top: 1px solid #eef2f6;
  font-size: 9px;
}

.factory-card__links a {
  overflow: hidden;
  color: #718096;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.factory-card__links a:first-child {
  flex: 0 0 auto;
  color: #2563eb;
  font-weight: 750;
}

.viewer-panel {
  min-width: 0;
}

.viewer-panel__meta {
  display: flex;
  min-height: 58px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 11px;
  padding: 0 4px;
}

.viewer-panel__meta > div {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.viewer-panel__meta > div > div {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.viewer-panel__meta strong,
.viewer-panel__meta small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.viewer-panel__meta strong {
  color: #253148;
  font-size: 13px;
}

.viewer-panel__meta small {
  color: #7b8798;
  font-size: 10px;
}

.type-badge {
  min-width: 45px;
  padding: 7px 8px;
  border-radius: 8px;
  background: #e9eef5;
  color: #465872;
  font-size: 9px;
  font-weight: 850;
  text-align: center;
}

.type-badge--word { background: #e9f1ff; color: #2563ba; }
.type-badge--excel { background: #e8f7ef; color: #187744; }
.type-badge--powerpoint { background: #fff0e9; color: #bd4b21; }
.type-badge--pdf { background: #ffebec; color: #bd3037; }

.route-status {
  max-width: 45%;
  overflow: hidden;
  padding: 6px 10px;
  border-radius: 999px;
  background: #edf1f6;
  color: #66758b;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.route-status--success {
  background: #e9f7ee;
  color: #16803c;
}

.route-status--error {
  background: #ffeded;
  color: #bc3434;
}

.unsupported-message {
  display: grid;
  min-height: 480px;
  place-content: center;
  padding: 30px;
  border: 1px solid #dfe5ec;
  border-radius: 16px;
  background: #fff;
  color: #65748a;
  text-align: center;
}

.unsupported-message strong {
  color: #26334a;
}

.unsupported-message p {
  max-width: 540px;
  line-height: 1.7;
}

@media (max-width: 1060px) {
  .preview-layout {
    grid-template-columns: 1fr;
  }

  .factory-examples {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .preview-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .format-tags {
    justify-content: flex-start;
  }

  .url-form {
    grid-template-columns: 1fr;
  }

  .factory-examples {
    grid-template-columns: 1fr;
  }

  .viewer-panel__meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .route-status {
    max-width: 100%;
  }
}
</style>
