import {
  fallbackPlugin,
  imagePlugin,
  officePlugin,
  pdfPlugin,
  textPlugin,
} from '@open-file-viewer/core'
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'

/**
 * Keep the renderer list in one place. Business projects can add or remove
 * plugins here without changing every preview entry point.
 */
export const defaultViewerPlugins = Object.freeze([
  pdfPlugin({ workerSrc: pdfWorkerSrc }),
  officePlugin(),
  imagePlugin(),
  textPlugin(),
  fallbackPlugin(),
])
