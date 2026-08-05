"use client";

import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/auth/term.module.css";
import Modal from "@/app/_components/ui/Modal";

export type TermsType = "terms" | "privacy" | "sensitive";

interface TermsModalProps {
  isOpen: boolean;
  type: TermsType | null;
  onClose: () => void;
}

export default function TermsModal({ isOpen, type, onClose }: TermsModalProps) {
  if (!isOpen || !type) return null;

  const termsData = {
    terms: {
      title: "서비스 이용약관",
      content: (
        <div className={styles.agree}>
          <dl className={styles.agreeList}>
            <dt>
              제 1 조 [ 목적 및 용어의 정의 ]
            </dt>
            <dd>
              본 약관은 링크케어(이하 '회사')가 제공하는 건강관리 서비스(이하
              '서비스')의 이용과 관련하여 회사와 회원의 권리, 의무 및 책임사항을
              규정합니다.
            </dd>
          </dl>
          <dl className={styles.agreeList}>
            <dt>
              제 2 조 [ 약관의 게시 및 개정 ]
            </dt>
            <dd>
              회사는 본 약관을 서비스 내 화면에 게시하며, 법령을 위반하지 않는
              범위에서 개정할 수 있습니다.
            </dd>
          </dl>
          <dl className={styles.agreeList}>
            <dt>
              제 3 조 [ 면책 및 책임제한 ]
            </dt>
            <dd>
              <p className={commonStyle.textError}>
                [의료행위 불가] 본 서비스가 제공하는 모든 리포트 및 콘텐츠는
                건강관리 참고용일 뿐, 의사의 진단·처방 등 의료행위를 대체할 수
                없습니다.
              </p>
            </dd>
          </dl>
        </div>
      ),
    },
    privacy: {
      title: "개인정보 처리방침",
      content: (
        <div className={styles.agree}>
          <dl className={styles.agreeList}>
            <dt>
              1. 수집하는 개인정보 항목
            </dt>
            <p>
              회사는 회원가입 및 서비스 제공을 위해 이메일, 비밀번호, 생년월일,
              성별, 신장(키) 정보를 수집합니다.
            </p>
          </dl>
          <dl className={styles.agreeList}>
            <dt>
              2. 개인정보의 보유 및 이용기간
            </dt>
            <dd>회원 탈퇴 시 수집된 개인정보는 30일간 보관 후 파기됩니다.</dd>
          </dl>
        </div>
      ),
    },
    sensitive: {
      title: "민감정보 활용 동의",
      content: (
        <div className={styles.agree}>
          <dl className={styles.agreeList}>
            <dt>
              민감정보의 수집 및 이용 목적
            </dt>
            <dd>
              개인의 건강검진 및 건강 데이터는 개인 맞춤형 건강 리포트 제공,
              건강 데이터 분석 및 모니터링 서비스를 목적으로 합니다. 건강검진
              데이터는 타인에게 제공 또는 공개하지 않으며 본 목적 이외의 다른
              목적으로 사용하지 않습니다.
            </dd>
          </dl>
        </div>
      ),
    },
  };

  const currentTerm = termsData[type];

  return (
    <Modal open={true} title={currentTerm.title} onClose={onClose}>
      {currentTerm.content}
    </Modal>
  );
}
