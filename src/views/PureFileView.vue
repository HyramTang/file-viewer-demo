<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { DocumentViewer } from '@/components/document-viewer'
import { resolveDocumentType } from '@/utils/documentType'

const route = useRoute()
const loadError = ref('')

const fileUrl = computed(() => {
  const value = route.query.url
  return Array.isArray(value) ? value[0] || '' : String(value || '')
})

const fileName = computed(() => {
  const value = route.query.name
  return Array.isArray(value) ? value[0] || '' : String(value || '')
})

const documentMeta = computed(() => resolveDocumentType(fileUrl.value, fileName.value))

function handleError(error) {
  loadError.value = error?.message || '文件读取失败'
}
</script>

<template>
  <main class="pure-file-view">
    <DocumentViewer
      v-if="fileUrl && documentMeta.supported && !loadError"
      :file="fileUrl"
      :file-name="documentMeta.fileName"
      height="100vh"
      width="100%"
      fit="contain"
      theme="light"
      :toolbar="false"
      plain
      @error="handleError"
    />
    <p v-else class="pure-file-view__error">
      {{ loadError || '缺少有效的文件 URL，或文件格式暂不支持' }}
    </p>
  </main>
</template>

<style scoped>
.pure-file-view {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f7fa;
}

.pure-file-view__error {
  display: grid;
  height: 100%;
  margin: 0;
  place-items: center;
  padding: 24px;
  color: #64748b;
  text-align: center;
}

</style>
