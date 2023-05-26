'use client'

import { useState } from 'react'
import { tailwindColors } from '@/colors/v3'
import { findNearestColor } from '@/lib/find-nearest-color'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const COLOR_TYPES = {
  hex: 'hex',
  hsl: 'hsl',
  rgb: 'rgb'
} as const

type ColorTypeValues = (typeof COLOR_TYPES)[keyof typeof COLOR_TYPES]

export const NearestColorForm = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramsType = searchParams.get('type') as ColorTypeValues | null
  const [color, setColor] = useState('')
  const [type, setType] = useState<ColorTypeValues>(
    COLOR_TYPES[paramsType as ColorTypeValues] ?? COLOR_TYPES.hex
  )

  const nearestTailwindColor = color
    ? findNearestColor(tailwindColors, color, type)
    : null

  return (
    <div className="flex flex-col items-center gap-6 justify-center">
      <div className="flex items-center gap-2">
        {Object.values(COLOR_TYPES).map(colorType => (
          <button
            key={colorType}
            className={`border border-gray-300 p-2 rounded ${
              type === colorType ? 'bg-gray-200' : ''
            }`}
            onClick={() => {
              setType(colorType)
              router.push(pathname + '?type=' + colorType)
              setColor('')
            }}>
            {colorType}
          </button>
        ))}
      </div>

      <input
        className="border border-gray-300 p-2 rounded"
        onChange={e => setColor(e.target.value)}
        placeholder="Enter a color"
        type="text"
        value={color}
      />

      {nearestTailwindColor && (
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-6">
            <div>
              <p className="font-semibold">Nearest Tailwind color</p>
              <p className="mt-0 text-gray-700">
                Here&apos;s the nearest color to: <strong>{color}</strong>
              </p>
            </div>

            <div className="flex flex-col gap-y-2">
              <p className="text-gray-700">Tailwind color name:</p>

              <button
                className="border border-gray-300 p-2 rounded"
                onClick={() => {
                  navigator.clipboard.writeText(nearestTailwindColor)
                }}>
                {nearestTailwindColor}
              </button>

              <p className="text-gray-700 mt-0">
                Hex color code: {tailwindColors[nearestTailwindColor]}
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-700 font-semibold">Preview</p>

            <div className="flex flex-col sm:flex-row mt-2 gap-x-6 gap-y-4">
              <div>
                <p className="text-gray-700 mt-0">
                  Tailwind&apos;s{' '}
                  <span className="italic">{nearestTailwindColor}</span>
                </p>
                <div className="w-48 h-20">
                  <ColorBlock
                    color={tailwindColors[nearestTailwindColor]}
                    type={type}
                  />
                </div>
              </div>

              <div>
                <p className="text-gray-700 mt-0">
                  Your color <span className="italic">{color}</span>
                </p>

                <div className="w-48 h-20">
                  <ColorBlock color={color} type={type} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ColorBlock = ({
  color,
  type
}: {
  color: string
  type: ColorTypeValues
}) => {
  const bgColor = (() => {
    switch (type) {
      case COLOR_TYPES.hex:
        return color
      case COLOR_TYPES.hsl:
        return `hsl(${color})`
      case COLOR_TYPES.rgb:
        return `rgb(${color})`
    }
  })()

  return (
    <div
      className="border shadow-sm w-full h-full rounded"
      style={{ backgroundColor: bgColor }}
    />
  )
}
