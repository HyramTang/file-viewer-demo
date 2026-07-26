import JSZip from 'jszip'

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
</Types>`

const rootRelationship = (target) => `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="${target}"/>
</Relationships>`

async function createZipFile(name, type, entries) {
  const zip = new JSZip()
  entries.forEach(({ path, content }) => zip.file(path, content))
  const blob = await zip.generateAsync({ type: 'blob' })
  return new File([blob], name, { type })
}

async function createWordSample() {
  const contentTypes = CONTENT_TYPES.replace(
    '</Types>',
    '  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>\n</Types>',
  )
  const document = `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="34"/></w:rPr><w:t>在线文档预览方案</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:color w:val="64748B"/></w:rPr><w:t>Open File Viewer · Vue 3 集成示例</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/><w:sz w:val="26"/></w:rPr><w:t>方案说明</w:t></w:r></w:p>
    <w:p><w:r><w:t>该示例展示 DOCX 文件在浏览器中的本地解析与渲染。文件不会上传到服务器，预览器被封装在统一的 Vue 组件中。</w:t></w:r></w:p>
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>核心能力</w:t></w:r></w:p>
    <w:p><w:r><w:t>1. 支持 File、Blob、ArrayBuffer 与远程 URL。</w:t></w:r></w:p>
    <w:p><w:r><w:t>2. PDF 与 Office 通过插件按格式匹配。</w:t></w:r></w:p>
    <w:p><w:r><w:t>3. 统一暴露加载成功、失败和不支持格式事件。</w:t></w:r></w:p>
    <w:tbl>
      <w:tr><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>格式</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>渲染插件</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>状态</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:t>DOCX</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>officePlugin</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>可预览</w:t></w:r></w:p></w:tc></w:tr>
      <w:tr><w:tc><w:p><w:r><w:t>PDF</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>pdfPlugin</w:t></w:r></w:p></w:tc><w:tc><w:p><w:r><w:t>可预览</w:t></w:r></w:p></w:tc></w:tr>
    </w:tbl>
    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1200" w:right="1200" w:bottom="1200" w:left="1200"/></w:sectPr>
  </w:body>
</w:document>`

  return createZipFile(
    'vue3-preview-report.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    [
      { path: '[Content_Types].xml', content: contentTypes },
      { path: '_rels/.rels', content: rootRelationship('word/document.xml') },
      { path: 'word/document.xml', content: document },
    ],
  )
}

async function createExcelSample() {
  const contentTypes = CONTENT_TYPES.replace(
    '</Types>',
    `  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
  )
  const workbook = `<?xml version="1.0" encoding="UTF-8"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="预览能力" sheetId="1" r:id="rId1"/><sheet name="测试数据" sheetId="2" r:id="rId2"/></sheets>
</workbook>`
  const workbookRels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
</Relationships>`
  const sheet1 = worksheet([
    ['格式', '插件', '数据来源', '结果'],
    ['DOCX', 'officePlugin', '本地 File', '通过'],
    ['XLSX', 'officePlugin', '本地 File', '通过'],
    ['PPTX', 'officePlugin', '本地 File', '通过'],
    ['PDF', 'pdfPlugin', '本地 File', '通过'],
  ])
  const sheet2 = worksheet([
    ['月份', '预览次数', '成功率', '平均耗时(ms)'],
    ['1 月', 1280, '99.1%', 340],
    ['2 月', 1624, '99.4%', 318],
    ['3 月', 1988, '99.6%', 295],
  ])

  return createZipFile(
    'preview-statistics.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    [
      { path: '[Content_Types].xml', content: contentTypes },
      { path: '_rels/.rels', content: rootRelationship('xl/workbook.xml') },
      { path: 'xl/workbook.xml', content: workbook },
      { path: 'xl/_rels/workbook.xml.rels', content: workbookRels },
      { path: 'xl/worksheets/sheet1.xml', content: sheet1 },
      { path: 'xl/worksheets/sheet2.xml', content: sheet2 },
    ],
  )
}

function worksheet(rows) {
  const body = rows
    .map(
      (row, rowIndex) =>
        `<row r="${rowIndex + 1}">${row
          .map((value, columnIndex) => {
            const cell = `${String.fromCharCode(65 + columnIndex)}${rowIndex + 1}`
            return typeof value === 'number'
              ? `<c r="${cell}"><v>${value}</v></c>`
              : `<c r="${cell}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`
          })
          .join('')}</row>`,
    )
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`
}

