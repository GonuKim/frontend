import Phaser from "phaser";
import background from "../img/forest2.png";
import stageMenuImg from "../img/stageMenu.png";
import descriptionImg from "../img/description.png";
import foggyDescImg from "../img/foggyDesc.png";

export default class StageScene extends Phaser.Scene {
  constructor() {
    super("stage-scene");
  }

  preload() {
    this.load.image("forest", background);
    this.load.image("stageMenu", stageMenuImg);
    this.load.image("description", descriptionImg);
    this.load.image("foggyDescImg", foggyDescImg);
  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    //화면 중앙
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // 화면 크기에 맞추어 이미지 스케일 조정
    const image = this.add.image(0, 0, "forest");
    image.setOrigin(0, 0);
    image.setScale(1);

    // 이미지 크기 조정 후 위치 조정

    // 스테이지 메뉴
    const stageMenu = this.add
      .image(centerX, centerY, "stageMenu")
      .setScale(0.7);
    stageMenu.setOrigin(1.5, 0.6);

    const description = this.add.image(centerX, centerY, "description");
    description.setOrigin(0.24, 0.6);

    const stageWidth = 240; // 스테이지 선택 칸의 너비
    const stageHeight = 45; // 스테이지 선택 칸의 높이
    const stages = [
      { x: centerX - 260, y: centerY - 250 },
      { x: centerX - 260, y: centerY - 190 },
      { x: centerX - 260, y: centerY - 130 },
    ];

    const descImg = this.add
      .image(centerX + 140, centerY - 130, "foggyDescImg")
      .setVisible(false);
    // 스테이지 선택 칸에 대한 시각적 피드백 (예: 색상 변경)

    const descText = this.add
      .text(centerX, centerY, "", {
        fontFamily: "PFStardust", // CSS에서 로드한 폰트 이름을 여기에 적용
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.3, 0.1)
      .setVisible(false);

    stages.forEach((stage, index) => {
      // 투명한 사각형으로 가상의 버튼 생성
      const button = this.add
        .rectangle(stage.x, stage.y, stageWidth, stageHeight, 0x0000ff, 0)
        .setInteractive();

      // 마우스 오버 시
      button.on("pointerover", () => {
        button.setFillStyle(0xffffff, 0.5); // 투명도 50%의 흰색으로 변경

        if (index === 0) {
          descImg.setVisible(true);
          descText.setText(
            "안개낀 숲으로 자유롭게 연습할 수 있는 공간입니다. \n\n문제를 틀려도 HP가 감소하지 않습니다. \n\n자유롭게 연습해보세요!"
          );
          descText.setVisible(true);
        } else if (index === 1) {
          descText.setVisible(true);
          descText.setText(
            "서식지를 찾아가 고블린을 사냥하세요. \n\n고블린은 랜덤하게 등장할 것입니다."
          );
        }
      });

      // 마우스 아웃 시
      button.on("pointerout", () => {
        // 원래 상태로 복귀
        button.setFillStyle(0x0000ff, 0); // 다시 투명하게
        descImg.setVisible(false);
        descText.setVisible(false);
      });

      // 클릭 시
      button.on("pointerdown", () => {
        console.log(`스테이지 ${index + 1} 선택됨`);
        // 해당 스테이지 로딩 로직
        if (index === 0) {
          this.cameras.main.fadeOut(1000, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.sound.stopByKey("mainBgm");
            this.scene.start("foggy-scene");
          });
        }
      });
    });

    // 땅을 나타내는 스태틱 플랫폼 생성 (시각적으로 보이지 않게 설정)
    const ground = this.physics.add.staticGroup();
    // 땅의 위치와 크기를 정의합니다. 이 값은 게임의 실제 배경에 맞게 조정해야 합니다.
    // 여기서는 화면 하단에 투명한 사각형을 생성합니다.
    const groundPlatform = this.add.rectangle(
      centerX,
      this.cameras.main.height * 0.94,
      this.cameras.main.width,
      40,
      0x0000ff,
      0
    );
    // 스태틱 그룹에 사각형을 추가하여 물리 바디를 생성합니다.
    ground.add(groundPlatform);

    // 플레이어와 땅 사이의 충돌 처리
  }

  update() {}
}
