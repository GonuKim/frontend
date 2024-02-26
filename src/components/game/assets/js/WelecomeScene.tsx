import Phaser from "phaser";
import background from "../img/forest2.png";
import startButton from "../img/startButton.png";
import mainBgm from "../music/Adventure2.wav";

export default class WelecomeScene extends Phaser.Scene {
  constructor() {
    super("welcome-scene");
  }

  preload() {
    this.load.image("forest", background);
    this.load.image("startButton", startButton);
    this.load.audio("mainBgm", mainBgm);
  }

  create() {
    //화면 중앙
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // 화면 크기에 맞추어 이미지 스케일 조정
    const bg = this.add.image(0, 0, "forest");
    bg.setOrigin(0, 0);
    bg.setScale(1);

    // 텍스트 추가
    this.add
      .text(centerX, centerY, "모험을 떠나시겠습니까?", {
        fontFamily: "DOSIyagiMedium", // CSS에서 로드한 폰트 이름을 여기에 적용
        fontSize: "40px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    //start 버튼 추가
    const button = this.add
      .image(centerX, centerY + 70, "startButton")
      .setInteractive();
    button.setScale(1.5);

    button.on("pointerdown", () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("stage-scene");
      });
    });

    button.on("pointerover", () => button.setScale(1.3));
    button.on("pointerout", () => button.setScale(1.5));

    const music = this.sound.add("mainBgm", {
      volume: 0.5,
      loop: true,
    });
    music.play();
  }

  update() {}
}
