import instance from "./axios";

interface UserSentence {
  created_at: string;
  id: number;
  sentence: string;
  situation: any;
  updated_at: string;
  user_id: number;
}

export async function getUserSentences() {
  const { data } = await instance.get<UserSentence[]>(
    "/api/typing/getUserSentences"
  );
  const result = data.map((d) => d.sentence);
  return result;
}
