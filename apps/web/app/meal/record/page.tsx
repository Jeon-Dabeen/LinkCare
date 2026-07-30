'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBaseDate } from "@/app/_providers/BaseDateProvider";

import { CirclePlus, Utensils } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import styles from "@/styles/meal/record.module.css";

import { MealFoodResponse } from "@/types/meal";
import { apiFetch } from "../_api/apiFetch";
import { analyzeFood } from "../_api/analyzeFood";

import { parseKcal } from "@/utils/meals";
import Button from "@/app/_components/ui/Button";
import EmptyPage from "@/app/_components/ui/EmptyPage";
import RecordPhoto from "./_components/recordPhoto";
import FoodItem from "./_components/foodItem";
import StatePage from "@/app/_components/ui/StatePage";
import { getMealTypeLabel, MealType } from "@/types/mealType";

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
  let isToday = (date === formattedDate);

  // 식사 상세 데이터(화면 편집용 데이터)
  const [foodItems, setFoodItems] = useState<TempFoodItemType[]>([]);

  // 기록가능 여부 상테
  const [recordMode, setRecordMode] = useState<RecordModeType | null>(null);
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  
  // 사진
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 데이터 불러오기
  useEffect(() => {
    if(!mealId) {
      setRecordMode('EMPTY');
      setIsLoading(false);
      return;
    };
    const fetchMealFood = async () => {
      try{
        const result = await apiFetch<MealFoodResponse>(`/meal/record/${mealId}`);
        const data = result.data;
        setCurrentImageUrl(data.photoUrl);
        setFoodItems(
          data.mealFood.map(item => ({
            id: item.id,
            foodName: item.FoodName,
            calorie: item.calorie ?? null
          }))
        );

        const hasData = data.mealFood.length > 0;
        const mealDate = data.mealDate?.slice(0, 10) ?? date;
        isToday = (mealDate === formattedDate);

        if(isToday){
          if(hasData){
            setRecordMode('EDIT');
          }else{
            setRecordMode('CREATE');
            // 등록 상태일 때 기본 아이템 1개 표시
            setFoodItems([
              {
                foodName: "",
                calorie: null,
              }
            ])
          }
        }else{
          hasData ? setRecordMode('READONLY') : setRecordMode('EMPTY');
        }

      }catch(error){
        if(error instanceof Error){
          console.error('식사 상세 데이터 로드 실패: ', error.message);
          alert(error.message);
        }
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

  // 사진 파일 업로드
  const handleImageSelected = async (file: File) => {
    setIsPhotoLoading(true);

    // 서버 전달용 파일 저장
    setSelectedFile(file);

    // 화면에 미리보기용 이미지 띄우기
    const previewUrl = URL.createObjectURL(file);
    setCurrentImageUrl(previewUrl);

    try{
      // 이미지 분석
      const foods = await analyzeFood(file);
      setFoodItems(
        foods.map((food:any) => ({
          foodName: food.name,
          calorie: parseKcal(food.kcal),
        }))
      )
    }catch(error){
      console.error('이미지 분석 실패: ', error);
      alert('이미지 분석에 실패했어요');
    }finally{
      setIsPhotoLoading(false);
    }
  }

  // 등록,수정 전 검증 함수
  const getValidFoodItems = (): MealFoodPayload[] | null => {
    const validItems: MealFoodPayload[] = [];

    for(const item of foodItems){
      const name = item.foodName ? item.foodName.trim() : '';
      const calorie = item.calorie;

      const hasName = name !== '';
      const hasCalorie = calorie !== null && calorie !== undefined && !isNaN(Number(calorie));

      // 둘 다 비어있으면 데이터에서 제외
      if(!hasName && !hasCalorie){
        continue;
      }

      // 둘 중 하나만 입력되어 있으면 에러
      if(hasName !== hasCalorie){
        alert(`음식명과 칼로리를 입력해주세요`);
        return null;
      }

      // 두 다 입력된 유효한 데이터 임시 보관
      validItems.push({
        foodName: name,
        calorie: Number(calorie),
      })
    }

    // 유효한 데이터가 없는지 확인
    if(validItems.length === 0){
      alert('1개 이상의 음식 정보를 입력해주세요');
      return null;
    }

    // 유효한 데이터가 5개가 넘지 않는지 확인
    if(validItems.length > 5){
      alert('음식은 최대 5개까지 등록할 수 있어요')
      return null;
    }
    
    return validItems;
  }

  // 등록 버튼 함수
  const handleCreate = async () => {
    const formData = new FormData();

    const foods = getValidFoodItems();
    
    if(!foods) {
      return;
    };

    formData.append('foods', JSON.stringify(foods));
    if(selectedFile){
      formData.append('image', selectedFile);
    }

    try{
      // 저장
      await apiFetch(`/meal/record/${mealId}`, {
        method: 'PATCH',
        body: formData,
      })
      // 화면 이동
      router.replace('/meal');
    }catch(error){
      if(error instanceof Error){
        console.error('저장에 실패했어요: ', error.message);
        alert(error.message);
      }
    }
  }

  // 삭제 버튼 함수
  const handleDelete = async () => {
    // 삭제 전 다시 확인
    const isConfirmed = window.confirm('정말 이 식사 기록을 삭제하실 건가요?');
    if(!isConfirmed) return;

    try{
      await apiFetch(`/meal/record/${mealId}`, {
        method: 'DELETE',
      })

      alert('성공적으로 삭제되었어요');

      // 화면 이동
      // router.replace('/meal');
    }catch(error){
      if(error instanceof Error){
        console.error('삭제에 샐패했어요: ', error.message);
        alert(error.message);
      }else{
        alert('삭제에 실패했어요');
      }
    }
  }

  if(isLoading){
    return (
      <StatePage 
        open={true}
        title='데이터 가져오는중'
        description={<>식사 데이터를 가져오고 있어요.<br/>잠시만 기다려주세요</>}
      />
    )
  }
    
  // 데이터 로드가 끝났는데 기록이 없을 때
  if(recordMode == 'EMPTY'){
    return (
      <EmptyPage
        icon={<Utensils size={32} />}
        title ="식사 상세 내용이 없어요"
      />
    )
  }

  if(isPhotoLoading){
    return (
      <StatePage 
        open={true}
        title='이미지 분석중'
        description={<>이미지의 식사 데이터를 분석하고 있어요.<br/>잠시만 기다려주세요</>}
      />
    )
  }

  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>{getMealTypeLabel(mealType as MealType)}식사 기록</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>

          <RecordPhoto 
            imageUrl={currentImageUrl}
            onSelectImage = {handleImageSelected}
          />

          <div className={styles.inputWrapper}>
            <ul className={styles.inputList}>
              {foodItems.map((item, index) => (
                <FoodItem 
                  key={index}
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
                    <Button type="button" variant="secondary" size="large" onClick={handleDelete}>
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
