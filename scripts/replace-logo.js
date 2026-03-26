// Node.js script to replace the old logo in screenshots with the new logo using Sharp.
// Usage examples:
//   1) Use defaults for known screenshots:
//        node scripts/replace-logo.js
//   2) Single custom run with precise controls:
//        node scripts/replace-logo.js --input public/screenshot-dashboard.png --output public/screenshot-dashboard.updated.png --x 24 --y 16 --width 120
//   3) Override global scale for all defaults (e.g., 9% of screenshot width):
//        node scripts/replace-logo.js --ratio 0.09
//
// Notes:
// - This script overlays the new logo on top of the old one. It doesn't erase content—
//   it simply places your new logo exactly where you want it, preserving the screenshot’s background.
// - PNG outputs are written alongside the originals to *.updated.png so you can compare safely.
// - Adjust x, y, and width per file to achieve visually natural alignment and proportions.

import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const NEW_LOGO_PATH = "public/ag-logo.svg"

// Default targets: tweak x, y, and logoWidthPx to align with where the logo appears in each screenshot.
const defaultTargets = [
  {
    input: "public/screenshot-dashboard.png",
    output: "public/screenshot-dashboard.updated.png",
    x: 24,
    y: 16,
    logoWidthPx: 120,
  },
  {
    input: "public/screenshot-ai-section.png",
    output: "public/screenshot-ai-section.updated.png",
    x: 24,
    y: 16,
    logoWidthPx: 120,
  },
  {
    input: "public/screenshot-footer.png",
    output: "public/screenshot-footer.updated.png",
    x: 24,
    y: 16,
    logoWidthPx: 120,
  },
  {
    input: "public/footer-screenshot.png",
    output: "public/footer-screenshot.updated.png",
    x: 24,
    y: 16,
    logoWidthPx: 120,
  },
]

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i]
    const next = argv[i + 1]
    if (key.startsWith("--")) {
      const name = key.slice(2)
      if (next && !next.startsWith("--")) {
        args[name] = next
        i++
      } else {
        args[name] = true
      }
    }
  }
  return args
}

async function pathExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function compositeLogo({ input, output, x, y, logoWidthPx, ratio }) {
  if (!(await pathExists(input))) {
    console.warn(`[skip] Input not found: ${input}`)
    return
  }
  if (!(await pathExists(NEW_LOGO_PATH))) {
    throw new Error(`New logo not found at ${NEW_LOGO_PATH}. Make sure public/ag-logo.svg exists.`)
  }

  const img = sharp(input)
  const meta = await img.metadata()

  // If ratio provided, compute width by ratio of screenshot width
  let targetLogoWidth = logoWidthPx
  if (ratio && meta.width) {
    targetLogoWidth = Math.round(meta.width * Number(ratio))
  }

  // Render the SVG as a PNG buffer with the desired width
  const svgBuf = await fs.readFile(NEW_LOGO_PATH)
  const logoPng = await sharp(svgBuf, { density: 300 }) // higher density for crisp scaling
    .resize({ width: targetLogoWidth, fit: "contain" })
    .png()
    .toBuffer()

  // Composite over screenshot
  const outBuf = await img
    .composite([
      {
        input: logoPng,
        top: y,
        left: x,
        blend: "over",
      },
    ])
    .png()
    .toBuffer()

  await fs.writeFile(output, outBuf)
  console.log(`[ok] Wrote ${output} (${path.basename(input)} ← new logo @ ${x},${y}, width ${targetLogoWidth}px)`)
}

async function main() {
  const args = parseArgs(process.argv)
  const singleInput = args.input
  const singleOutput = args.output
  const x = args.x !== undefined ? Number(args.x) : undefined
  const y = args.y !== undefined ? Number(args.y) : undefined
  const width = args.width !== undefined ? Number(args.width) : undefined
  const ratio = args.ratio !== undefined ? Number(args.ratio) : undefined

  // Single-file mode
  if (singleInput) {
    if (!singleOutput) {
      throw new Error("Please provide --output when using --input for single-file mode.")
    }
    if (x === undefined || y === undefined) {
      throw new Error("Please provide both --x and --y for single-file mode.")
    }
    if (width === undefined && ratio === undefined) {
      throw new Error("Provide either --width (px) or --ratio (e.g., 0.09) for single-file mode.")
    }
    await compositeLogo({
      input: singleInput,
      output: singleOutput,
      x,
      y,
      logoWidthPx: width || 120,
      ratio,
    })
    return
  }

  // Batch default mode
  console.log("No --input specified. Running in batch mode over default screenshots...")
  for (const target of defaultTargets) {
    await compositeLogo({
      input: target.input,
      output: target.output,
      x: x ?? target.x,
      y: y ?? target.y,
      logoWidthPx: width ?? target.logoWidthPx,
      ratio: ratio ?? undefined,
    })
  }

  console.log(
    "Done. Inspect the *.updated.png files and tweak --x --y --width/--ratio if needed for perfect alignment.",
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
