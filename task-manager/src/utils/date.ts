// 이 앱에서는 날짜를 'YYYY-MM-DD' 형식의 문자열(날짜 키)로 다룬다

// Date 객체를 날짜 키로 변환
export const toDateKey = (date: Date): string => {
  const year: string = String(date.getFullYear()).padStart(4, '0')
  const month: string = String(date.getMonth() + 1).padStart(2, '0')
  const day: string = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 날짜 키를 Date 객체로 변환
export const fromDateKey = (key: string): Date => {
  const [year, month, day]: number[] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// 올바른 날짜 키인지 검사 (형식이 맞고 실제로 존재하는 날짜인지)
export const isValidDateKey = (key: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) {
    return false
  }
  return toDateKey(fromDateKey(key)) === key
}

// 오늘의 날짜 키
export const getTodayKey = (): string => {
  return toDateKey(new Date())
}

// 화면에 보여줄 날짜 문구 (예: '11월 12일 목요일')
export const formatDateLabel = (key: string): string => {
  return fromDateKey(key).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

// 달력 한 화면(6주 = 42칸)에 들어갈 날짜 키 목록. month는 0(1월)부터 시작
export const getCalendarDays = (year: number, month: number): string[] => {
  // 그 달 1일의 요일만큼 앞 칸을 지난달 날짜로 채움 (일요일 시작)
  const startOffset: number = new Date(year, month, 1).getDay()

  return Array.from({ length: 42 }, (_, index: number): string => {
    return toDateKey(new Date(year, month, 1 - startOffset + index))
  })
}
