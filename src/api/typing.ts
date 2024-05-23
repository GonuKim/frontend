import instance from "./axios";

interface Sentence {
  created_at: string;
  id: number;
  sentences: string;
  situation: any;
  updated_at: string;
  user_id: number;
}

export async function getSentences() {
  const { data } = await instance.get<Sentence[]>("/api/typing/getSentences");
  const result = data.map((d) => JSON.parse(d.sentences));
  return result;
}
