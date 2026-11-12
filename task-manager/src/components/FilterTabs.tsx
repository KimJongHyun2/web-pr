import type { Filter } from '../types/filter'

interface FilterTabsProps {
  current: Filter
  onChange: (filter: Filter) => void
}

interface FilterOption {
  value: Filter
  label: string
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

function FilterTabs({ current, onChange }: FilterTabsProps) {
  return (
    <div className="filter-tabs" role="group" aria-label="목록 필터">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === current ? 'filter-tab active' : 'filter-tab'}
          aria-pressed={option.value === current}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default FilterTabs
