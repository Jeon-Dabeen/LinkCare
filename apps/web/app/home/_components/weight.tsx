
import clsx from "clsx";
import { UserRound } from "lucide-react";
import styles from "@/styles/home/weight.module.css";

import { Card } from "@/app/_components/ui/Card";
import PersonIcon from "./persionIcon";



type WeightProps = {
  current: string,
  goal: string
}




export default function Weight({
  current,
  goal
}: WeightProps) {

  const goalWeight = Number(goal);
  const currentWeight = Number(current);

  const hasWeight =
    Number.isFinite(goalWeight) &&
    Number.isFinite(currentWeight) &&
    goalWeight > 0;

  // 목표 대비 현재 체중 차이를 강조
  const scaleX = hasWeight
    ? Math.min(
        Math.max(
          1 + ((currentWeight - goalWeight) / goalWeight) * 2.5,
          0.7
        ),
        1.4
      )
    : 1;
  

  return (
    <Card variant="color">
      <Card.Body>
        <div className={styles.wrapper}>
          <dl className={clsx(
            styles.count,
            styles.goal
          )}>
            <dt>목표 체중</dt>
            <dd>
              <strong>{goal}</strong>kg
            </dd>
          </dl>
          <div className={styles.icon}>
            {/* 목표 체형 */}
            <PersonIcon className={styles.iconGoal} fill="currentColor" />

            {/* 현재 체형 */}
            {hasWeight && (
              <div
                className={styles.currentWrapper}
                style={
                  {
                    "--scale-x": scaleX,
                  } as React.CSSProperties
                }
              >
                <PersonIcon className={styles.iconCurrent} stroke="currentColor" />
              </div>
            )}
          </div>
          <dl className={clsx(
            styles.count,
            styles.current
          )}>
            <dt>현재 체중</dt>
            <dd>
              <strong>{current}</strong>kg
            </dd>
          </dl>
        </div>
      </Card.Body>
    </Card>
  )
}