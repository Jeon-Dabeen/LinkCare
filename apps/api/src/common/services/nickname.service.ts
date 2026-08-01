import { Injectable } from '@nestjs/common';

@Injectable()
export class NicknameService {
  constructor() {}
  // 50개 형용사
  private readonly adjectives: string[] = [
    '행복한', '신난', '용감한', '배고픈', '똑똑한', '잠자는', '즐거운', '친절한', '지혜로운', '부지런한',
    '조용한', '빛나는', '달콤한', '따뜻한', '귀여운', '멋진', '자유로운', '포근한', '열정적인', '당당한',
    '소중한', '상쾌한', '건강한', '활기찬', '솔직한', '차분한', '새로운', '슬기로운', '평화로운', '우아한',
    '화려한', '근엄한', '느긋한', '신비로운', '단단한', '유쾌한', '상상하는', '꿈꾸는', '노래하는', '춤추는',
    '날쌔고', '도도한', '순수한', '정직한', '다정한', '푸근한', '자상한', '영리한', '씩씩한', '기분좋은',
  ];

  // 50개 명사
  private readonly nouns: string[] = [
    '사자', '호랑이', '고양이', '강아지', '토끼', '판다', '여우', '곰', '다람쥐', '돌고래',
    '수달', '펭귄', '쿼카', '알파카', '부엉이', '사슴', '하늘다람쥐', '물개', '바다표범', '코알라',
    '레서판다', '카피바라', '고슴도치', '햄스터', '치타', '표범', '표범고양이', '사막여우', '북극곰', '라쿤',
    '올빼미', '독수리', '펠리컨', '플라밍고', '비버', '물뿔소', '순록', '바다코끼리', '물범', '오리',
    '병아리', '타조', '백구', '황구', '개발자', '러너', '파트너', '메이트', '지킴이', '탐험가',
  ];

  /**
   * 순수 닉네임 생성 (숫자 없음)
   * @example "신난쿼카"
   */
  generateBaseNickname(): string {
    const randomAdj = this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
    const randomNoun = this.nouns[Math.floor(Math.random() * this.nouns.length)];
    return `${randomAdj}${randomNoun}`;
  }

  /**
   * 2자리 랜덤 숫자 생성 (10 ~ 99)
   */
  generateTwoDigitNumber(): number {
    return Math.floor(Math.random() * 90 + 10);
  }
}