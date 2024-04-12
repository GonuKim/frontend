import instance from "./axios";

interface Sentence {
  created_at: string;
  id: number;
  sentence: string;
  situation: any;
  updated_at: string;
  user_id: number;
}

export async function getSentences() {
  const { data } = await instance.get<Sentence[]>("/api/typing/getSentences");
  const result = data.map((d) => d.sentence);
  return result;
}
