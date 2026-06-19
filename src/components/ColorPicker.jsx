import { COMPETITION_COLOR_PALETTE } from '../utils/constants'

export default function ColorPicker({ value, onChange, label = 'Color' }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-200 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {COMPETITION_COLOR_PALETTE.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`h-10 w-10 rounded-full border-2 transition ${
              value === color.value
                ? 'border-yellow-300 ring-2 ring-yellow-300/50'
                : 'border-gray-600 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.value }}
            title={color.label}
          />
        ))}
      </div>
      {value && (
        <p className="text-xs text-gray-400">
          Seleccionado: {COMPETITION_COLOR_PALETTE.find((c) => c.value === value)?.label || value}
        </p>
      )}
    </div>
  )
}
