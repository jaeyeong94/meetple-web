export const TEST_PROFILE_URL = 'https://futureoflife.org/wp-content/uploads/2020/08/elon_musk_royal_society.jpg'

export const TEST_MORE_DATA = [
  {
    title: '삭제하기',
    onClick: () => {}
  },
  {
    title: '차단하기',
    warning: true,
    onClick: () => {}
  }
]

export const TEST_ACTION_DATA = {
  title: '채팅하기',
  onClick: () => {}
}

export const TEST_TABS = [
  { title: '추천', to: '#' },
  { title: '매칭', content: '#' },
]

export const TEST_USER = {
  name: '일론',
  message: '쏘맥 고?',
  age: 26,
  job: '테슬라 CEO',
  mbti: 'ENTJ',
  location: '서울특별시',
  school: '한양대학교',
  profile_image_url: 'https://futureoflife.org/wp-content/uploads/2020/08/elon_musk_royal_society.jpg'
}

export const TEST_SELECT_OPTIONS = [
  { value: 'INFJ', label: 'INFJ' },
  { value: 'INFP', label: 'INFP' },
  { value: 'INTJ', label: 'INTJ' },
  { value: 'INTP', label: 'INTP' },
  { value: 'ISFJ', label: 'ISFJ' },
  { value: 'ISFP', label: 'ISFP' },
  { value: 'ISTJ', label: 'ISTJ' },
  { value: 'ISTP', label: 'ISTP' },
  { value: 'ENFJ', label: 'ENFJ' },
  { value: 'ENFP', label: 'ENFP' },
  { value: 'ENTJ', label: 'ENTJ' },
  { value: 'ENTP', label: 'ENTP' },
  { value: 'ESFJ', label: 'ESFJ' },
  { value: 'ESFP', label: 'ESFP' },
  { value: 'ESTJ', label: 'ESTJ' },
  { value: 'ESTP', label: 'ESTP' },
]

export const TEST_DEEP_SELECT_OPTIONS = [
  { value: '서울', label: '서울',
    children: [
      { value: '강남구', label: '강남구' },
      { value: '강북구', label: '강북구' },
      { value: '강서구', label: '강서구' },
      { value: '강동구', label: '강동구' },
      { value: '마포구', label: '마포구' },
    ]
  },
  { value: '경기', label: '경기',
    children: [
      { value: '수원', label: '수원' },
      { value: '성남', label: '성남' },
      { value: '안양', label: '안양' },
      { value: '부천', label: '부천' },
      { value: '안산', label: '안산' },
    ]
  },
  { value: '인천', label: '인천',
    children: [
      { value: '중구', label: '중구' },
      { value: '남구', label: '남구' },
      { value: '동구', label: '동구' },
      { value: '북구', label: '북구' },
      { value: '연수구', label: '연수구' },
    ]
  },
]

export const TEST_RADIO_OPTIONS = [
  { value: 'male', label: '남자', color: '#6726FE' },
  { value: 'female', label: '여자', color: "#F742AF" },
]

export const TEST_NOTIFICATIONS = [
  {
    id: 1,
    type: 'sign-up',
    content: '회원가입 완료 내용',
    date: '2024-10-01',
  },
  {
    id: 2,
    type: 'verification-success',
    content: '인증 성공 내용',
    date: '2024-10-02',
  },
  {
    id: 3,
    type: 'verification-failure',
    content: '인증 실패 내용',
    date: '2024-10-02',
  },
  {
    id: 4,
    type: 'recommended-meeting',
    content: '추천 미팅 내용',
    date: '2024-10-03',
  },
  {
    id: 5,
    type: 'match-request',
    content: '상대방 매칭 승낙 내용',
    date: '2024-10-05',
  },
  {
    id: 5,
    type: 'match-request-remind',
    content: '상대방 매칭 O 기다림 내용',
    date: '2024-10-05',
  },
  {
    id: 6,
    type: 'matched',
    content: '매칭 성사 내용',
    date: '2024-10-06',
  },{
    id: 6,
    type: 'match-reject',
    content: '상대방 매칭 거절 내용',
    date: '2024-10-07',
  }
]
