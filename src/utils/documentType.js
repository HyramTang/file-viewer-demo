const formatGroups = {
  word: ['doc', 'docx', 'docm', 'dot', 'dotx', 'rtf', 'odt', 'wps'],
  excel: ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv', 'ods', 'et'],
  powerpoint: ['ppt', 'pptx', 'pptm', 'pps', 'ppsx', 'odp', 'dps'],
  pdf: ['pdf'],
}

const formatLabels = {
  word: 'Word 文档',
  excel: 'Excel 表格',
  powerpoint: 'PowerPoint 演示文稿',
  pdf: 'PDF 文档',
}

const extensionTypeMap = Object.fromEntries(
  Object.entries(formatGroups).flatMap(([type, extensions]) => extensions.map((extension) => [extension, type])),
)

export function getFileNameFromUrl(url, fallbackName = '') {
  if (fallbackName.trim()) return fallbackName.trim()
  if (!url) return ''

  try {
    const parsedUrl = new URL(url, window.location.origin)
    return decodeURIComponent(parsedUrl.pathname.split('/').filter(Boolean).pop() || '')
  } catch {
    const cleanUrl = url.split(/[?#]/)[0]
    const name = cleanUrl.split('/').filter(Boolean).pop() || ''
    try {
      return decodeURIComponent(name)
    } catch {
      return name
    }
  }
}

export function resolveDocumentType(url, fallbackName = '') {
  const fileName = getFileNameFromUrl(url, fallbackName)
  const extension = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : ''
  const type = extensionTypeMap[extension] || 'unknown'

  return {
    extension,
    fileName,
    type,
    label: formatLabels[type] || '未知文件类型',
    supported: type !== 'unknown',
  }
}

export const supportedDocumentExtensions = Object.keys(extensionTypeMap)
