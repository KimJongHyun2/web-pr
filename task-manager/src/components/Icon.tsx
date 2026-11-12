// 사용할 수 있는 아이콘 이름
type IconName = 'edit' | 'trash' | 'check' | 'close' | 'prev' | 'next'

interface IconProps {
  name: IconName
}

// 아이콘 이름별 SVG path 목록
const ICON_PATHS: Record<IconName, string[]> = {
  edit: ['M4 20h4L19 9l-4-4L4 16v4z', 'M13.5 6.5l4 4'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6', 'M10 11v5', 'M14 11v5'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  prev: ['M15 6l-6 6 6 6'],
  next: ['M9 6l6 6-6 6'],
}

function Icon({ name }: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}

export default Icon
