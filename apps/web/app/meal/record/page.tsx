'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";


import { CirclePlus, CircleXIcon, Utensils } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import styles from "@/styles/meal/record.module.css";


import { MealFoodResponse } from "@/types/meal";
import { apiFetch } from "../_api/apiFetch";

import Button from "@/app/_components/ui/Button";
import EmptyPage from "@/app/_components/ui/EmptyPage";
import RecordPhoto from "./_components/recordPhoto";
import FoodItem from "./_components/foodItem";


type RecordModeType =
  | 'EDIT'      // 오늘 + 기존 데이터 있음 (수정)
  | 'CREATE'    // 오늘 + 기존 데이터 없음 (등록)
  | 'READONLY'  // 과거 데이터 있음 (읽기만 가능)
  | 'EMPTY'     // 과거 테이터 없음

type TempFoodItemType = {
  id?: number; 
  foodName: string;
  calorie: number | null;
}

type MealFoodPayload = {
  foodName: string;
  calorie: number;
};

export default function MealRecord() {

  const router = useRouter();
  const {formattedDate} = useBaseDate();

  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const mealType = searchParams.get('mealType');
  const mealId = searchParams.get('mealId');

  // 오늘 날짜인지 확인
  const isToday = (date === formattedDate);


  // 뒤로가기 or 목록화면으로 이동 함수
  const goBackorMeal = () => {
    if(
      document.referrer && new URL(document.referrer).origin === window.location.origin
    ){
      router.back();
    }else{
      router.replace('/meal');
    }
  }

  // 식사 상세 데이터 상태(fetch로 받아온 데이터)
  const [recordDatas, setRecordDatas] = useState<MealFoodResponse[] | null>(null);

  // 식사 상세 데이터(화면 편집용 데이터)
  const [foodItems, setFoodItems] = useState<TempFoodItemType[]>([]);

  // 기록가능 여부 상테
  const [recordMode, setRecordMode] = useState<RecordModeType | null>(null);
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  

  // 데이터 불러오기
  useEffect(() => {
    if(!mealId) {
      setRecordMode('EMPTY');
      setIsLoading(false);
      return;
    };
    const fetchMealFood = async () => {
      try{
        const data = await apiFetch<MealFoodResponse[]>(`/meal/record/${mealId}`);
        setRecordDatas(data);
        setFoodItems(
          data.map(item => ({
            id: item.id,
            foodName: item.FoodName,
            calorie: item.calorie ?? null
          }))
        );
        console.log('recordDatas', data)

        const hasData = data.length > 0;

        if(isToday){
          hasData ? setRecordMode('EDIT') : setRecordMode('CREATE');
        }else{
          hasData ? setRecordMode('READONLY') : setRecordMode('EMPTY');
        }

      }catch(error){
        console.error(`식사 상세 데이터 로드 실패: `, error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchMealFood();
  }, [mealId, isToday]);
  
  // 기록가능 여부 
  const editable =
    recordMode === "EDIT" ||
    recordMode === "CREATE";
    
  if(recordMode == 'EMPTY'){
    return (
      <EmptyPage
        icon={<Utensils size={32} />}
        title ="식사 상세 내용이 없어요"
      />
    )
  }

  // 등록 상태일 때 기본 아이템 1개 표시
  if(recordMode == 'CREATE'){
    
  }

  // 아이템 추가 버튼 함수
  const addFoodItem = () => {
    if(foodItems.length >= 5){
      alert('더 이상 추가할 수 없어요');
      return;
    }
    setFoodItems(prev => [
      ...prev,
      {
        foodName: '',
        calorie: null,
      }
    ])
  }

  // 아이템 수정 함수
  const onChangeFoodItem = (
    index: number, field: 'foodName' | 'calorie', value: string | number | null
  ) => {
    setFoodItems(prev => 
      prev.map((item, i) => 
        i === index ? {...item, [field]: value} : item
      )
    )
  }

  // 아이템 삭제 함수
  const removeFoodItem = (index: number) => {
    setFoodItems(prev => 
      prev.filter((_, i) => i !== index)
    )
  }


  // 사진 등록




  // 등록,수정 전 검증 함수
  const getValidFoodItems = (): MealFoodPayload[] | null => {
    // const invalidItem = foodItems.some(item => {
    //   const hasName = item.foodName.trim() !== "";
    //   const hasCalorie = item.calorie !== null;

    //   // 둘 중 하나만 입력된 경우
    //   return hasName != hasCalorie;
    // });

    // if(!invalidItem) return null;


    const hasEmpty = foodItems.some(
      item => item.foodName.trim() === "" || item.calorie === null
    )

    if(hasEmpty) return null;

    return foodItems.map(item => ({
      foodName: item.foodName.trim(),
      calorie: item.calorie!,
    }))
  }

  // 등록 버튼 함수
  const handleCreate = async () => {
    const foods = getValidFoodItems();
    console.log('등록 버튼 data', foods)
    if(!foods) {
      alert('음식명과 칼로리를 모두 입력해주세요')
      return;
    };

    try{
      // 저장
      await apiFetch(`/meal/record/${mealId}`, {
        method: 'PUT',
        body: JSON.stringify({
          foods,
        })
      })
      // 화면 이동
      router.replace('/meal');
    }catch(error){
      console.log(error);
      alert('저장에 실패했어요')
    }
  }

  // 수정 버튼 함수

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>식사 기록</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>

          <RecordPhoto 
            onClick = {() => {}}
          />
          

          <div className={styles.inputWrapper}>
            <ul className={styles.inputList}>
              {foodItems.map((item, index) => (
                <FoodItem 
                  key={item.id ?? index}
                  foodName={item.foodName}
                  calorie={item.calorie}
                  canModify={editable}
                  onDelete={() => removeFoodItem(index)}
                  onChange={(field, value) => onChangeFoodItem(index, field, value)}
                />
              ))}
            </ul>

            {editable && (
              <div className={styles.addButton}>
                <Button type="button" variant="text-primary" size="small" onClick={addFoodItem}>
                  <CirclePlus />
                  <span>음식 추가</span>
                </Button>
              </div>
            )}
          </div>

          {editable &&
            <div className={commonStyle.fixedBottom}>
              <div className={commonStyle.fixedBottomInner}>
                {recordMode === 'EDIT' && (
                  <>
                    <Button type="button" variant="secondary" size="large">
                      삭제
                    </Button>
                    <Button type="button" variant="primary" size="large" onClick={handleCreate}>
                      저장
                    </Button>
                  </>
                )}
                {recordMode === 'CREATE' && (
                  <>
                    <Button type="button" variant="primary" size="large" onClick={handleCreate}>
                      등록
                    </Button>
                  </>
                )}
              </div>
            </div>
          }
        </form>
      </div>
    </section>
  )
}






