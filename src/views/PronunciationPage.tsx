import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/PronunciationPage.module.css";
import instance from "../api/axios";
import { CircularProgressBar } from "@tomickigrzegorz/react-circular-progress-bar";
import { IoCloudUploadOutline } from "react-icons/io5";
import LoadingBar from "../components/LoadingBar";
import { RiSpeakFill } from "react-icons/ri";
import { FaSquare } from "react-icons/fa";
import { FaRegPlayCircle } from "react-icons/fa";
import { IoIosMic } from "react-icons/io";
import { motion } from "framer-motion";
import * as Pitchy from "pitchy";
import ReactApexChart from "react-apexcharts";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

interface Score {
  AccuracyScore: number;
  CompletenessScore: number;
  FluencyScore: number;
  PronScore: number;
  PitchScore: number;
}

interface PitchResult {
  pitch: number;
  clarity: number;
}

// AccuracyScore: 정확도 점수는 사용자가 발음한 단어가 얼마나 정확한지를 평가합니다. 이 점수는 사용자의 발음이 참조 텍스트와 얼마나 잘 일치하는지를 나타내며, 높은 점수는 발음이 정확하다는 것을 의미합니다.

// CompletenessScore: 완성도 점수는 사용자가 참조 텍스트의 모든 단어를 발음했는지를 평가합니다. 만약 사용자가 텍스트의 일부 단어를 빠뜨리거나 추가하는 경우, 완성도 점수는 낮아집니다.

// FluencyScore: 유창성 점수는 사용자의 발음이 얼마나 자연스럽고 유창한지를 측정합니다. 이 점수는 말하기의 흐름, 속도, 그리고 자연스러움을 평가하여 사용자가 언어를 얼마나 유창하게 구사하는지를 나타냅니다.

// PronScore: 발음 점수는 사용자의 발음이 표준 발음에 얼마나 가까운지를 평가합니다. 이 점수는 발음의 정확성을 측정하며, 높은 점수는 표준 발음에 더 가까움을 의미합니다.

const PronunciationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [previousText, setPreviousText] = useState("");
  const [score, setScore] = useState<Score | null>(null);

  const [recording, setRecording] = useState(false);

  const [recorder, setRecorder] = useState<any>(null);

  const [pitchResults, setPitchResults] = useState<
    { pitch: number; clarity: number }[]
  >([]);

  const [pitchResultsTTS, setPitchResultsTTS] = useState<
    { pitch: number; clarity: number }[]
  >([]);

  const [audioUrl, setAudioUrl] = useState(""); // 오디오 URL 상태

  //파일 드래그오버 함수
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // 파일 드래그 드롭 함수
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // 그래프 점수별 색 변경 함수
  function getGradientColor(score?: number): string[] {
    if (score === undefined) {
      // 점수가 없는 경우 기본 색상 반환
      return ["#DDF5FE", "#DDF5FE"];
    }
    // 정의된 점수에 따라 색상 결정
    if (score < 60) {
      return ["#e74c3c", "#c0392b"]; // 빨간색 그라디언트
    } else if (score >= 60 && score < 80) {
      return ["#f39c12", "#e67e22"]; // 주황색 그라디언트
    } else if (score >= 80) {
      return ["#2980B9", "#6DD5FA"]; // 파란색 그라디언트
    }
    // 혹시 모르는 경우를 대비해 기본 색상을 한 번 더 반환
    return ["#DDF5FE", "#DDF5FE"];
  }

  // TTS 기능(피치분석 호출 포함됨)
  const handleSpeech = async () => {
    if (!text.trim()) {
      alert("텍스트를 입력해주세요.");
      return;
    }

    const accessToken = sessionStorage.getItem("accessToken");
    const data = { referenceText: text };

    if (text === previousText && audioUrl) {
      // 이전 텍스트와 현재 텍스트가 같고, 오디오 URL이 이미 존재하는 경우
      const audio = new Audio(audioUrl); // 이전 오디오 URL로 Audio 객체 생성
      audio.play(); // 오디오 재생
      return; // 함수 종료
    }

    try {
      const response = await instance.post("/api/speech/tts", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob", // 응답을 Blob으로 받기 위해 설정
      });

      const newAudioBlob = response.data;
      const newAudioUrl = URL.createObjectURL(newAudioBlob);
      setAudioUrl(newAudioUrl); // 새로운 오디오 URL 상태 업데이트
      setPreviousText(text); // 현재 텍스트를 이전 텍스트 상태로 설정

      const audioBuffer = await new AudioContext().decodeAudioData(
        await newAudioBlob.arrayBuffer()
      );
      analyzeAudioData(audioBuffer, setPitchResultsTTS); // TTS 오디오 데이터를 분석

      const audio = new Audio(newAudioUrl); // 새로운 Audio 객체 생성
      audio.play(); // 오디오 재생
    } catch (error) {
      console.error("Error loading or playing audio", error);
    }
  };

  // 녹음 함수 - 브라우저에서 녹음 승인 후 녹음 시작
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // RecordRTC를 사용하여 recorder 설정
        const recorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/wav", // WAV 형식으로 설정
          recorderType: StereoAudioRecorder, // 오디오 트랙을 스테레오로 녹음
          numberOfAudioChannels: 1, // 모노 채널
        });

        setRecorder(recorder);
        recorder.startRecording();
        setRecording(true);
      })
      .catch((error) => {
        console.error("녹음 기능을 시작할 수 없습니다:", error);
      });
  };

  // 녹음 중지 함수
  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const recordedBlob = recorder.getBlob();
        const recordedFile = new File([recordedBlob], "recorded_audio.wav", {
          type: "audio/wav",
          lastModified: Date.now(),
        });

        setFile(recordedFile); // 파일 상태 업데이트
        setRecording(false);

        // 스트림 트랙 중지
        recorder.stream.getTracks().forEach((track) => track.stop());
        analyzePitchFromFile(); // 녹음 데이터 설정 후 피치 분석
      });
    }
  };

  // 오디오 파일 피치 분석 알고리즘 //
  const analyzeAudioData = async (
    audioBuffer: AudioBuffer,
    setResultFunction: (results: PitchResult[]) => void // setResultFunction은 PitchResult 배열을 인자로 받고 반환 값이 없는 함수.
  ): Promise<void> => {
    const audioContext = new AudioContext(); // 오디오 컨텍스트를 생성
    const audioData = audioBuffer.getChannelData(0); // 첫 번째 채널 데이터 사용
    const frameSize = 4096; // 프레임 크기 설정
    const overlapFactor = 0.7; // 자세한 분석을 위해 오버랩 팩터 설정
    // 실제로 프레임 간 이동할 샘플 수 계산
    const stepSize = frameSize * (1 - overlapFactor);
    const sampleRate = audioContext.sampleRate;
    const tempPitchResults: PitchResult[] = [];

    // 오버랩을 고려하여 오디오 데이터를 순차적으로 분석
    for (let i = 0; i + frameSize <= audioData.length; i += stepSize) {
      const frame = audioData.slice(i, i + frameSize); // 현재 위치에서 프레임 크기만큼의 데이터를 자름
      const detector = Pitchy.PitchDetector.forFloat32Array(frame.length); // 피치 감지기
      const [pitch, clarity] = detector.findPitch(frame, sampleRate); // 피치 검출
      // 피치 범위와 명확도 범위를 지정(올바른 음성 데이터 추출을 위해)
      if (pitch >= 80 && pitch <= 270 && clarity >= 0.5) {
        tempPitchResults.push({ pitch, clarity: clarity * 100 });
      }
    }

    if (tempPitchResults.length > 0) {
      console.log("Pitch results:", tempPitchResults);
      setResultFunction(tempPitchResults);
    } else {
      console.error("No pitch detected or pitch detection failed.");
    }
  };

  // analyzeAudioData()를 이용해 업로드 파일 피치 분석
  const analyzePitchFromFile = async () => {
    if (!file) {
      console.error("No file available for pitch analysis");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer instanceof ArrayBuffer) {
        const audioBuffer = await new AudioContext().decodeAudioData(
          arrayBuffer
        );
        analyzeAudioData(audioBuffer, setPitchResults); // 파일에서 오디오 데이터를 분석
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    reader.readAsArrayBuffer(file);
  };

  // 음성파일이 업로드될 때마다 피치분석
  useEffect(() => {
    if (file) {
      analyzePitchFromFile();
    }
  }, [file]);

  // 녹음 토글
  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  //음성파일과 텍스트가 존재할때 발음평가 api 요청 후 점수 표기.
  const handleSubmit = async (event: React.FormEvent) => {
    if (!file || text.length === 0) {
      alert("음성파일과 비교할 텍스트를 모두 입력해주세요!");
      return;
    }
    event.preventDefault();
    //score 초기화
    setScore({
      AccuracyScore: 0,
      CompletenessScore: 0,
      FluencyScore: 0,
      PronScore: 0,
      PitchScore: 0,
    });
    const accessToken = sessionStorage.getItem("accessToken");

    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("referenceText", text);
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      console.log(file);
      try {
        const response = await instance.post("/api/speech", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = response.data.speechResult;
        setScore({
          AccuracyScore: Math.round(
            data.pronunciationAssessmentResult.AccuracyScore
          ),
          CompletenessScore: Math.round(
            data.pronunciationAssessmentResult.CompletenessScore
          ),
          FluencyScore: Math.round(
            data.pronunciationAssessmentResult.FluencyScore
          ),
          PronScore: Math.round(data.pronunciationAssessmentResult.PronScore),
          PitchScore: Math.round(data.pitchComparisonResult),
        });
        console.log(score);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error message:", error.message);

          if (axios.isAxiosError(error)) {
            console.error("Error data:", error.response?.data);
            console.error("Error status:", error.response?.status);
          }
        } else {
          console.error("An unexpected error occurred");
        }
      }
    }
  };

  const playRecordedAudio = () => {
    if (file) {
      // File에서 오디오 URL 생성
      const audioUrl = URL.createObjectURL(file);
      const audio = new Audio(audioUrl);
      audio.play(); // 오디오 재생
      audio.onended = () => URL.revokeObjectURL(audioUrl); // 재생이 끝난 후 URL 해제
    } else {
      alert("재생할 오디오 파일이 없습니다!");
    }
  };
  // 그래프 옵션 설정
  const graphOptions = {
    chart: {
      type: "area",
      zoom: {
        type: "x",
      },
      toolbar: {
        autoSelected: "pan",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      type: "numeric",
      min: 0,
      max: 50,
      labels: {
        formatter: function (val: string) {
          return parseInt(val).toString();
        },
      },
    },
    yaxis: {
      title: {
        text: "Pitch (Hz)",
      },
      min: 50,
      max: 300,
      labels: {
        formatter: function (val: number) {
          return val.toFixed(0);
        },
      },
    },
    colors: ["#2980B9", "#E74C3C"],
  };
  // 그래프에 사용할 데이터
  const graphSeries = [
    {
      name: "Recorded Pitch",
      data: pitchResults.map((result, index) => ({
        x: index,
        y: result.pitch,
      })),
    },
    {
      name: "TTS Pitch",
      data: pitchResultsTTS.map((result, index) => ({
        x: index,
        y: result.pitch,
      })),
    },
  ];

  return (
    <div className={styles.main_container}>
      {loading && <LoadingBar />}
      <div className={styles.top_name_wrap}>
        <div className={styles.top_name_container}>
          <h3>발음평가</h3>
        </div>
      </div>

      <div className={styles.input_btn}>
        <button onClick={handleSubmit}>평가하기</button>
      </div>

      <div className={styles.input_result_wrap}>
        <div className={styles.input_wrap}>
          <div className={styles.top_container}>
            <div className={styles.text_wrap}>
              <div className={styles.text_area}>
                <textarea
                  onChange={handleTextChange}
                  placeholder="평가할 문장을 입력해주세요."
                />
              </div>

              <div className={styles.tts_wrap}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={handleSpeech}
                  className={styles.play_container}
                >
                  <FaRegPlayCircle className={styles.play_icon} />
                  <p>음성으로 들어보기</p>
                </motion.div>
              </div>
            </div>

            <div className={styles.audio_wrap}>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={styles.input_area}
              >
                <div className={styles.upload_box_text}>
                  <p>평가할 발음의 오디오 파일을 등록해주세요.</p>
                </div>
                <label className={styles.upload_box}>
                  <input
                    className={styles.file}
                    type="file"
                    onChange={handleFileChange}
                  />
                  <IoCloudUploadOutline className={styles.upload_icon} />
                  <p className={styles.upload_msg}>
                    클릭 혹은 파일을 이곳에 드롭하세요.{" "}
                  </p>
                  {file && <p className={styles.filename}>{file.name}</p>}
                </label>{" "}
              </div>

              <div className={styles.recorder_wrap}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className={styles.recorder}
                  onClick={toggleRecording}
                >
                  <IoIosMic className={styles.mic_icon} />
                  <p>{recording ? "녹음 중지" : "녹음 시작"}</p>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className={styles.recorder}
                  onClick={playRecordedAudio}
                >
                  <IoIosMic className={styles.mic_icon} />
                  <p>업로드 한 음성 재생</p>
                </motion.div>
              </div>
            </div>
          </div>
          <div className={styles.graph_wrap}>
            <div className={styles.graph_text}>
              <p>음성 Pitch 그래프</p>
            </div>
            <ReactApexChart
              // options 오류 무시
              options={graphOptions}
              series={graphSeries}
              type="area"
              height="90%"
            />
          </div>
        </div>

        <div className={styles.result_wrap}>
          <div className={styles.result_text}>
            <RiSpeakFill className={styles.speak_icon} />
            <p>RESULT</p>
          </div>

          <div className={styles.progress_bar_wrap}>
            <div className={styles.progress_bar}>
              <div className={styles.type_of_progress}>발음 점수</div>
              <CircularProgressBar
                colorCircle="#DDF5FE"
                linearGradient={getGradientColor(score?.PronScore)}
                percent={score?.PronScore}
                round
                size={190}
                stroke={7}
                strokeBottom={5}
                styles={{
                  borderRadius: "50%",
                  boxShadow: "0 0 15px rgba(130, 230, 243, 0.8)",
                }}
              />
            </div>

            <div className={styles.progress_bar}>
              <div className={styles.type_of_progress}>정확도 점수</div>
              <CircularProgressBar
                colorCircle="#DDF5FE"
                linearGradient={getGradientColor(score?.AccuracyScore)}
                percent={score?.AccuracyScore}
                round
                size={190}
                stroke={7}
                strokeBottom={5}
                styles={{
                  borderRadius: "50%",
                  boxShadow: "0 0 15px rgba(130, 230, 243, 0.8)",
                }}
              />
            </div>

            <div className={styles.progress_bar}>
              <div className={styles.type_of_progress}>완성도 점수</div>
              <CircularProgressBar
                colorCircle="#DDF5FE"
                linearGradient={getGradientColor(score?.CompletenessScore)}
                percent={score?.CompletenessScore}
                round
                size={190}
                stroke={7}
                strokeBottom={5}
                styles={{
                  borderRadius: "50%",
                  boxShadow: "0 0 15px rgba(130, 230, 243, 0.8)",
                }}
              />
            </div>

            <div className={styles.progress_bar}>
              <div className={styles.type_of_progress}>유창성 점수</div>
              <CircularProgressBar
                colorCircle="#DDF5FE"
                linearGradient={getGradientColor(score?.FluencyScore)}
                percent={score?.FluencyScore}
                round
                size={190}
                stroke={7}
                strokeBottom={5}
                styles={{
                  borderRadius: "50%",
                  boxShadow: "0 0 15px rgba(130, 230, 243, 0.8)",
                }}
              />
            </div>

            <div className={styles.progress_bar}>
              <div className={styles.type_of_progress}>피치 점수</div>
              <CircularProgressBar
                colorCircle="#DDF5FE"
                linearGradient={getGradientColor(score?.PitchScore)}
                percent={score?.PitchScore}
                round
                size={190}
                stroke={7}
                strokeBottom={5}
                styles={{
                  borderRadius: "50%",
                  boxShadow: "0 0 15px rgba(130, 230, 243, 0.8)",
                }}
              />
            </div>
          </div>

          <div className={styles.score_color_wrap}>
            <div className={styles.color_score}>
              <FaSquare
                style={{
                  color: "red",
                }}
              />
              <p className={styles.color_score_text}>0~59</p>
            </div>

            <div className={styles.color_score}>
              <FaSquare
                style={{
                  color: "orange",
                }}
              />
              <p className={styles.color_score_text}>60~79</p>
            </div>

            <div className={styles.color_score}>
              <FaSquare
                style={{
                  color: "#6DD5FA",
                }}
              />
              <p className={styles.color_score_text}>80~100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PronunciationPage;
