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
  { title: '추천', to: '/home' },
  { title: '매칭', to: '/history' },
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

// export const TEST_DEEP_SELECT_OPTIONS = [
//   { value: '서울', label: '서울',
//     children: [
//       { value: '강남구', label: '강남구' },
//       { value: '강북구', label: '강북구' },
//       { value: '강서구', label: '강서구' },
//       { value: '강동구', label: '강동구' },
//       { value: '마포구', label: '마포구' },
//     ]
//   },
//   { value: '경기', label: '경기',
//     children: [
//       { value: '수원', label: '수원' },
//       { value: '성남', label: '성남' },
//       { value: '안양', label: '안양' },
//       { value: '부천', label: '부천' },
//       { value: '안산', label: '안산' },
//     ]
//   },
//   { value: '인천', label: '인천',
//     children: [
//       { value: '중구', label: '중구' },
//       { value: '남구', label: '남구' },
//       { value: '동구', label: '동구' },
//       { value: '북구', label: '북구' },
//       { value: '연수구', label: '연수구' },
//     ]
//   },
// ]

export const TEST_DEEP_SELECT_OPTIONS = [
  {
    value: '서울',
    label: '서울',
    children: [
      // ㄱ
      { value: '강남구', label: '강남구' },
      { value: '강동구', label: '강동구' },
      { value: '강북구', label: '강북구' },
      { value: '강서구', label: '강서구' },
      { value: '관악구', label: '관악구' },
      { value: '광진구', label: '광진구' },
      { value: '구로구', label: '구로구' },
      { value: '금천구', label: '금천구' },

      // ㄴ
      { value: '노원구', label: '노원구' },

      // ㄷ
      { value: '도봉구', label: '도봉구' },
      { value: '동대문구', label: '동대문구' },
      { value: '동작구', label: '동작구' },

      // ㅁ
      { value: '마포구', label: '마포구' },

      // ㅅ
      { value: '서대문구', label: '서대문구' },
      { value: '서초구', label: '서초구' },
      { value: '성동구', label: '성동구' },
      { value: '성북구', label: '성북구' },
      { value: '송파구', label: '송파구' },

      // ㅇ
      { value: '양천구', label: '양천구' },
      { value: '영등포구', label: '영등포구' },
      { value: '용산구', label: '용산구' },
      { value: '은평구', label: '은평구' },

      // ㅈ
      { value: '종로구', label: '종로구' },
      { value: '중구', label: '중구' },
      { value: '중랑구', label: '중랑구' }
    ]
  },
  {
    value: '경기',
    label: '경기',
    children: [
      { value: '수원', label: '수원' },
      { value: '성남', label: '성남' },
      { value: '안양', label: '안양' },
      { value: '부천', label: '부천' },
      { value: '안산', label: '안산' },
      { value: '의정부', label: '의정부' },
      { value: '고양', label: '고양' },
      { value: '용인', label: '용인' },
      { value: '평택', label: '평택' },
      { value: '시흥', label: '시흥' }
    ]
  },
  {
    value: '인천',
    label: '인천',
    children: [
      { value: '중구', label: '중구' },
      { value: '동구', label: '동구' },
      { value: '남구', label: '남구' },
      { value: '연수구', label: '연수구' },
      { value: '서구', label: '서구' },
      { value: '미추홀구', label: '미추홀구' },
      { value: '부평구', label: '부평구' },
      { value: '계양구', label: '계양구' }
    ]
  },
  {
    value: '부산',
    label: '부산',
    children: [
      { value: '해운대구', label: '해운대구' },
      { value: '사하구', label: '사하구' },
      { value: '금정구', label: '금정구' },
      { value: '부산진구', label: '부산진구' },
      { value: '동래구', label: '동래구' },
      { value: '수영구', label: '수영구' },
      { value: '연제구', label: '연제구' }
    ]
  },
  {
    value: '대구',
    label: '대구',
    children: [
      { value: '중구', label: '중구' },
      { value: '동구', label: '동구' },
      { value: '서구', label: '서구' },
      { value: '남구', label: '남구' },
      { value: '북구', label: '북구' },
      { value: '수성구', label: '수성구' },
      { value: '달서구', label: '달서구' }
    ]
  },
  {
    value: '광주',
    label: '광주',
    children: [
      { value: '동구', label: '동구' },
      { value: '서구', label: '서구' },
      { value: '남구', label: '남구' },
      { value: '북구', label: '북구' },
      { value: '광산구', label: '광산구' }
    ]
  },
  {
    value: '대전',
    label: '대전',
    children: [
      { value: '동구', label: '동구' },
      { value: '서구', label: '서구' },
      { value: '중구', label: '중구' },
      { value: '유성구', label: '유성구' },
      { value: '대덕구', label: '대덕구' }
    ]
  },
  {
    value: '울산',
    label: '울산',
    children: [
      { value: '중구', label: '중구' },
      { value: '남구', label: '남구' },
      { value: '동구', label: '동구' },
      { value: '북구', label: '북구' },
      { value: '울주군', label: '울주군' }
    ]
  },
  {
    value: '경남',
    label: '경남',
    children: [
      { value: '창원', label: '창원' },
      { value: '김해', label: '김해' },
      { value: '진주', label: '진주' },
      { value: '양산', label: '양산' },
      { value: '거제', label: '거제' }
    ]
  },
  {
    value: '경북',
    label: '경북',
    children: [
      { value: '포항', label: '포항' },
      { value: '구미', label: '구미' },
      { value: '경주', label: '경주' },
      { value: '안동', label: '안동' },
      { value: '영주', label: '영주' }
    ]
  },
  {
    value: '충남',
    label: '충남',
    children: [
      { value: '천안', label: '천안' },
      { value: '아산', label: '아산' },
      { value: '서산', label: '서산' },
      { value: '당진', label: '당진' },
      { value: '논산', label: '논산' }
    ]
  },
  {
    value: '충북',
    label: '충북',
    children: [
      { value: '청주', label: '청주' },
      { value: '충주', label: '충주' },
      { value: '제천', label: '제천' },
      { value: '음성', label: '음성' },
      { value: '진천', label: '진천' }
    ]
  },
  {
    value: '전남',
    label: '전남',
    children: [
      { value: '목포', label: '목포' },
      { value: '여수', label: '여수' },
      { value: '순천', label: '순천' },
      { value: '광양', label: '광양' },
      { value: '나주', label: '나주' }
    ]
  },
  {
    value: '전북',
    label: '전북',
    children: [
      { value: '전주', label: '전주' },
      { value: '익산', label: '익산' },
      { value: '군산', label: '군산' },
      { value: '정읍', label: '정읍' },
      { value: '남원', label: '남원' }
    ]
  },
  {
    value: '강원',
    label: '강원',
    children: [
      { value: '춘천', label: '춘천' },
      { value: '원주', label: '원주' },
      { value: '강릉', label: '강릉' },
      { value: '동해', label: '동해' },
      { value: '속초', label: '속초' }
    ]
  },
  {
    value: '제주',
    label: '제주',
    children: [
      { value: '제주시', label: '제주시' },
      { value: '서귀포시', label: '서귀포시' }
    ]
  }
];

export const TEST_RADIO_OPTIONS = [
  { value: 'man', label: '남자', color: '#6726FE' },
  { value: 'woman', label: '여자', color: "#F742AF" },
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
