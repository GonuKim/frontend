import styles from "../css/Main.module.css";
import Carousel from "../components/crarousel/index";
import Img1 from "../img/exam.jpg";
import Img2 from "../img/jlpt.jpg";
import Img3 from "../img/game.jpg";
import Img4 from "../img/crossword.jpg";
const Main = () => {
  return (
    <div>
      <div className={styles.carousel_wrap}>
        <h3 className={styles.top_text}>
          다양한 활동을 통하여 일본어를 늘려보세요!
        </h3>
        <Carousel />
      </div>

      <div className={styles.mid_wrap}>
        <h3 className={styles.top_text}>
          시험을 통하여 내 실력을 테스트 해보세요!
        </h3>
        <div className={styles.mid_img_wrap}>
          <div className={styles.mid_img_container}>
            <img src={Img1} alt="" />
            <p>맞춤문제 풀어보기</p>
          </div>
          <div className={styles.mid_img_container}>
            <img src={Img2} alt="" />
            <p>JLPT 기출문제 풀어보기</p>
          </div>
        </div>
      </div>

      <div className={styles.third_wrap}>
        <h3 className={styles.top_text}>
          게임을 통해 즐겁게 일본어를 공부해 보세요!
        </h3>
        <div className={styles.mid_img_wrap}>
          <div className={styles.mid_img_container}>
            <img src={Img3} alt="" />
            <p>GAME</p>
          </div>
          <div className={styles.mid_img_container}>
            <img src={Img4} alt="" />
            <p>CrossWord</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
