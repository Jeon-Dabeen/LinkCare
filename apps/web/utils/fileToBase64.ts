export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("파일을 읽을 수 없습니다."));
        return;
      }

      const base64 = result.split(",")[1];

      if (!base64) {
        reject(new Error("Base64 데이터를 추출할 수 없습니다."));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}