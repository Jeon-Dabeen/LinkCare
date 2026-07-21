'use client';

import Image from "next/image";

import { Plus } from "lucide-react";
import styles from "@/styles/meal/recordPhoto.module.css"



type RecordPhotoProps = {
  imageUrl?: string;
}

export default function RecordPhoto({
  imageUrl,
}: RecordPhotoProps){


  imageUrl = "/images/food_sample/cheesy-tokbokki.jpg"


  return (
    <div className={styles.wrapper}>

      <button type="button" className={styles.button}>
        <Plus/>
      </button>

      {imageUrl && 
        <div className={styles.photo}>
          <Image src={imageUrl} alt={`사진`} width={100} height={100} />
        </div>
      }
    </div>
  )
}



