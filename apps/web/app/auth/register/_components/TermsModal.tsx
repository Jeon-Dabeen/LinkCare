"use client";

import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import Button from "@/app/_components/ui/Button";
import { X } from "lucide-react";

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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <section>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>
              제 1 조 [ 목적 및 용어의 정의 ]
            </h4>
            <p>
              본 약관은 링크케어(이하 '회사')가 제공하는 건강관리 서비스(이하 '서비스')의 이용과 관련하여 회사와 회원의 권리, 의무 및 책임사항을 규정합니다.
            </p>
          </section>
          <section>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>
              제 2 조 [ 약관의 게시 및 개정 ]
            </h4>
            <p>
              회사는 본 약관을 서비스 내 화면에 게시하며, 법령을 위반하지 않는 범위에서 개정할 수 있습니다.
            </p>
          </section>
          <section>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>
              제 3 조 [ 면책 및 책임제한 ]
            </h4>
            <p className={commonStyle.textError}>
              [의료행위 불가] 본 서비스가 제공하는 모든 리포트 및 콘텐츠는 건강관리 참고용일 뿐, 의사의 진단·처방 등 의료행위를 대체할 수 없습니다.
            </p>
          </section>
        </div>
      ),
    },
    privacy: {
      title: "개인정보 처리방침",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <section>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>
              1. 수집하는 개인정보 항목
            </h4>
            <p>
              회사는 회원가입 및 서비스 제공을 위해 이메일, 비밀번호, 생년월일, 성별, 신장(키) 정보를 수집합니다.
            </p>
          </section>
          <section>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>
              2. 개인정보의 보유 및 이용기간
            </h4>
            <p>
              회원 탈퇴 시 수집된 개인정보는 즉시 파기됩니다.
            </p>
          </section>
        </div>
      ),
    },
    sensitive: {
      title: "민감정보 활용 동의",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <section>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>
              1. 민감정보의 수집 및 이용 목적
            </h4>
            <p>
              개인의 건강검진 및 건강 데이터는 개인 맞춤형 건강 리포트 제공, 건강 데이터 분석 및 모니터링 서비스를 목적으로 합니다.
              건강검진 데이터는 타인에게 제공 또는 공개하지 않으며 본 목적 이외의 다른 목적으로 사용하지 않습니다.
            </p>
          </section>
        </div>
      ),
    },
  };

  const currentTerm = termsData[type];

  return (
    /* 바텀시트를 완전히 덮는 화면 전체 어두운 오버레이 레이어 */
    <div style={overlayStyle}>
      {/* 팝업 모달 하얀색 윈도우 박스 */}
      <div style={modalContainerStyle}>

        {/* 1. 상단 헤더 (타이틀 + X 닫기 버튼) */}
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
            {currentTerm.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={closeBtnStyle}
            aria-label="닫기"
          >
            <X size={22} />
          </button>
        </div>

        {/* 2. 본문 영역 (내부 독립 스크롤) */}
        <div style={bodyStyle}>
          {currentTerm.content}
        </div>
      </div>
    </div>
  );
}


// CSS
// 전체 화면 덮는 어두운 배경 (BottomSheet의 z-index보다 높게 고정)
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999, // 바텀시트 위에 무조건 위치
  padding: "20px",
  boxSizing: "border-box",
};

// 모달 창 메인 컨테이너
const modalContainerStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "480px",
  maxHeight: "80vh", // 화면 높이의 80%로 제한
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
  overflow: "hidden",
};

// 헤더
const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  borderBottom: "1px solid #e5e5e5",
  backgroundColor: "#ffffff",
};

// 닫기 아이콘 버튼
const closeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#666666",
};

// 본문 (스크롤)
const bodyStyle: React.CSSProperties = {
  padding: "20px",
  overflowY: "auto",
  flex: 1, // 남은 여백을 본문 영역이 다 차지하도록 설정
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#333333",
};

// 푸터
const footerStyle: React.CSSProperties = {
  padding: "16px 20px",
  borderTop: "1px solid #e5e5e5",
  backgroundColor: "#ffffff",
};