
'use client';

import { useState } from "react";

import { useBaseDate } from "@/app/_providers/BaseDateProvider";

import { CircleOff, Goal, Pencil } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import styles from "@/styles/meal/meal.module.css";

import Grid from "../../_components/ui/Grid";
import Card from "../../_components/ui/Card";
import Button, { ButtonIcon } from "../../_components/ui/Button";
import Progress from "../../_components/ui/Progress";
import BottomSheet from "../../_components/ui/BottomSheet";
import Input from "../../_components/ui/Input";
import MealDetail from "../_components/mealDetail";
import PhotoButton from "../_components/photoButton";

export default function Page({
}){

  const [openGoal, setOpenGoal] = useState(false);
  
  function handleOpenGoal() {
    setOpenGoal(true);
  }

  const {baseDate, formattedDate} = useBaseDate();
  console.log(baseDate, formattedDate);

  return (
    <section className={commonStyle.mainContent}>
      <header className={commonStyle.pageTitleWrapper}>
        <div className={commonStyle.left}>
          <h2 className={commonStyle.pageTitle}>식사 다이어리</h2>
        </div>
      </header>
      
      <Grid>

        <Grid.ItemFull>
          1주일 달력
        </Grid.ItemFull>
        
        <Grid.ItemFull>
          <Card variant="color">
            <Card.Header 
              icon={<Goal />}
              title="목표 칼로리까지 영차영차!"
              right={
                <div className={styles.goalCalorie}>
                  <span className={styles.value}>1,800</span>
                  <span className={styles.unit}>kcal</span>
                  <ButtonIcon color="tertiary">
                    <Pencil onClick={handleOpenGoal}/>
                  </ButtonIcon>
                </div>
              }
            />
            <Card.Body noTopPadding>
              <Progress value={780} max={1800} />
            </Card.Body>
          </Card>
        </Grid.ItemFull>

        <Grid.ItemFull>
          <div className={styles.todayCalorie}>
            <strong className={styles.value}>780</strong>
            <strong className={styles.unit}>kcal</strong>
          </div>
          <article className={styles.photoList}>
            <div className={styles.photoItem}>
              <PhotoButton 
                label="breakfast"
                imageUrl="/images/food_sample/cheesy-tokbokki.jpg"
              />
              <Button variant="text-tertiary">
                <CircleOff size={16} /><span>안 먹었어요</span>
              </Button>
            </div>
            <div className={styles.photoItem}>
              <PhotoButton 
                label="lunch"
              />
              <Button variant="text-tertiary">
                <CircleOff size={16} /><span>안 먹었어요</span>
              </Button>
            </div>
            <div className={styles.photoItem}>
              <PhotoButton 
                label="dinner"
                canModify={false}
              />
              <Button variant="text-tertiary">
                <CircleOff size={16} /><span>안 먹었어요</span>
              </Button>
            </div>
          </article>
        </Grid.ItemFull>

        <Grid.ItemFull>
          <MealDetail>
            <MealDetail.List type="아침" onClick={()=>{}}>
              <MealDetail.Item name="시로인 스테이크" calorie="700" />
              <MealDetail.Item name="그린 샐러드" calorie="80" />
            </MealDetail.List>
            <MealDetail.List type="점심">
              <MealDetail.Item name="시로인 스테이크" calorie="700" />
              <MealDetail.Item name="그린 샐러드" calorie="80" />
            </MealDetail.List>
          </MealDetail>
        </Grid.ItemFull>
      </Grid>

      <BottomSheet
        open={openGoal}
        title="목표 칼로리"
        onClose={() => setOpenGoal(false)}>
          <div className={formStyle.formWrapper}>
            <div className={commonStyle.textInfo}>성인 하루 권장 칼로리는 보통 여성 1,900~2,000kcal, 남성 2,500~2,600kcal예요. <br/>내 몸에 맞는 목표를 설정해 보세요!</div>
            <div className={formStyle.formGroup}>
              <Input unit="kcal" type="number" id="goalCalorie" name="goalCalorie" required />
            </div>
            <Button type="button" variant="primary" size="large" onClick={() => {}} disabled>
              저장
            </Button>
          </div>
      </BottomSheet>
    </section>
  )
}


