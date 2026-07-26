# Vue 3 文档在线预览 Demo

基于 [xushanpei/open-file-viewer](https://github.com/xushanpei/open-file-viewer) 实现的 Office、PDF 等文件在线预览示例。

主要内容：

- `DocumentViewer` 通用组件封装
- PDF.js Worker 与格式插件集中配置
- DOCX、XLSX、PPTX、PDF 内置示例
- 本地单文件/多文件上传与预览队列
- `/preview?url=文件地址` 独立 URL 预览路由
- 工厂巡检、生产排程、机器防护和制造设施检查默认示例
- 加载成功、失败、不支持格式事件

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
