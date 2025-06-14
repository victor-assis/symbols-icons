import fs from 'fs/promises'
import { load } from 'cheerio'

// --- CONFIGURAÇÃO --- //
const ICON_WIDTH = 32
const ICON_HEIGHT = 32
const ADDITIONAL_SCALING = 1.7
const MARGIN_LINE_WIDTH = 0.5
const ADDITIONAL_HORIZONTAL_MARGIN = 4

const SPACE_BETWEEN_CENTERS = 296.71
const FONT_SCALES = ['S', 'M', 'L']
const FONT_WEIGHTS = [
  'Ultralight','Thin','Light','Regular',
  'Medium','Semibold','Bold','Heavy','Black'
]
const SYMBOL_SCALE_ADDITIONS = [0.001,0.002,0.003,0.004,0.04,0.03,0.03,0.06,0.04]
const BASE_SYMBOL_SCALE = 0.775
// -------------------- //

function getGuideValue($, axis, xmlId) {
  const node = $(`#${xmlId}`)
  if (!node.length) throw new Error(`Guide "${xmlId}" não encontrado`)
  const v1 = node.attr(`${axis}1`)
  const v2 = node.attr(`${axis}2`)
  if (v1 == null || v1 !== v2) throw new Error(`Guia "${xmlId}" inválida`)
  return parseFloat(v1)
}

async function main() {
  const [tplPath, srcPath, dstPath] = process.argv.slice(2)
  if (!tplPath || !srcPath || !dstPath) {
    console.error('Uso: node generate-sfsymbol.js <template.svg> <source.svg> <dest.svg>')
    process.exit(1)
  }

  // 1. Carrega template e ícone
  const [tplRaw, iconRaw] = await Promise.all([
    fs.readFile(tplPath, 'utf8'),
    fs.readFile(srcPath, 'utf8'),
  ])
  const $tpl  = load(tplRaw,  { xmlMode: true })
  const $icon = load(iconRaw, { xmlMode: true })

  // 2. Validação de tamanho
  const root = $icon('svg')
  if (
    root.attr('width')  !== String(ICON_WIDTH) ||
    root.attr('height') !== String(ICON_HEIGHT)||
    root.attr('viewBox') !== `0 0 ${ICON_WIDTH} ${ICON_HEIGHT}`
  ) {
    throw new Error(`SVG deve ter ${ICON_WIDTH}x${ICON_HEIGHT} e viewBox="0 0 ${ICON_WIDTH} ${ICON_HEIGHT}"`)
  }

  // 3. Lê guias do template
  const origLeft  = getGuideValue($tpl, 'x', 'left-margin')
  const origRight = getGuideValue($tpl, 'x', 'right-margin')
  let baselineY   = getGuideValue($tpl, 'y', 'Baseline-M')
  let caplineY    = getGuideValue($tpl, 'y', 'Capline-M')

  // 4. Calcula escala e ajusta margens
  const scale0 = (Math.abs(baselineY - caplineY) / ICON_HEIGHT) * ADDITIONAL_SCALING
  const centerX = (origLeft + origRight) / 2

  const scaledW = ICON_WIDTH * scale0
  const scaledH = ICON_HEIGHT * scale0

  const horizMargin = scaledW/2 + MARGIN_LINE_WIDTH + ADDITIONAL_HORIZONTAL_MARGIN
  const adjLeft  = centerX - horizMargin
  const adjRight = centerX + horizMargin

  $tpl('#left-margin').attr('x1', adjLeft).attr('x2', adjLeft)
  $tpl('#right-margin').attr('x1', adjRight).attr('x2', adjRight)

  // 5. Duplica o XML modificado
  const modifiedXml = $tpl.xml()
  const $sym = load(modifiedXml, { xmlMode: true })

  // 6. Loop por escalas (S,M,L) e pesos
  let scaleFactor = BASE_SYMBOL_SCALE
  const regularIndex = FONT_WEIGHTS.indexOf('Regular')

  for (const fscl of FONT_SCALES) {
    baselineY = getGuideValue($tpl, 'y', `Baseline-${fscl}`)
    caplineY  = getGuideValue($tpl, 'y', `Capline-${fscl}`)
    for (let wi = 0; wi < FONT_WEIGHTS.length; wi++) {
      const fw = FONT_WEIGHTS[wi]
      scaleFactor += SYMBOL_SCALE_ADDITIONS[wi]
      const finalScale = scale0 * scaleFactor

      // calcula translação X
      const idxDiff = wi - regularIndex
      let tx = idxDiff < 0
        ? centerX - (SPACE_BETWEEN_CENTERS * Math.abs(idxDiff)) - ((scaledW * scaleFactor)/2)
        : centerX + (SPACE_BETWEEN_CENTERS * Math.abs(idxDiff)) - ((scaledW * scaleFactor)/2)
      // calcula translação Y
      const ty = ((baselineY + caplineY)/2) - ((scaledH * scaleFactor)/2)

      const nodeId = `${fw}-${fscl}`
      const $node = $sym(`#${nodeId}`)
      if (!$node.length) {
        console.warn(`Aviso: não achei #${nodeId} no template`)
        continue
      }
      // aplica transform
      $node.attr('transform', `matrix(${finalScale} 0 0 ${finalScale} ${tx} ${ty})`)
      // substitui conteúdo
      $node.empty()
      $icon('svg').children().each((_, ch) => {
        $node.append($icon(ch).clone())
      })
    }
  }

  // 7. Salva o SVG final
  await fs.writeFile(dstPath, $sym.xml(), 'utf8')
  console.log(`✅ Símbolo gerado em ${dstPath}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
