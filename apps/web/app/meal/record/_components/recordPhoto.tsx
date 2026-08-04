"use client";

import Image from "next/image";
import { useRef } from "react";

import { Plus } from "lucide-react";
import styles from "@/styles/meal/recordPhoto.module.css";

type RecordPhotoProps = {
  imageUrl?: string | null;
  onSelectImage?: (file: File) => void;
};

export default function RecordPhoto({
  imageUrl,
  onSelectImage,
}: RecordPhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 버튼 클릭 시 숨겨진 file input 클릭
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 파일이 선택됐을 때
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSelectImage) {
      onSelectImage(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      {onSelectImage && (
        <>
          <button
            type="button"
            className={styles.button}
            onClick={handleButtonClick}
          >
            <Plus />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </>
      )}

      {imageUrl && (
        <div className={styles.photo}>
          <Image src={imageUrl} alt={`사진`} width={100} height={100} />
        </div>
      )}
    </div>
  );
}
