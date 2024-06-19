import styles from "../css/SituationalExample.module.css";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaRegCopy } from "react-icons/fa";

const SituationalExample = () => {
  const exampleTexts = {
    Introduce: [
      {
        japanese: "はじめまして。",
        kana: "[ 하지메마시떼 ]",
        meaning: "처음뵙겠습니다.",
      },
      {
        japanese: "韓国のソウルから来ました。",
        kana: "[ 칸코쿠노 소우루카라 키마시타 ]",
        meaning: "한국 서울에서 왔어요.",
      },
      {
        japanese: "私の名前は田中です。",
        kana: "[ 와타시노 나마에와 타나카 데스 ]",
        meaning: "제 이름은 다나카입니다.",
      },
      {
        japanese: "よろしくお願いします。",
        kana: "[ 요로시쿠 오네가이시마스 ]",
        meaning: "잘 부탁드립니다.",
      },
      {
        japanese: "趣味は読書です。",
        kana: "[ 슈미와 도쿠쇼 데스 ]",
        meaning: "취미는 독서입니다.",
      },
      {
        japanese: "日本語を勉強しています。",
        kana: "[ 니혼고 오 벤쿄우 시테이마스 ]",
        meaning: "일본어를 공부하고 있습니다.",
      },
      {
        japanese: "何歳ですか?",
        kana: "[ 난사이 데스카? ]",
        meaning: "몇 살입니까?",
      },
      {
        japanese: "会社員です。",
        kana: "[ 카이샤인 데스 ]",
        meaning: "회사원입니다.",
      },
      {
        japanese: "学生です。",
        kana: "[ 가쿠세이 데스 ]",
        meaning: "학생입니다.",
      },
      {
        japanese: "どこに住んでいますか?",
        kana: "[ 도코니 슨데이마스카? ]",
        meaning: "어디에 살고 있습니까?",
      },
    ],
    Restaurant: [
      {
        japanese: "一番人気のあるメニューは何ですか?",
        kana: "[ 이치반닌키노 아루 메뉴와 난데스까? ]",
        meaning: "제일 인기있는 메뉴가 무엇입니까?",
      },
      {
        japanese: "カード決済できますか？",
        kana: "[ 카아도켓사이데키마스카 ]",
        meaning: "카드 계산 가능한가요?",
      },
      {
        japanese: "おすすめは何ですか?",
        kana: "[ 오스스메와 난데스까? ]",
        meaning: "추천 메뉴는 무엇입니까?",
      },
      {
        japanese: "席はありますか?",
        kana: "[ 세키와 아리마스까? ]",
        meaning: "자리는 있습니까?",
      },
      {
        japanese: "禁煙席をお願いします。",
        kana: "[ 킨엔세키 오 오네가이시마스 ]",
        meaning: "금연석을 부탁합니다.",
      },
      {
        japanese: "お会計をお願いします。",
        kana: "[ 오카이케이 오 오네가이시마스 ]",
        meaning: "계산을 부탁합니다.",
      },
      {
        japanese: "持ち帰りできますか?",
        kana: "[ 모치카에리 데키마스카? ]",
        meaning: "포장할 수 있습니까?",
      },
      {
        japanese: "この料理は何ですか?",
        kana: "[ 코노 료오리와 난데스까? ]",
        meaning: "이 요리는 무엇입니까?",
      },
      {
        japanese: "辛い料理はありますか?",
        kana: "[ 카라이 료오리와 아리마스카? ]",
        meaning: "매운 요리는 있습니까?",
      },
      {
        japanese: "デザートをお願いします。",
        kana: "[ 데자토 오 오네가이시마스 ]",
        meaning: "디저트를 부탁합니다.",
      },
    ],
    Travel: [
      {
        japanese: "こんにちは",
        kana: "こんにちは",
        meaning: "안녕하세요",
      },
      {
        japanese: "さようなら",
        kana: "さようなら",
        meaning: "안녕히 가세요",
      },
      {
        japanese: "これはどこですか?",
        kana: "[ 코레와 도코 데스까? ]",
        meaning: "이곳은 어디입니까?",
      },
      {
        japanese: "地図を見せてください。",
        kana: "[ 치즈 오 미세테쿠다사이 ]",
        meaning: "지도를 보여주세요.",
      },
      {
        japanese: "トイレはどこですか?",
        kana: "[ 토이레와 도코 데스까? ]",
        meaning: "화장실은 어디입니까?",
      },
      {
        japanese: "写真を撮ってもいいですか?",
        kana: "[ 샤신 오 톳테모 이이 데스까? ]",
        meaning: "사진을 찍어도 되나요?",
      },
      {
        japanese: "どのくらいかかりますか?",
        kana: "[ 도노쿠라이 카카리마스까? ]",
        meaning: "얼마나 걸립니까?",
      },
      {
        japanese: "バス停はどこですか?",
        kana: "[ 바스테이와 도코 데스까? ]",
        meaning: "버스 정류장은 어디입니까?",
      },
      {
        japanese: "次の駅は何ですか?",
        kana: "[ 츠기노 에키와 난데스까? ]",
        meaning: "다음 역은 어디입니까?",
      },
      {
        japanese: "お土産を買いたいです。",
        kana: "[ 오미야게 오 카이타이 데스 ]",
        meaning: "기념품을 사고 싶습니다.",
      },
    ],
    Hotel: [
      {
        japanese: "予約をしたいです。",
        kana: "[ 요야쿠 오 시타이 데스 ]",
        meaning: "예약을 하고 싶습니다.",
      },
      {
        japanese: "チェックインをお願いします。",
        kana: "[ 첵쿠인 오 오네가이시마스 ]",
        meaning: "체크인 부탁합니다.",
      },
      {
        japanese: "チェックアウトは何時ですか?",
        kana: "[ 첵쿠아우토와 난지 데스까? ]",
        meaning: "체크아웃은 몇 시입니까?",
      },
      {
        japanese: "荷物を預かってもらえますか?",
        kana: "[ 니모츠 오 아즈캇테모라에마스까? ]",
        meaning: "짐을 맡아줄 수 있습니까?",
      },
      {
        japanese: "部屋の鍵を失くしました。",
        kana: "[ 헤야노 카기 오 나쿠시마시타 ]",
        meaning: "방 열쇠를 잃어버렸습니다.",
      },
      {
        japanese: "タクシーを呼んでください。",
        kana: "[ 타쿠시 오 욘데쿠다사이 ]",
        meaning: "택시를 불러주세요.",
      },
      {
        japanese: "朝食は何時からですか?",
        kana: "[ 초쇼쿠와 난지카라 데스까? ]",
        meaning: "아침 식사는 몇 시부터입니까?",
      },
      {
        japanese: "ルームサービスをお願いします。",
        kana: "[ 루무사비스 오 오네가이시마스 ]",
        meaning: "룸서비스를 부탁합니다.",
      },
      {
        japanese: "近くにコンビニはありますか?",
        kana: "[ 치카쿠니 콤비니와 아리마스까? ]",
        meaning: "근처에 편의점이 있습니까?",
      },
      {
        japanese: "ホテルの住所は何ですか?",
        kana: "[ 호텔노 주소와 난데스까? ]",
        meaning: "호텔 주소는 무엇입니까?",
      },
    ],
    Shopping: [
      {
        japanese: "この服はいくらですか?",
        kana: "[ 코노 후쿠와 이쿠라 데스까? ]",
        meaning: "이 옷은 얼마입니까?",
      },
      {
        japanese: "試着してもいいですか?",
        kana: "[ 시착시테모 이이 데스까? ]",
        meaning: "입어봐도 되나요?",
      },
      {
        japanese: "他の色はありますか?",
        kana: "[ 호카노 이로와 아리마스까? ]",
        meaning: "다른 색상은 있습니까?",
      },
      {
        japanese: "サイズはありますか?",
        kana: "[ 사이즈와 아리마스까? ]",
        meaning: "사이즈는 있습니까?",
      },
      {
        japanese: "安くなりますか?",
        kana: "[ 야스쿠나리마스까? ]",
        meaning: "싸게 해줄 수 있나요?",
      },
      {
        japanese: "これをください。",
        kana: "[ 코레 오 쿠다사이 ]",
        meaning: "이것을 주세요.",
      },
      {
        japanese: "返品できますか?",
        kana: "[ 헨핀 데키마스까? ]",
        meaning: "환불 가능한가요?",
      },
      {
        japanese: "支払いは現金ですか?",
        kana: "[ 시하라이와 겐킨 데스까? ]",
        meaning: "지불은 현금인가요?",
      },
      {
        japanese: "この商品はありますか?",
        kana: "[ 코노 쇼힌와 아리마스까? ]",
        meaning: "이 상품은 있습니까?",
      },
      {
        japanese: "ポイントカードは使えますか?",
        kana: "[ 포인트 카도와 츠카에마스까? ]",
        meaning: "포인트 카드는 사용 가능합니까?",
      },
    ],
  };

  // 복사하기
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("복사되었습니다: " + text);
    });
  };

  return (
    <div className={styles.example_main_container}>
      <div className={styles.top_title}>
        <HiMiniChatBubbleBottomCenterText className={styles.text_icon} />
        <div>상황별 예문</div>
      </div>

      <div className={styles.situation_container}>
        <div className={styles.situation_wrap}>
          <div className={styles.situation}>자기소개</div>
          <div className={styles.example_container}>
            {exampleTexts.Introduce.map((example, index) => (
              <div key={index} className={styles.text_container}>
                <pre className={styles.text_wrap}>
                  <div className={styles.jp_text}>
                    <FaRegCopy
                      className={styles.copy_icon}
                      onClick={() => handleCopy(example.japanese)}
                    />{" "}
                    {example.japanese}
                  </div>
                  <div className={styles.mean_text}>
                    {example.kana} {example.meaning}
                  </div>
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.situation_wrap}>
          <div className={styles.situation}>식당</div>
          <div className={styles.example_container}>
            {exampleTexts.Restaurant.map((example, index) => (
              <div key={index} className={styles.text_container}>
                <pre className={styles.text_wrap}>
                  <div className={styles.jp_text}>
                    <FaRegCopy
                      className={styles.copy_icon}
                      onClick={() => handleCopy(example.japanese)}
                    />{" "}
                    {example.japanese}
                  </div>
                  <div className={styles.mean_text}>
                    {example.kana} {example.meaning}
                  </div>
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.situation_wrap}>
          <div className={styles.situation}>여행</div>
          <div className={styles.example_container}>
            {exampleTexts.Travel.map((example, index) => (
              <div key={index} className={styles.text_container}>
                <pre className={styles.text_wrap}>
                  <div className={styles.jp_text}>
                    <FaRegCopy
                      className={styles.copy_icon}
                      onClick={() => handleCopy(example.japanese)}
                    />{" "}
                    {example.japanese}
                  </div>
                  <div className={styles.mean_text}>
                    {example.kana} {example.meaning}
                  </div>
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.situation_wrap}>
          <div className={styles.situation}>호텔</div>
          <div className={styles.example_container}>
            {exampleTexts.Hotel.map((example, index) => (
              <div key={index} className={styles.text_container}>
                <pre className={styles.text_wrap}>
                  <div className={styles.jp_text}>
                    <FaRegCopy
                      className={styles.copy_icon}
                      onClick={() => handleCopy(example.japanese)}
                    />{" "}
                    {example.japanese}
                  </div>
                  <div className={styles.mean_text}>
                    {example.kana} {example.meaning}
                  </div>
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.situation_wrap}>
          <div className={styles.situation}>쇼핑</div>
          <div className={styles.example_container}>
            {exampleTexts.Shopping.map((example, index) => (
              <div key={index} className={styles.text_container}>
                <pre className={styles.text_wrap}>
                  <div className={styles.jp_text}>
                    <FaRegCopy
                      className={styles.copy_icon}
                      onClick={() => handleCopy(example.japanese)}
                    />{" "}
                    {example.japanese}
                  </div>
                  <div className={styles.mean_text}>
                    {example.kana} {example.meaning}
                  </div>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SituationalExample;
