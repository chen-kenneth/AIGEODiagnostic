/**
 * translations.js — 兼容层
 *
 * 实际文案已移至 src/content/<行业>.js（当前：realtors.js）。
 * 组件继续从这里 import，无需改动。
 */
export { realtors } from '../content/realtors'

import { realtors } from '../content/realtors'
export const translations = { zh: realtors.zh, en: realtors.en }
