


import { CirclePlus, CircleXIcon, Plus } from "lucide-react";
import commonStyle from "@/styles/common.module.css";
import formStyle from "@/styles/components/form.module.css";
import styles from "@/styles/meal/record.module.css";


import Button, { ButtonIcon } from "@/app/_components/ui/Button";
import Input from "@/app/_components/ui/Input";
import RecordPhoto from "./_components/recordPhoto";


type MealRecordProps = {
  searchParams: Promise<{
    date?: string;
    mealType?: string;
  }>;
};

export default async function MealRecord({ searchParams }: MealRecordProps) {
  const { date, mealType } = await searchParams;




  return (
    <section className={commonStyle.mainContent}>
      <div className={commonStyle.pageTitleWrapper}>
        <h2 className={commonStyle.pageTitle}>식사 기록</h2>
      </div>
      <div className={formStyle.formWrapper}>
        <form className={formStyle.form}>

          <RecordPhoto />
          

          <div className={styles.inputWrapper}>
            <ul className={styles.inputList}>
              <li className={styles.inputItem}>
                <ButtonIcon
                  color="secondary"
                >
                  <CircleXIcon/>
                </ButtonIcon>
                <div className={styles.name}>
                  <Input type="text" />
                </div>
                <div className={styles.unit}>
                  <Input type="number" unit="kcal" />
                </div>
              </li>
              <li className={styles.inputItem}>
                <ButtonIcon
                  color="secondary"
                >
                  <CircleXIcon/>
                </ButtonIcon>
                <div className={styles.name}>
                  <Input type="text" />
                </div>
                <div className={styles.unit}>
                  <Input type="number" unit="kcal" />
                </div>
              </li>
            </ul>

            <div className={styles.addButton}>
              <Button variant="text-primary" size="small">
                <CirclePlus />
                <span>음식 추가</span>
              </Button>
            </div>
          </div>



          <div className={commonStyle.fixedBottom}>
            <div className={commonStyle.fixedBottomInner}>
              <Button type="button" variant="secondary" size="large">
                삭제
              </Button>
              <Button type="button" variant="primary" size="large">
                저장
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}






