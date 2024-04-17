import instance from "./axios";

// 유저 문장 등록 API 주소
const USER_SENTENCE_API = "/api/typing/user";

// 텍스트 업로드 함수 정의
export async function uploadUserText(text: string): Promise<void> {
  try {
    // 'sentence' 필드를 포함한 객체 생성
    const data = { sentence: text };

    // 텍스트 업로드 요청
    const response = await instance.post(USER_SENTENCE_API, data);
    // 업로드 성공 시 추가적인 처리 가능
    console.log("Text uploaded successfully:", response.data);
  } catch (error) {
    // 업로드 실패 시 에러 처리
    console.error("Failed to upload text:", error);
    throw error; // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록 함
  }
}