async function createPowerPointSample() {
  const contentTypes = CONTENT_TYPES.replace(
    '</Types>',
    `  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>`,
  )
  const presentation = `<?xml version="1.0" encoding="UTF-8"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <p:sldIdLst><p:sldId id="256" r:id="rId1"/><p:sldId id="257" r:id="rId2"/></p:sldIdLst>
  <p:sldSz cx="9144000" cy="5143500" type="screen16x9"/><p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`
  const presentationRels = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide2.xml"/>
</Relationships>`

  return createZipFile(
    'document-preview-plan.pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    [
      { path: '[Content_Types].xml', content: contentTypes },
      { path: '_rels/.rels', content: rootRelationship('ppt/presentation.xml') },
      { path: 'ppt/presentation.xml', content: presentation },
      { path: 'ppt/_rels/presentation.xml.rels', content: presentationRels },
      {
        path: 'ppt/slides/slide1.xml',
        content: pptxSlide('Vue 3 文档在线预览', [
          '统一组件 · 插件式渲染 · 本地文件安全预览',
          '基于 xushanpei/open-file-viewer',
        ]),
      },
      {
        path: 'ppt/slides/slide2.xml',
        content: pptxSlide('封装边界', [
          '1. 业务层只传文件、尺寸、主题和工具栏配置',
          '2. 组件层集中维护格式插件与 PDF Worker',
          '3. demo 层负责样例选择、本地上传和状态展示',
        ]),
      },
    ],
  )
}

function pptxSlide(title, lines) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="F8FAFC"/></a:solidFill></p:bgPr></p:bg>
    <p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      ${pptxTextBox(2, 'Title', title, 685800, 685800, 7772400, 914400, 3400, true, '0F172A')}
      ${pptxTextBox(3, 'Body', lines.join('\n'), 822960, 1828800, 7498080, 2286000, 1900, false, '334155')}
    </p:spTree>
  </p:cSld>
</p:sld>`
}

function pptxTextBox(id, name, text, x, y, cx, cy, fontSize, bold, color) {
  const paragraphs = text
    .split('\n')
    .map(
      (line) => `<a:p><a:r><a:rPr lang="zh-CN" sz="${fontSize}"${bold ? ' b="1"' : ''}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill></a:rPr><a:t>${escapeXml(line)}</a:t></a:r><a:endParaRPr lang="zh-CN" sz="${fontSize}"/></a:p>`,
    )
    .join('')
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${name}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square"><a:spAutoFit/></a:bodyPr><a:lstStyle/>${paragraphs}</p:txBody></p:sp>`
}

function createPdfSample() {
  const content = `BT /F1 26 Tf 72 710 Td (Open File Viewer - PDF Demo) Tj
0 -46 Td /F1 14 Tf (Vue 3 reusable document preview component) Tj
0 -44 Td /F1 11 Tf (Source: local File object generated in the browser.) Tj
0 -22 Td (Renderer: pdfPlugin with an explicit pdf.js worker URL.) Tj
0 -22 Td (Toolbar: zoom, rotate, download, print and fullscreen.) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return new File([pdf], 'open-file-viewer-demo.pdf', { type: 'application/pdf' })
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export async function createDemoFiles() {
  const [word, excel, powerpoint] = await Promise.all([
    createWordSample(),
    createExcelSample(),
    createPowerPointSample(),
  ])
  const pdf = createPdfSample()

  return [
    { id: 'word', label: 'Word 文档', extension: 'DOCX', description: '标题、段落与表格布局', file: word },
    { id: 'excel', label: 'Excel 表格', extension: 'XLSX', description: '多工作表与数据表格', file: excel },
    { id: 'powerpoint', label: 'PowerPoint', extension: 'PPTX', description: '两页演示文稿预览', file: powerpoint },
    { id: 'pdf', label: 'PDF 文档', extension: 'PDF', description: 'PDF.js 本地渲染', file: pdf },
  ]
}
