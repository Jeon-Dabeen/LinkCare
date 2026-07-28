'use client';

import { useState } from "react";


import { Goal, Pencil } from "lucide-react";
import styles from "@/styles/meal/meal.module.css";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";

import { Card } from "@/app/_components/ui/Card";
import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import Progress from "@/app/_components/ui/Progress";
import BottomSheet from "@/app/_components/ui/BottomSheet";
import Input from "@/app/_components/ui/Input";
import { apiFetch } from "../_api/apiFetch";
import { GoalCalorieResponse } from "@/types/meal";


interface MealGoalCardProps {
  totalCalorie: number;
  goalCalorie: number;
  onRefresh: () => void; // 저장 후 화면 갱신용 부모 함수 (fetchMeal)
}

export default function MealGoalCard({
  totalCalorie,
  goalCalorie,
  onRefresh,
}: MealGoalCardProps){

  
  // 목표칼로리 수정용 상태
  const [openGoal, setOpenGoal] = useState(false);
  const [inputGoalCalorie, setinputGoalCalorie] = useState<number>(2000);


  // 바텀시트 열 때 현재 목표 칼로리로 초기화
  function handleOpenGoal() {
    if(goalCalorie) setinputGoalCalorie(goalCalorie);
    setOpenGoal(true);
  }

  const MAX_CALORIE = 6000;

  // input 변경
  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>){
    const value = Number(e.target.value);
    if(value > MAX_CALORIE){
      setinputGoalCalorie(MAX_CALORIE);
      return;
    }
    setinputGoalCalorie(Number(e.target.value))
  }

  // input 변경사항 유무 및 유효성 체크
  const isButtonDisabled = inputGoalCalorie === goalCalorie || !inputGoalCalorie || inputGoalCalorie <= 0 || inputGoalCalorie > MAX_CALORIE;
    
  // 목표 칼로리 저장하기
  async function handleSaveGoal(){
    try{
      // API 호출
      console.log('inputGoalCalorie', inputGoalCalorie)
      await apiFetch<GoalCalorieResponse>('/meal/goalCalorie', {
        method: 'PATCH',
        body: JSON.stringify({
          goalCalorie: inputGoalCalorie
        })
      })
      // 저장 후 성공하면 화면 데이터 재조회(fetchMeal) 및 바텀시트 닫기
      await onRefresh(); 
      setOpenGoal(false);
    }catch(error){
      alert('목표칼로리 변경 중 오류가 발생했습니다.');
    }
  }
    

  return (
    <>
      <Card variant="color">
        <Card.Header 
          icon={<Goal />}
          title="목표 칼로리까지 영차영차!"
          right={
            <div className={styles.goalCalorie}>
              <span className={styles.value}>{totalCalorie.toLocaleString()}</span>
              <span className={styles.unit}>kcal</span>
              <ButtonIcon color="tertiary" onClick={handleOpenGoal}>
                <Pencil/>
              </ButtonIcon>
            </div>
          }
        />
        <Card.Body noTopPadding>
          <Progress value={totalCalorie} max={goalCalorie} />
        </Card.Body>
      </Card>



      {/* bottomSheet */}
      <BottomSheet
        open={openGoal}
        title="목표 칼로리"
        onClose={() => setOpenGoal(false)}>
        <div className={formStyle.formWrapper}>
          <div className={commonStyle.textInfo}>성인 하루 권장 칼로리는 보통 여성 1,900~2,000kcal, 남성 2,500~2,600kcal예요. <br/>내 몸에 맞는 목표를 설정해 보세요!</div>
          <div className={formStyle.formGroup}>
            <Input 
              unit="kcal" type="number" 
              id="goalCalorie" name="goalCalorie"
              value={inputGoalCalorie}
              onChange={handleChangeInput}
            />
          </div>
          <Button type="button" variant="primary" size="large" onClick={handleSaveGoal} disabled={isButtonDisabled}>
            저장
          </Button>
        </div>
      </BottomSheet>
    </>

  )
}

