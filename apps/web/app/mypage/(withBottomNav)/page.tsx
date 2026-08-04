"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Cake,
  ChevronRight,
  KeyRound,
  Ruler,
  User,
  VenusAndMars,
} from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import styles from "@/styles/mypage/mypage.module.css";

import { apiFetch } from "@/utils/api/apiFetch";
import { logoutApi } from "@/utils/api/logoutApi";

import { formatDate } from "@/utils/format";
import { ProfileType } from "@/types/profile";
import Button from "@/app/_components/ui/Button";
import MyCard from "../_components/myCard";
import { getGenderTypeLabel } from "@/types/profileType";
import BottomSheetNickName from "../_components/BottomSheetNickName";
import BottomSheetGender from "../_components/BottomSheetGender";
import BottomSheetBirth from "../_components/BottomSheetBirth";
import BottomSheetHeight from "../_components/BottomSheetHeight";

type ActiveSheet = "nickName" | "gender" | "birth" | "height" | null;

const INITIAL_PROFILE: ProfileType = {
  id: null,
  userId: null,
  nickName: null,
  gender: null,
  birthDate: null,
  height: null,
};

export default function MyPage() {
  const router = useRouter();

  // 프로필 데이터 상태 관리
  const [profileData, setProfileData] = useState<ProfileType | null>(
    INITIAL_PROFILE,
  );

  // bottom sheet 상태 관리
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

  // 데이터 불러오기 함수
  const fetchProfile = useCallback(async () => {
    try {
      const response = await apiFetch<ProfileType>(`/profile`);
      setProfileData(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("프로필 데이터 로드 실패 ", error.message);
        alert(error.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 프로필 수정 API 호출 함수
  const handleUpdateProfile = async (uadateData: Partial<ProfileType>) => {
    // API 호출 로직
    try {
      await apiFetch(`/profile`, {
        method: "PATCH",
        body: JSON.stringify(uadateData),
      });
      // 수정 후 프로필 데이터 새로고침
      fetchProfile();
      toast.success("프로필이 성공적으로 수정되었어요!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("프로필 수정 실패 ", error.message);
        toast.error(error.message);
      }
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logoutApi();
      toast.success("로그아웃이 완료되었어요");
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        console.error("로그아웃 실패 ", error.message);
        toast.error(error.message);
      }
    }
  };

  return (
    <section className={commonStyle.mainContent}>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>마이페이지</h2>
        </div>
      </header>

      <div className={styles.contents}>
        <div className={styles.card}>
          <MyCard
            icon={<User />}
            label="닉네임"
            value={profileData?.nickName ?? ""}
            onClick={() => setActiveSheet("nickName")}
          />
          <MyCard
            icon={<VenusAndMars />}
            label="성별"
            value={getGenderTypeLabel(profileData?.gender)}
            onClick={() => setActiveSheet("gender")}
          />
          <MyCard
            icon={<Cake />}
            label="생년월일"
            value={formatDate(profileData?.birthDate)}
            onClick={() => setActiveSheet("birth")}
          />
          <MyCard
            icon={<Ruler />}
            label="키"
            value={profileData?.height ? `${profileData.height}cm` : ""}
            onClick={() => setActiveSheet("height")}
          />
        </div>

        <div className={styles.changePw}>
          <button
            type="button"
            className={styles.changePwBtn}
            onClick={() => router.push("/mypage/changePassword")}
          >
            <KeyRound size={24} className={styles.icon} />
            <span className={styles.text}>비밀번호 변경</span>
            <ChevronRight size={16} className={styles.iconArrow} />
          </button>
        </div>
      </div>

      <div className={styles.textButtonWrapper}>
        <div className={styles.textButton}>
          <Button variant="text-secondary" size="small" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
        <div className={styles.textButton}>
          <Button
            variant="text-secondary"
            size="small"
            onClick={() => router.push("/auth/withdraw")}
          >
            회원탈퇴
          </Button>
        </div>
      </div>

      <BottomSheetNickName
        isOpen={activeSheet === "nickName"}
        currentValue={profileData?.nickName ?? ""}
        onClose={() => setActiveSheet(null)}
        onSave={(nickName) => handleUpdateProfile({ nickName })}
        onRefresh={fetchProfile}
      />

      <BottomSheetGender
        isOpen={activeSheet === "gender"}
        currentValue={profileData?.gender ?? null}
        onClose={() => setActiveSheet(null)}
        onSave={(gender) => handleUpdateProfile({ gender })}
      />

      <BottomSheetBirth
        isOpen={activeSheet === "birth"}
        currentValue={profileData?.birthDate ?? ""}
        onClose={() => setActiveSheet(null)}
        onSave={(birthDate) => handleUpdateProfile({ birthDate })}
        onRefresh={fetchProfile}
      />

      <BottomSheetHeight
        isOpen={activeSheet === "height"}
        currentValue={profileData?.height ?? ""}
        onClose={() => setActiveSheet(null)}
        onSave={(height) => handleUpdateProfile({ height })}
        onRefresh={fetchProfile}
      />
    </section>
  );
}
