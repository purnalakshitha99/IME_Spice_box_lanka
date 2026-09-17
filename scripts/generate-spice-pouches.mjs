/**
 * Generates consistent SpiceBox Lanka kraft stand-up pouch product images (SVG).
 * Run: node scripts/generate-spice-pouches.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'products', 'spices')

const spices = [
  {
    file: 'turmeric',
    label: 'TURMERIC',
    accent: '#C45C26',
    windowFill: '#E8A317',
    botanical: 'turmeric',
  },
  {
    file: 'cumin',
    label: 'CUMIN',
    accent: '#8B6914',
    windowFill: '#C4A35A',
    botanical: 'seeds',
  },
  {
    file: 'coriander',
    label: 'CORIANDER',
    accent: '#6B8E4E',
    windowFill: '#D4C4A0',
    botanical: 'round-seeds',
  },
  {
    file: 'cardamom',
    label: 'CARDAMOM',
    accent: '#4A7C59',
    windowFill: '#7BA05B',
    botanical: 'cardamom',
  },
  {
    file: 'cinnamon',
    label: 'CEYLON CINNAMON',
    accent: '#8B4513',
    windowFill: '#A0522D',
    botanical: 'cinnamon',
  },
  {
    file: 'cloves',
    label: 'CLOVES',
    accent: '#5C3317',
    windowFill: '#3D2314',
    botanical: 'cloves',
  },
  {
    file: 'nutmeg',
    label: 'NUTMEG',
    accent: '#9C6B3C',
    windowFill: '#C4A484',
    botanical: 'nutmeg',
  },
  {
    file: 'ginger',
    label: 'GINGER',
    accent: '#B8860B',
    windowFill: '#E8D5A3',
    botanical: 'ginger',
  },
  {
    file: 'fenugreek',
    label: 'FENUGREEK',
    accent: '#C9A227',
    windowFill: '#D4A84B',
    botanical: 'angular-seeds',
  },
  {
    file: 'mustard-seeds',
    label: 'MUSTARD SEEDS',
    accent: '#5C4033',
    windowFill: '#2C1810',
    botanical: 'tiny-seeds',
  },
  {
    file: 'black-pepper',
    label: 'BLACK PEPPER',
    accent: '#3D2B1F',
    windowFill: '#1A120B',
    botanical: 'pepper',
  },
  {
    file: 'red-chili',
    label: 'RED CHILI',
    accent: '#B22222',
    windowFill: '#C41E3A',
    botanical: 'chili',
  },
  {
    file: 'bay-leaf',
    label: 'BAY LEAF',
    accent: '#556B2F',
    windowFill: '#6B7F3A',
    botanical: 'bay',
  },
  {
    file: 'star-anise',
    label: 'STAR ANISE',
    accent: '#8B3A2A',
    windowFill: '#6B2D1F',
    botanical: 'star',
  },
  {
    file: 'saffron',
    label: 'SAFFRON',
    accent: '#C41E3A',
    windowFill: '#DC143C',
    botanical: 'saffron',
  },
  {
    file: 'paprika',
    label: 'PAPRIKA',
    accent: '#D2691E',
    windowFill: '#E85D04',
    botanical: 'powder',
  },
  {
    file: 'fennel-seeds',
    label: 'FENNEL SEEDS',
    accent: '#6B8F71',
    windowFill: '#A8B88A',
    botanical: 'fennel',
  },
  {
    file: 'curry-leaves',
    label: 'CURRY LEAVES',
    accent: '#2E5A3C',
    windowFill: '#3D7A4A',
    botanical: 'leaves',
  },
  {
    file: 'curry-powder',
    label: 'CURRY POWDER',
    accent: '#B87333',
    windowFill: '#C68642',
    botanical: 'powder-blend',
  },
]

function botanicalSvg(type) {
  switch (type) {
    case 'cinnamon':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.6" stroke-linecap="round">
          <path d="M-28,-8 C-20,-22 -8,-24 0,-10 C8,-24 20,-22 28,-8" />
          <path d="M-22,2 C-14,-10 -4,-12 0,0 C4,-12 14,-10 22,2" />
          <path d="M-16,12 C-10,2 -2,0 0,10 C2,0 10,2 16,12" />
          <ellipse cx="-8" cy="18" rx="5" ry="3" fill="#2C1810" opacity="0.15" stroke="none"/>
          <ellipse cx="10" cy="16" rx="4" ry="2.5" fill="#2C1810" opacity="0.15" stroke="none"/>
        </g>`
    case 'cardamom':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.5">
          <ellipse cx="-18" cy="-4" rx="7" ry="11" transform="rotate(-18 -18 -4)"/>
          <ellipse cx="0" cy="0" rx="7" ry="11"/>
          <ellipse cx="18" cy="-2" rx="7" ry="11" transform="rotate(15 18 -2)"/>
          <path d="M-18,-15 v4 M0,-11 v4 M18,-13 v4" stroke-width="1.2"/>
        </g>`
    case 'cloves':
      return `
        <g transform="translate(400,268)" fill="#2C1810" stroke="#2C1810" stroke-width="1">
          <g transform="translate(-20,-6) rotate(-25)"><circle r="3.5"/><line x1="0" y1="3" x2="0" y2="16" stroke-width="1.8"/></g>
          <g transform="translate(0,-2)"><circle r="3.5"/><line x1="0" y1="3" x2="0" y2="16" stroke-width="1.8"/></g>
          <g transform="translate(20,-8) rotate(20)"><circle r="3.5"/><line x1="0" y1="3" x2="0" y2="16" stroke-width="1.8"/></g>
        </g>`
    case 'pepper':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.4">
          <circle cx="-16" cy="-2" r="6"/><circle cx="0" cy="4" r="6"/><circle cx="16" cy="-4" r="6"/>
          <circle cx="-6" cy="-12" r="5"/><circle cx="10" cy="12" r="5"/>
        </g>`
    case 'chili':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.6" stroke-linecap="round">
          <path d="M-22,-14 C-18,-20 -8,-18 -4,-8 C0,4 -4,18 -10,20 C-16,16 -20,4 -22,-14Z"/>
          <path d="M4,-16 C10,-22 22,-16 24,-4 C26,10 18,20 10,18 C4,12 2,-2 4,-16Z"/>
          <path d="M-14,-16 l-2,-6 M16,-18 l3,-5" stroke-width="1.2"/>
        </g>`
    case 'star':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.5">
          <path d="M0,-16 L3,-5 L14,-8 L6,0 L12,10 L0,4 L-12,10 L-6,0 L-14,-8 L-3,-5 Z"/>
          <circle cx="0" cy="0" r="2.5" fill="#2C1810"/>
        </g>`
    case 'bay':
    case 'leaves':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.5" stroke-linecap="round">
          <path d="M-8,16 C-20,4 -18,-14 -4,-18 C10,-14 12,4 0,16"/>
          <path d="M-4,-18 C-2,-6 -2,6 -2,16" stroke-width="1"/>
          <path d="M8,14 C20,2 18,-16 4,-18 C-8,-12 -6,4 4,14" opacity="0.85"/>
        </g>`
    case 'saffron':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.3" stroke-linecap="round">
          <path d="M-18,8 Q-12,-10 -6,10"/><path d="M-8,10 Q-2,-14 4,8"/>
          <path d="M2,10 Q8,-12 14,10"/><path d="M-14,4 Q-6,-8 0,6"/>
          <path d="M6,6 Q12,-6 18,4"/>
        </g>`
    case 'ginger':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.5" stroke-linecap="round">
          <path d="M-24,4 C-18,-10 -4,-14 4,-6 C10,-14 24,-8 26,4 C20,14 6,16 -4,10 C-12,16 -22,12 -24,4Z"/>
          <path d="M-8,-2 C-2,2 8,0 12,-4" stroke-width="1"/>
        </g>`
    case 'nutmeg':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.5">
          <ellipse cx="-14" cy="0" rx="10" ry="12"/>
          <ellipse cx="14" cy="2" rx="10" ry="12"/>
          <path d="M-18,-4 Q-14,0 -10,4 M-16,2 Q-14,4 -12,6" stroke-width="1"/>
          <path d="M10,-2 Q14,2 18,6 M12,4 Q14,6 16,8" stroke-width="1"/>
        </g>`
    case 'turmeric':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.5" stroke-linecap="round">
          <path d="M-20,6 C-14,-8 -2,-12 6,-4 C12,2 8,14 -2,12 C-10,16 -18,12 -20,6Z"/>
          <path d="M8,-2 C14,-10 26,-6 24,6 C22,14 12,12 8,4" />
          <circle cx="-4" cy="20" r="6" opacity="0.35"/>
        </g>`
    case 'fennel':
    case 'seeds':
    case 'angular-seeds':
    case 'round-seeds':
    case 'tiny-seeds':
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.4" stroke-linecap="round">
          <ellipse cx="-16" cy="-4" rx="4" ry="8" transform="rotate(-30 -16 -4)"/>
          <ellipse cx="0" cy="0" rx="4" ry="8"/>
          <ellipse cx="16" cy="-2" rx="4" ry="8" transform="rotate(25 16 -2)"/>
          <ellipse cx="-6" cy="12" rx="3.5" ry="7" transform="rotate(-10 -6 12)"/>
          <ellipse cx="10" cy="10" rx="3.5" ry="7" transform="rotate(15 10 10)"/>
        </g>`
    case 'powder':
    case 'powder-blend':
    default:
      return `
        <g transform="translate(400,268)" fill="none" stroke="#2C1810" stroke-width="1.5" stroke-linecap="round">
          <path d="M-22,8 C-18,-6 0,-14 18,-4 C22,4 14,16 0,14 C-12,18 -24,12 -22,8Z" opacity="0.9"/>
          <path d="M-10,0 Q0,-8 12,2" stroke-width="1" opacity="0.6"/>
        </g>`
  }
}

function windowContents(spice) {
  const base = spice.windowFill
  // Stylized spice texture inside the clear window
  const patterns = {
    turmeric: `
      <rect width="160" height="70" fill="${base}"/>
      <circle cx="30" cy="20" r="18" fill="#F0C040" opacity="0.5"/>
      <circle cx="90" cy="40" r="22" fill="#D4920A" opacity="0.4"/>
      <circle cx="130" cy="18" r="14" fill="#F5D76E" opacity="0.45"/>
      <ellipse cx="50" cy="50" rx="20" ry="10" fill="#B8730A" opacity="0.3"/>`,
    cumin: `
      <rect width="160" height="70" fill="${base}"/>
      ${Array.from({ length: 40 }, (_, i) => {
        const x = 8 + (i % 10) * 15 + (i % 3)
        const y = 10 + Math.floor(i / 10) * 14 + (i % 2) * 3
        return `<ellipse cx="${x}" cy="${y}" rx="3" ry="6" fill="#8B6914" opacity="0.55" transform="rotate(${(i * 17) % 40 - 20} ${x} ${y})"/>`
      }).join('')}`,
    coriander: `
      <rect width="160" height="70" fill="${base}"/>
      ${Array.from({ length: 28 }, (_, i) => {
        const x = 12 + (i % 7) * 20
        const y = 12 + Math.floor(i / 7) * 16
        return `<circle cx="${x}" cy="${y}" r="5" fill="#B8A078" stroke="#8A7A58" stroke-width="0.5"/>`
      }).join('')}`,
    cardamom: `
      <rect width="160" height="70" fill="#5A8F4A"/>
      ${[[30, 25], [55, 40], [80, 22], [105, 38], [130, 28], [45, 55], [95, 52], [120, 55]].map(
        ([x, y], i) =>
          `<ellipse cx="${x}" cy="${y}" rx="9" ry="14" fill="#6B9B5A" stroke="#3D6B3A" stroke-width="0.8" transform="rotate(${[-20, 10, -5, 15, -12, 8, -8, 5][i]} ${x} ${y})"/>`,
      ).join('')}`,
    cinnamon: `
      <rect width="160" height="70" fill="#8B4513"/>
      <rect x="18" y="12" width="14" height="48" rx="3" fill="#A0522D" stroke="#5C2E0A" stroke-width="1"/>
      <rect x="40" y="10" width="13" height="50" rx="3" fill="#CD853F" stroke="#5C2E0A" stroke-width="1"/>
      <rect x="62" y="14" width="14" height="46" rx="3" fill="#8B4513" stroke="#5C2E0A" stroke-width="1"/>
      <rect x="86" y="11" width="12" height="49" rx="3" fill="#A0522D" stroke="#5C2E0A" stroke-width="1"/>
      <rect x="108" y="13" width="14" height="47" rx="3" fill="#D2691E" stroke="#5C2E0A" stroke-width="1"/>
      <rect x="130" y="12" width="12" height="48" rx="3" fill="#8B4513" stroke="#5C2E0A" stroke-width="1"/>
      <path d="M25,20 Q32,35 25,50 M47,18 Q54,35 47,52" fill="none" stroke="#5C2E0A" stroke-width="0.6" opacity="0.5"/>`,
    cloves: `
      <rect width="160" height="70" fill="#3D2314"/>
      ${Array.from({ length: 18 }, (_, i) => {
        const x = 15 + (i % 6) * 24
        const y = 12 + Math.floor(i / 6) * 20
        return `<g transform="translate(${x},${y}) rotate(${(i * 23) % 50 - 25})">
          <circle cx="0" cy="0" r="3.5" fill="#2A1810"/>
          <rect x="-1" y="3" width="2" height="10" rx="1" fill="#1A1008"/>
          <circle cx="-2.5" cy="-2" r="1.2" fill="#4A3020"/><circle cx="2.5" cy="-2" r="1.2" fill="#4A3020"/>
        </g>`
      }).join('')}`,
    nutmeg: `
      <rect width="160" height="70" fill="#C4A484"/>
      ${[[35, 30], [75, 35], [115, 28], [50, 52], [100, 50]].map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="16" ry="18" fill="#A67C52" stroke="#6B4423" stroke-width="1"/>
           <path d="M${x - 8},${y - 6} Q${x},${y} ${x + 6},${y + 8}" fill="none" stroke="#6B4423" stroke-width="0.8"/>`,
      ).join('')}`,
    ginger: `
      <rect width="160" height="70" fill="#E8D5A3"/>
      <path d="M20,40 C30,20 55,15 70,30 C80,18 110,22 120,40 C110,55 70,58 50,48 C35,58 22,52 20,40Z" fill="#D4B896" stroke="#8B7355" stroke-width="1"/>
      <path d="M90,35 C100,22 130,28 135,42 C128,55 100,52 90,35Z" fill="#C9A87C" stroke="#8B7355" stroke-width="1"/>
      <path d="M40,35 L55,35" stroke="#A08060" stroke-width="1" opacity="0.5"/>`,
    fenugreek: `
      <rect width="160" height="70" fill="${base}"/>
      ${Array.from({ length: 50 }, (_, i) => {
        const x = 8 + (i % 10) * 15
        const y = 8 + Math.floor(i / 10) * 12
        return `<polygon points="${x},${y - 4} ${x + 4},${y + 3} ${x - 4},${y + 3}" fill="#B8860B" opacity="0.7"/>`
      }).join('')}`,
    'mustard-seeds': `
      <rect width="160" height="70" fill="#2C1810"/>
      ${Array.from({ length: 80 }, (_, i) => {
        const x = 6 + (i % 12) * 13 + (i % 3)
        const y = 6 + Math.floor(i / 12) * 10 + (i % 2) * 2
        return `<circle cx="${x}" cy="${y}" r="2.2" fill="#1A1008" stroke="#3D2817" stroke-width="0.3"/>`
      }).join('')}`,
    'black-pepper': `
      <rect width="160" height="70" fill="#1A120B"/>
      ${Array.from({ length: 35 }, (_, i) => {
        const x = 12 + (i % 7) * 20 + (i % 2) * 4
        const y = 12 + Math.floor(i / 7) * 12
        return `<circle cx="${x}" cy="${y}" r="5.5" fill="#2A1F14" stroke="#0D0906" stroke-width="0.8"/>
                <circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.5" fill="#3D3020" opacity="0.5"/>`
      }).join('')}`,
    'red-chili': `
      <rect width="160" height="70" fill="#8B1A1A"/>
      ${[[25, 20], [55, 35], [90, 18], [120, 32], [40, 50], [100, 48]].map(
        ([x, y], i) =>
          `<g transform="translate(${x},${y}) rotate(${[-40, -20, -50, -15, -35, -25][i]})">
            <path d="M0,-18 C6,-12 8,8 2,20 C-2,16 -6,0 0,-18Z" fill="#E6392B" stroke="#8B0000" stroke-width="0.6"/>
            <line x1="0" y1="-18" x2="0" y2="-24" stroke="#2D5A27" stroke-width="1.5"/>
          </g>`,
      ).join('')}`,
    'bay-leaf': `
      <rect width="160" height="70" fill="#5A6B3A"/>
      ${[[40, 30], [85, 35], [125, 28], [60, 50]].map(
        ([x, y], i) =>
          `<ellipse cx="${x}" cy="${y}" rx="22" ry="10" fill="#6B7F3A" stroke="#3D4A28" stroke-width="0.8" transform="rotate(${[-25, 15, -10, 30][i]} ${x} ${y})"/>
           <line x1="${x - 18}" y1="${y}" x2="${x + 18}" y2="${y}" stroke="#3D4A28" stroke-width="0.5" transform="rotate(${[-25, 15, -10, 30][i]} ${x} ${y})" opacity="0.6"/>`,
      ).join('')}`,
    'star-anise': `
      <rect width="160" height="70" fill="#5C2A1A"/>
      ${[[45, 32], [100, 38], [70, 50]].map(
        ([x, y]) =>
          `<g transform="translate(${x},${y})">
            ${[0, 45, 90, 135, 180, 225, 270, 315]
              .map(
                (a) =>
                  `<ellipse cx="0" cy="-12" rx="4" ry="10" fill="#8B3A2A" stroke="#4A1F12" stroke-width="0.5" transform="rotate(${a})"/>`,
              )
              .join('')}
            <circle r="3" fill="#6B2D1F"/>
          </g>`,
      ).join('')}`,
    saffron: `
      <rect width="160" height="70" fill="#8B1E2D"/>
      ${Array.from({ length: 25 }, (_, i) => {
        const x = 15 + (i % 8) * 18
        const y = 15 + Math.floor(i / 8) * 18
        return `<path d="M${x},${y} Q${x + 4},${y - 10} ${x + 2},${y + 8}" fill="none" stroke="#FF1744" stroke-width="1.2" stroke-linecap="round"/>
                <path d="M${x + 3},${y + 2} Q${x + 8},${y - 6} ${x + 6},${y + 10}" fill="none" stroke="#DC143C" stroke-width="1" stroke-linecap="round"/>`
      }).join('')}`,
    paprika: `
      <rect width="160" height="70" fill="${base}"/>
      <circle cx="40" cy="25" r="20" fill="#FF6B35" opacity="0.4"/>
      <circle cx="100" cy="40" r="25" fill="#D62828" opacity="0.35"/>
      <circle cx="70" cy="20" r="15" fill="#F77F00" opacity="0.4"/>
      <ellipse cx="120" cy="55" rx="25" ry="12" fill="#9B2226" opacity="0.3"/>`,
    'fennel-seeds': `
      <rect width="160" height="70" fill="${base}"/>
      ${Array.from({ length: 36 }, (_, i) => {
        const x = 10 + (i % 9) * 16
        const y = 10 + Math.floor(i / 9) * 15
        return `<ellipse cx="${x}" cy="${y}" rx="3.5" ry="7" fill="#8A9A6A" stroke="#5A6A4A" stroke-width="0.4" transform="rotate(${(i * 13) % 30 - 15} ${x} ${y})"/>`
      }).join('')}`,
    'curry-leaves': `
      <rect width="160" height="70" fill="#2E5A3C"/>
      <g transform="translate(80,35)">
        <line x1="-50" y1="0" x2="50" y2="0" stroke="#1A3D28" stroke-width="2"/>
        ${[-40, -25, -10, 5, 20, 35]
          .map(
            (x, i) =>
              `<ellipse cx="${x}" cy="${i % 2 === 0 ? -10 : 10}" rx="10" ry="6" fill="#3D8B57" stroke="#1A3D28" stroke-width="0.6"/>`,
          )
          .join('')}
      </g>`,
    'curry-powder': `
      <rect width="160" height="70" fill="${base}"/>
      <circle cx="35" cy="28" r="18" fill="#DAA06D" opacity="0.5"/>
      <circle cx="90" cy="40" r="22" fill="#B87333" opacity="0.45"/>
      <circle cx="125" cy="22" r="14" fill="#C68642" opacity="0.5"/>
      <circle cx="60" cy="55" r="12" fill="#E8A87C" opacity="0.35"/>`,
  }
  return patterns[spice.file] || patterns.paprika
}

function pouchSvg(spice) {
  const labelSize = spice.label.length > 14 ? 18 : spice.label.length > 10 ? 20 : 22
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" role="img" aria-label="SpiceBox Lanka ${spice.label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7F1E8"/>
      <stop offset="55%" stop-color="#EFE6D8"/>
      <stop offset="100%" stop-color="#E8DFD0"/>
    </linearGradient>
    <linearGradient id="kraft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#D4B896"/>
      <stop offset="40%" stop-color="#C9A87C"/>
      <stop offset="100%" stop-color="#B8956A"/>
    </linearGradient>
    <linearGradient id="kraftSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#A88860"/>
      <stop offset="100%" stop-color="#C9A87C"/>
    </linearGradient>
    <linearGradient id="seal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C4A878"/>
      <stop offset="100%" stop-color="#B8956A"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#5C4033" flood-opacity="0.28"/>
    </filter>
    <pattern id="kraftGrain" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="2" r="0.4" fill="#8B7355" opacity="0.12"/>
      <circle cx="4" cy="5" r="0.35" fill="#6B5344" opacity="0.1"/>
    </pattern>
    <clipPath id="windowClip">
      <rect x="320" y="720" width="160" height="70" rx="4"/>
    </clipPath>
  </defs>

  <!-- Warm cream studio background -->
  <rect width="800" height="1000" fill="url(#bg)"/>
  <ellipse cx="400" cy="920" rx="210" ry="28" fill="#C4B5A0" opacity="0.35"/>

  <!-- Soft foliage suggestion (very subtle) -->
  <ellipse cx="80" cy="200" rx="60" ry="90" fill="#A8B88A" opacity="0.12"/>
  <ellipse cx="720" cy="280" rx="70" ry="100" fill="#8FA87A" opacity="0.1"/>
  <ellipse cx="60" cy="700" rx="50" ry="70" fill="#9CAF88" opacity="0.1"/>

  <!-- Pouch group -->
  <g filter="url(#softShadow)">
    <!-- Side gusset hint -->
    <path d="M268,210 L248,780 Q248,860 320,880 L320,210 Z" fill="url(#kraftSide)" opacity="0.85"/>
    <path d="M532,210 L552,780 Q552,860 480,880 L480,210 Z" fill="#A88860" opacity="0.55"/>

    <!-- Main pouch body -->
    <path d="M268,195
             L268,780
             Q268,870 400,895
             Q532,870 532,780
             L532,195
             Q532,175 400,170
             Q268,175 268,195 Z"
          fill="url(#kraft)"/>
    <path d="M268,195
             L268,780
             Q268,870 400,895
             Q532,870 532,780
             L532,195
             Q532,175 400,170
             Q268,175 268,195 Z"
          fill="url(#kraftGrain)"/>

    <!-- Top seal / zipper area -->
    <path d="M275,195 L275,230 L525,230 L525,195 Q525,178 400,174 Q275,178 275,195 Z" fill="url(#seal)"/>
    <line x1="290" y1="218" x2="510" y2="218" stroke="#8B7355" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.7"/>
    <!-- Tear notches -->
    <path d="M275,205 l-6,6 l6,6" fill="none" stroke="#8B7355" stroke-width="1.2"/>
    <path d="M525,205 l6,6 l-6,6" fill="none" stroke="#8B7355" stroke-width="1.2"/>

    <!-- Subtle front panel edge -->
    <rect x="290" y="245" width="220" height="460" rx="4" fill="none" stroke="#A88860" stroke-width="0.6" opacity="0.35"/>
  </g>

  <!-- Label content (top → bottom, matching premium pouch layout) -->
  <text x="400" y="300" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="15" letter-spacing="4" fill="#2C1810" font-weight="600">SPICEBOX LANKA</text>
  <text x="400" y="322" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="9" letter-spacing="2.5" fill="#5C4033">PREMIUM SRI LANKAN SPICE</text>

  ${botanicalSvg(spice.botanical).replace('translate(400,268)', 'translate(400,390)')}

  <text x="400" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${labelSize}" letter-spacing="1.5" fill="#1A120B" font-weight="700">${spice.label}</text>

  <!-- Accent quantity bar -->
  <rect x="340" y="490" width="120" height="18" rx="2" fill="${spice.accent}"/>
  <text x="400" y="503" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="9" letter-spacing="1.5" fill="#F7F1E8" font-weight="600">100 g</text>

  <text x="400" y="545" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="10" letter-spacing="3.5" fill="#5C4033">FROM SRI LANKA</text>

  <!-- Transparent window with spice -->
  <rect x="318" y="718" width="164" height="74" rx="5" fill="#E8F4F8" opacity="0.35" stroke="#8B7355" stroke-width="2"/>
  <g clip-path="url(#windowClip)">
    ${windowContents(spice)}
  </g>
  <rect x="320" y="720" width="160" height="70" rx="4" fill="none" stroke="#6B5344" stroke-width="1.5" opacity="0.5"/>
  <!-- Window gloss -->
  <rect x="324" y="724" width="40" height="62" rx="2" fill="#FFFFFF" opacity="0.12"/>
</svg>`
}

fs.mkdirSync(outDir, { recursive: true })

for (const spice of spices) {
  const filePath = path.join(outDir, `${spice.file}.svg`)
  fs.writeFileSync(filePath, pouchSvg(spice), 'utf8')
  console.log('Wrote', filePath)
}

console.log(`\nGenerated ${spices.length} kraft pouch images in ${outDir}`)
