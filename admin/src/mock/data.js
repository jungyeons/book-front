const categories = ['소설', '자기계발', 'IT/컴퓨터', '경영/경제', '인문', '에세이', '과학', '역사', '건강', '예술'];
const booksRaw = [
    ['달러구트 꿈 백화점', '이미예', '팩토리나인', '소설', '9791165341909', 13800, 12420],
    ['불편한 편의점', '김호연', '나무옆의자', '소설', '9791161571188', 14000, 12600],
    ['역행자', '자청', '웅진지식하우스', '자기계발', '9788901260716', 17500, 15750],
    ['트렌드 코리아 2024', '김난도', '미래의창', '경영/경제', '9791191464290', 19800, 17820],
    ['아버지의 해방일지', '정지아', '창비', '소설', '9788936438838', 15000],
    ['물고기는 존재하지 않는다', '룰루 밀러', '곰출판', '과학', '9791189327156', 17000, 15300],
    ['클린 코드', '로버트 C. 마틴', '인사이트', 'IT/컴퓨터', '9788966260959', 33000, 29700],
    ['자바스크립트 완벽 가이드', '데이비드 플래너건', '인사이트', 'IT/컴퓨터', '9788966262748', 45000, 40500],
    ['미드나잇 라이브러리', '매트 헤이그', '인플루엔셜', '소설', '9791191056860', 14800, 13320],
    ['원씽', '게리 켈러', '비즈니스북스', '자기계발', '9788997575978', 14000],
    ['세이노의 가르침', '세이노', '데이원', '자기계발', '9791160406726', 6480],
    ['하루 한 페이지 세계사', '이근철', '위즈덤하우스', '역사', '9791168126039', 19800, 17820],
    ['당신이 옳다', '정혜신', '해냄', '인문', '9788965748687', 15800],
    ['나미야 잡화점의 기적', '히가시노 게이고', '현대문학', '소설', '9788972756378', 14800, 13320],
    ['아몬드', '손원평', '창비', '소설', '9788936434267', 12000, 10800],
    ['리팩터링 2판', '마틴 파울러', '한빛미디어', 'IT/컴퓨터', '9791162242742', 35000],
    ['부의 추월차선', '엠제이 드마코', '토트', '경영/경제', '9788996991342', 15800, 14220],
    ['죽고 싶지만 떡볶이는 먹고 싶어', '백세희', '흔', '에세이', '9791190090278', 14000],
    ['지구 끝의 온실', '김초엽', '자이언트북스', '소설', '9791165341053', 14000, 12600],
    ['타이탄의 도구들', '팀 페리스', '토네이도', '자기계발', '9791160540482', 25000],
    ['디자인 패턴', '에릭 감마', '프로텍미디어', 'IT/컴퓨터', '9788945072146', 38000, 34200],
    ['코스모스', '칼 세이건', '사이언스북스', '과학', '9788983711892', 20000],
    ['사피엔스', '유발 하라리', '김영사', '인문', '9788934972464', 24000, 21600],
    ['마흔에게', '김미경', '위즈덤하우스', '에세이', '9791168126510', 16800],
    ['파이썬 코딩의 기술', '브렛 슬라킨', '길벗', 'IT/컴퓨터', '9791165219758', 30000, 27000],
    ['꽃을 보듯 너를 본다', '나태주', '지혜', '에세이', '9788960170766', 10800],
    ['총균쇠', '재레드 다이아몬드', '문학사상', '역사', '9788970127248', 28000],
    ['돈의 심리학', '모건 하우절', '인플루엔셜', '경영/경제', '9791191056198', 18000, 16200],
    ['어떻게 살 것인가', '유시민', '아포리아', '인문', '9788997461004', 14000],
    ['건강의 배신', '바바라 에렌라이크', '부키', '건강', '9788960517851', 16000],
    ['단순한 열정', '아니 에르노', '문학동네', '소설', '9788954681773', 10000, 9000],
    ['완벽한 공부법', '고영성', '로크미디어', '자기계발', '9791135431609', 17800],
];
function pad(n, len = 3) { return String(n).padStart(len, '0'); }
function randomDate(start, end) {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return new Date(s + Math.random() * (e - s)).toISOString().split('T')[0];
}
export let products = booksRaw.map((b, i) => ({
    id: `PRD-${pad(i + 1)}`,
    title: b[0], author: b[1], publisher: b[2], category: b[3], isbn13: b[4],
    price: b[5], salePrice: b[6],
    stock: i < 3 ? Math.floor(Math.random() * 5) : 10 + Math.floor(Math.random() * 90),
    status: (i === 5 ? '품절' : i === 10 ? '판매중지' : '판매중'),
    tags: [b[3]], description: `${b[0]} - ${b[1]} 저. ${b[2]} 출판.`,
    images: [], subtitle: undefined,
    publishedDate: randomDate('2020-01-01', '2024-06-01'),
    createdAt: randomDate('2023-01-01', '2024-01-01'),
    updatedAt: randomDate('2024-01-01', '2024-12-01'),
}));
const customerNames = ['김민수', '이서연', '박지훈', '최윤아', '정도현', '강하늘', '조예은', '윤재석', '한미영', '오승준', '신정희', '임태호', '장수빈', '배진우', '류은채', '홍상민', '문지영', '안경훈', '송나연', '권혁진', '남궁현', '서지우'];
export let customers = customerNames.map((name, i) => ({
    id: `CUS-${pad(i + 1)}`,
    name,
    email: `user${i + 1}@example.com`,
    phone: `010-${pad(Math.floor(Math.random() * 10000), 4)}-${pad(Math.floor(Math.random() * 10000), 4)}`,
    grade: (i < 2 ? 'VVIP' : i < 6 ? 'VIP' : '일반'),
    totalOrders: Math.floor(Math.random() * 30) + 1,
    totalSpent: Math.floor(Math.random() * 2000000) + 50000,
    lastOrderAt: randomDate('2024-06-01', '2024-12-20'),
    createdAt: randomDate('2022-01-01', '2024-01-01'),
}));
const paymentStatuses = ['결제대기', '결제완료', '결제취소'];
const fulfillmentStatuses = ['주문접수', '상품준비중', '배송중', '배송완료', '주문취소'];
export let orders = Array.from({ length: 55 }, (_, i) => {
    const cust = customers[i % customers.length];
    const itemCount = 1 + (i % 3);
    const items = Array.from({ length: itemCount }, (_, j) => {
        const prod = products[(i * 3 + j) % products.length];
        const qty = 1 + (j % 2);
        return { productId: prod.id, title: prod.title, quantity: qty, unitPrice: prod.salePrice || prod.price };
    });
    const total = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
    const ps = paymentStatuses[i % 3];
    const fs = ps === '결제취소' ? '주문취소' : fulfillmentStatuses[i % 5];
    const d = randomDate('2024-01-01', '2024-12-20');
    return {
        id: `ORD-${pad(i + 1)}`, orderNumber: `2024${pad(1000 + i, 4)}`,
        customerId: cust.id, customerName: cust.name, items, totalAmount: total,
        paymentStatus: ps, fulfillmentStatus: fs,
        delivery: { receiverName: cust.name, phone: cust.phone, address1: `서울시 강남구 테헤란로 ${100 + i}`, address2: `${(i % 20) + 1}층` },
        createdAt: d, paidAt: ps === '결제완료' ? d : undefined,
    };
});
export let inventoryLogs = Array.from({ length: 65 }, (_, i) => {
    const prod = products[i % products.length];
    const types = ['입고', '출고', '조정'];
    const t = types[i % 3];
    return {
        id: `INV-${pad(i + 1)}`, productId: prod.id, productTitle: prod.title,
        type: t, quantity: t === '출고' ? -(1 + (i % 5)) : 1 + (i % 20),
        reason: t === '입고' ? '정기 입고' : t === '출고' ? '주문 출고' : '재고 실사 조정',
        createdAt: randomDate('2024-01-01', '2024-12-20'), actor: '관리자',
    };
});
export let coupons = [
    { id: 'CPN-001', code: 'WELCOME10', name: '신규 가입 10% 할인', discountType: '정률', discountValue: 10, minOrderAmount: 20000, maxDiscountAmount: 5000, startAt: '2024-01-01', endAt: '2025-12-31', status: '활성' },
    { id: 'CPN-002', code: 'BOOK5000', name: '도서 5,000원 할인', discountType: '정액', discountValue: 5000, minOrderAmount: 30000, startAt: '2024-06-01', endAt: '2024-12-31', status: '활성' },
    { id: 'CPN-003', code: 'VIP20', name: 'VIP 20% 할인', discountType: '정률', discountValue: 20, minOrderAmount: 50000, maxDiscountAmount: 15000, startAt: '2024-01-01', endAt: '2024-06-30', status: '만료' },
    { id: 'CPN-004', code: 'SUMMER3000', name: '여름 3,000원 할인', discountType: '정액', discountValue: 3000, minOrderAmount: 15000, startAt: '2024-07-01', endAt: '2024-08-31', status: '만료' },
    { id: 'CPN-005', code: 'NEWYEAR15', name: '새해 15% 할인', discountType: '정률', discountValue: 15, minOrderAmount: 25000, maxDiscountAmount: 10000, startAt: '2025-01-01', endAt: '2025-01-31', status: '활성' },
    { id: 'CPN-006', code: 'FLASH2000', name: '플래시 2,000원 할인', discountType: '정액', discountValue: 2000, startAt: '2024-11-01', endAt: '2024-11-07', status: '만료' },
    { id: 'CPN-007', code: 'READER25', name: '독서의 달 25% 할인', discountType: '정률', discountValue: 25, minOrderAmount: 40000, maxDiscountAmount: 20000, startAt: '2024-09-01', endAt: '2024-09-30', status: '비활성' },
    { id: 'CPN-008', code: 'SPRING7000', name: '봄맞이 7,000원 할인', discountType: '정액', discountValue: 7000, minOrderAmount: 35000, startAt: '2025-03-01', endAt: '2025-05-31', status: '활성' },
];
const reviewContents = [
    '정말 감동적인 책이었습니다. 강력 추천합니다!',
    '기대했던 것보다 조금 아쉬웠어요.',
    '배송도 빠르고 책 상태도 좋았습니다.',
    '인생 책을 만났습니다. 두 번 세 번 읽고 싶어요.',
    '내용은 좋은데 번역이 조금 아쉽네요.',
    '선물용으로 구매했는데 받으신 분이 좋아하셨어요.',
    '이 가격에 이 퀄리티라니, 대만족입니다.',
    '좀 지루한 부분도 있지만 전체적으로 괜찮습니다.',
    '저자의 다른 책도 읽어볼 예정입니다.',
    '읽기 쉽고 재미있어요. 술술 읽힙니다.',
];
export let reviews = Array.from({ length: 45 }, (_, i) => {
    const prod = products[i % products.length];
    const cust = customers[i % customers.length];
    return {
        id: `REV-${pad(i + 1)}`, productId: prod.id, productTitle: prod.title,
        customerName: cust.name, rating: 1 + (i % 5),
        content: reviewContents[i % reviewContents.length],
        status: (i % 7 === 0 ? '숨김' : '노출'),
        createdAt: randomDate('2024-01-01', '2024-12-20'),
    };
});
