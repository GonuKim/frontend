import Phaser from "phaser";
import background from "../img/foggyStageBg2.png";
import foggyStageBgm from "../music/Adventure6.wav";
import wordLineImg from "../img/wordLine.png";
import meanBtnImg from "../img/meanButton.png";
import downFieldImg from "../img/downField2.png";
import gameOverBtn from "../img/gameOver.png";
import hpBlack from "../img/hpBlack.png";
import hpColor from "../img/hpColor.png";
import hpHeart from "../img/hpHeart.png";
import silverHpBlack from "../img/silverHpBlack.png";
import silverHpColor from "../img/silverHpColor.png";
import silverHpHeart from "../img/silverHpHeart.png";
import skull from "../img/skull.png";
import witchIdleImg from "../img/character/Blue_witch/B_witch_idle.png";
import witchRun from "../img/character/Blue_witch/B_witch_run.png";
import witchAtkImg from "../img/character/Blue_witch/B_witch_attack.png";
import witchCharge from "../img/character/Blue_witch/B_witch_charge.png";
import witchTakeDmg from "../img/character/Blue_witch/B_witch_take_damage.png";
import witchDeath from "../img/character/Blue_witch/B_witch_death.png";
import necromancerIdle from "../img/character/necromancer/necromancerIdle.png";
import necromancerTakeDmg from "../img/character/necromancer/necromancerTakeDmg.png";
import necormancerAtk from "../img/character/necromancer/necromancerAtk.png";
import necromancerDeath from "../img/character/necromancer/necromancerDeath.png";

interface WordData {
  word: string;
  mean: string;
}

export default class FoggyStageScene extends Phaser.Scene {
  private wordData: WordData[] = [
    { word: "りんご", mean: "사과" },
    { word: "猫", mean: "고양이" },
    { word: "犬", mean: "개" },
    { word: "車", mean: "차" },
    { word: "時計", mean: "시계" },
    { word: "図書館", mean: "도서관" },
    { word: "自動販売機", mean: "자동판매기" },
    { word: "交通信号", mean: "교통 신호등" },
    { word: "地下鉄", mean: "지하철" },
    { word: "電子レンジ", mean: "전자레인지" },
    { word: "空気清浄機", mean: "공기청정기" },
    { word: "掃除機", mean: "청소기" },
    { word: "冷蔵庫", mean: "냉장고" },
    { word: "洗濯機", mean: "세탁기" },
    { word: "エアコン", mean: "에어컨" },
    { word: "コンピュータ", mean: "컴퓨터" },
    { word: "スマートフォン", mean: "스마트폰" },
    { word: "ヘッドフォン", mean: "헤드폰" },
    { word: "テレビ", mean: "텔레비전" },
    { word: "カメラ", mean: "카메라" },
    { word: "冷凍庫", mean: "냉동고" },
    { word: "電気ポット", mean: "전기 포트" },
    { word: "食器洗い機", mean: "식기세척기" },
    { word: "電気スタンド", mean: "전기 스탠드" },
    { word: "机", mean: "책상" },
    { word: "椅子", mean: "의자" },
    { word: "ベッド", mean: "침대" },
    { word: "窓", mean: "창문" },
    { word: "ドア", mean: "문" },
    { word: "本棚", mean: "책장" },
    { word: "ソファ", mean: "소파" },
    { word: "カーテン", mean: "커튼" },
    { word: "絨毯", mean: "카페트" },
    { word: "鏡", mean: "거울" },
    { word: "洗面台", mean: "세면대" },
  ];
  private questionTexts: Phaser.GameObjects.Text[] = []; // 문제와 선택지 텍스트 객체를 저장할 배열
  private choiceTexts: Phaser.GameObjects.Text[] = []; // 선택지 텍스트 객체를 저장할 배열
  private choices: string[] = [];
  private buttons: Phaser.GameObjects.Image[] = [];

  private bg1!: Phaser.GameObjects.Image;
  private bg2!: Phaser.GameObjects.Image;

  private isBackgroundMoving: boolean = false;

  private witch!: Phaser.GameObjects.Sprite;
  private witchHp: number = 100;
  private witchHpBar!: Phaser.GameObjects.Image;
  private maxWitchHp: number = 100;

  private necromancer!: Phaser.GameObjects.Sprite;
  private necromancerHp: number = 100;
  private necromancerHpBar!: Phaser.GameObjects.Image;
  private maxNecromancerHp: number = 100;

  private killScore: number = 0;
  private killScoreText!: Phaser.GameObjects.Text;

  constructor() {
    super("foggy-scene");
  }

  preload() {
    this.load.image("foggy_stage_bg", background);
    this.load.audio("foggyStageBgm", foggyStageBgm);
    this.load.image("meanBtn", meanBtnImg);
    this.load.image("downField", downFieldImg);
    this.load.image("wordLine", wordLineImg);
    this.load.image("gameOverBtn", gameOverBtn);
    this.load.image("hpBlack", hpBlack);
    this.load.image("hpColor", hpColor);
    this.load.image("hpHeart", hpHeart);
    this.load.image("silverHpBlack", silverHpBlack);
    this.load.image("silverHpColor", silverHpColor);
    this.load.image("silverHpHeart", silverHpHeart);
    this.load.image("skull", skull);
    this.load.spritesheet("witchIdle", witchIdleImg, {
      frameWidth: 135,
      frameHeight: 48,
    });
    this.load.spritesheet("witchRun", witchRun, {
      frameWidth: 135,
      frameHeight: 48,
    });
    this.load.spritesheet("witchAtk", witchAtkImg, {
      frameWidth: 135,
      frameHeight: 46,
    });
    this.load.spritesheet("witchCharge", witchCharge, {
      frameWidth: 135,
      frameHeight: 48,
    });
    this.load.spritesheet("witchTakeDmg", witchTakeDmg, {
      frameWidth: 135,
      frameHeight: 54,
    });
    this.load.spritesheet("witchDeath", witchDeath, {
      frameWidth: 135,
      frameHeight: 40,
    });
    this.load.spritesheet("necromancerIdle", necromancerIdle, {
      frameWidth: 160,
      frameHeight: 59,
    });
    this.load.spritesheet("necromancerTakeDmg", necromancerTakeDmg, {
      frameWidth: 156,
      frameHeight: 54,
    });
    this.load.spritesheet("necromancerAtk", necormancerAtk, {
      frameWidth: 159,
      frameHeight: 103,
    });
    this.load.spritesheet("necromancerDeath", necromancerDeath, {
      frameWidth: 159,
      frameHeight: 63,
    });
  }

  create() {
    this.questionTexts = []; // 문제와 선택지 텍스트 객체를 저장할 배열 초기화
    this.choiceTexts = []; // 선택지 텍스트 객체를 저장할 배열 초기화
    this.choices = []; // 선택지 문자열 배열 초기화
    this.buttons = []; // 버튼 객체 배열 초기화

    this.isBackgroundMoving = false; // 배경 움직임 상태 초기화

    this.witchHp = 100; // witch의 HP 초기화
    this.necromancerHp = 100; // necromancer의 HP 초기화
    this.killScore = 0; // 킬 점수 초기화

    const music = this.sound.add("foggyStageBgm", {
      volume: 0.5,
      loop: true,
    });
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    music.play();
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.bg1 = this.add.image(0, 0, "foggy_stage_bg").setOrigin(0, 0);
    this.bg2 = this.add
      .image(1680, 0, "foggy_stage_bg")
      .setOrigin(1, 0)
      .setScale(-1, 1);

    this.add.image(centerX, centerY + 120, "downField").setOrigin(0.5, 0.5);

    this.add.image(centerX, centerY + 60, "wordLine").setOrigin(0.5, 0.5);

    //WitchHp 이미지
    this.add.image(centerX - 490, centerY - 270, "hpHeart").setScale(1.3);
    this.add
      .image(centerX - 410, centerY - 270, "hpBlack")
      .setOrigin(0.5, 0.5)
      .setScale(1.7);
    this.witchHpBar = this.add
      .image(centerX - 410, centerY - 270, "hpColor")
      .setOrigin(0.5, 0.5)
      .setScale(1.7);

    // SilverHp 이미지
    this.add.image(centerX + 490, centerY - 270, "silverHpHeart").setScale(1.3);
    this.add
      .image(centerX + 410, centerY - 270, "silverHpBlack")
      .setOrigin(0.5, 0.5)
      .setScale(1.7);
    this.necromancerHpBar = this.add
      .image(centerX + 410, centerY - 270, "silverHpColor")
      .setOrigin(0.5, 0.5)
      .setScale(1.7);

    //skull, killScore
    this.add
      .image(centerX - 30, centerY - 270, "skull")
      .setOrigin(0.5, 0.5)
      .setScale(0.1);

    this.killScoreText = this.add
      .text(centerX, centerY - 270, "0", {
        font: "27px Noto Serif JP ",
        color: "white",
      })
      .setOrigin(0.5, 0.5);

    //문제 생성
    this.setupQuestion();

    //necromancer
    this.anims.create({
      key: "necromancerIdle", // 오타 수정: "necromancerIdle"로 변경
      frames: this.anims.generateFrameNumbers("necromancerIdle", {
        start: 0,
        end: 7,
      }),
      frameRate: 9,
      repeat: -1,
    });

    this.anims.create({
      key: "necromancerTakeDmg", // 오타 수정: "necromancerIdle"로 변경
      frames: this.anims.generateFrameNumbers("necromancerTakeDmg", {
        start: 0,
        end: 4,
      }),
      frameRate: 11,
      repeat: 0,
    });

    this.anims.create({
      key: "necromancerAtk", // 오타 수정: "necromancerIdle"로 변경
      frames: this.anims.generateFrameNumbers("necromancerAtk", {
        start: 0,
        end: 12,
      }),
      frameRate: 11,
      repeat: 0,
    });

    this.anims.create({
      key: "necromancerDeath", // 오타 수정: "necromancerIdle"로 변경
      frames: this.anims.generateFrameNumbers("necromancerDeath", {
        start: 0,
        end: 7,
      }),
      frameRate: 5,
      repeat: 0,
    });

    this.necromancer = this.add
      .sprite(centerX, centerY - 160, "necromancerIdle")
      .play("necromancerIdle");
    this.necromancer.setScale(-2, 2);

    //witch
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("witchIdle", {
        start: 0,
        end: 5,
      }), // 시작 프레임과 끝 프레임
      frameRate: 10,
      repeat: -1, // 무한 반복
    });

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("witchRun", {
        start: 0,
        end: 8,
      }), // 시작 프레임과 끝 프레임
      frameRate: 10,
      repeat: -1, // 무한 반복
    });

    this.anims.create({
      key: "charge",
      frames: this.anims.generateFrameNumbers("witchCharge", {
        start: 0,
        end: 3,
      }), // 시작 프레임과 끝 프레임
      frameRate: 6,
      repeat: 0, // 무한 반복
    });

    this.anims.create({
      key: "atk",
      frames: this.anims.generateFrameNumbers("witchAtk", {
        start: 0,
        end: 9,
      }),
      frameRate: 9,
      repeat: 0,
    });

    this.anims.create({
      key: "takeDmg",
      frames: this.anims.generateFrameNumbers("witchTakeDmg", {
        start: 0,
        end: 2,
      }),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "death",
      frames: this.anims.generateFrameNumbers("witchDeath", {
        start: 0,
        end: 12,
      }),
      frameRate: 5,
      repeat: 0,
    });

    // 화면 중앙에 witch 스프라이트 추가
    this.witch = this.add
      .sprite(centerX, centerY - 140, "witchIdle")
      .play("idle");
    this.witch.setScale(2.3);
  }

  updateKillScore() {
    this.killScore += 1; // 몬스터를 잡을 때마다 killScore 증가
    this.killScoreText.setText(`${this.killScore}`); // 텍스트 업데이트
  }

  updateHpBar() {
    if (this.witchHp < 0) this.witchHp = 0;
    if (this.necromancerHp < 0) this.necromancerHp = 0;
    //witch hp
    const hpRatio = this.witchHp / this.maxWitchHp; // 현재 HP 비율 계산
    const newWidth = this.witchHpBar.width * hpRatio; // 새로운 가시 영역의 너비 계산

    //necromancer hp
    const silverHpRatio = this.necromancerHp / this.maxNecromancerHp;
    const silverNewWidth = this.necromancerHpBar.width * silverHpRatio;

    // HP 바의 가시 영역을 현재 HP 비율에 맞게 조정
    this.witchHpBar.setCrop(0, 0, newWidth, this.witchHpBar.height);
    this.necromancerHpBar.setCrop(
      this.necromancerHpBar.width - silverNewWidth,
      0,
      silverNewWidth,
      this.necromancerHpBar.height
    );
  }

  setupQuestion() {
    // 이전에 생성된 텍스트 객체들 제거
    this.clearQuestionTexts();

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const randomWordObj =
      this.wordData[Math.floor(Math.random() * this.wordData.length)];
    // 문제 텍스트 생성 및 배열에 추가
    const questionText = this.add
      .text(centerX, centerY, randomWordObj.word, {
        font: "44px Noto Serif JP ",
        color: "#EAC397",
      })
      .setShadow(1, 1, "#FEF3B4", 8, false, true)
      .setOrigin(0.5, 0.2);
    this.questionTexts.push(questionText);

    this.choices = [randomWordObj.mean];
    while (this.choices.length < 4) {
      const choice =
        this.wordData[Math.floor(Math.random() * this.wordData.length)].mean;
      if (!this.choices.includes(choice)) {
        this.choices.push(choice);
      }
    }

    for (let i = this.choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]]; // ES6 구조 분해 할당을 사용하여 요소 스왑
    }

    // 선택지 버튼 생성
    this.buttons = [
      this.add
        .image(centerX - 100, centerY + 120, "meanBtn")
        .setOrigin(0.5, 0.5)
        .setInteractive(),
      this.add
        .image(centerX + 100, centerY + 120, "meanBtn")
        .setOrigin(0.5, 0.5)
        .setInteractive(),
      this.add
        .image(centerX - 100, centerY + 200, "meanBtn")
        .setOrigin(0.5, 0.5)
        .setInteractive(),
      this.add
        .image(centerX + 100, centerY + 200, "meanBtn")
        .setOrigin(0.5, 0.5)
        .setInteractive(),
    ];

    this.buttons.forEach((button) => {
      button
        .on("pointerover", () => {
          button.setScale(1.1); // 마우스 오버 시 버튼 크기를 10% 증가
        })
        .on("pointerout", () => {
          button.setScale(1); // 마우스 아웃 시 버튼 크기를 원래대로 복원
        });
    });

    this.choices.forEach((choice, index) => {
      const button = this.buttons[index]; // 이미 생성된 버튼 참조 사용
      const x = button.x;
      const y = button.y;
      // 선택지 텍스트 생성 및 배열에 추가
      const choiceText = this.add
        .text(x, y, choice, {
          font: "24px ",
          color: "#FAF6F6",
          backgroundColor: "rgba(20, 20, 20, 0)",
          padding: { x: 5, y: 5 },
        })
        .setShadow(1, 1, "#E0DDC4", 10, true, true)
        .setOrigin(0.5)
        .setInteractive();
      this.choiceTexts.push(choiceText);

      choiceText
        .on("pointerover", () => {
          button.setScale(1.1);
        })
        .on("pointerout", () => {
          button.setScale(1);
        });

      // 선택지 텍스트 클릭 이벤트 추가
      choiceText.on("pointerdown", () => {
        button.setScale(1);
        this.checkAnswer(choice, randomWordObj.mean);
      });
    });

    if (this.witchHp <= 0) {
      this.choiceTexts.forEach((text) => text.disableInteractive());
      const gameOverImage = this.add
        .image(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 - 100,
          "gameOverBtn"
        )
        .setInteractive();
      gameOverImage.on("pointerdown", () => {
        // 'welcomeScene'으로 장면 전환
        gameOverImage.destroy();
        this.witchHp = 100;
        this.choiceTexts.forEach((text) => text.setInteractive());
        setTimeout(() => {
          this.cameras.main.fadeOut(1000, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("welcome-scene");
          });
        }, 1000);
      });

      gameOverImage.on("pointerover", () => {
        gameOverImage.setScale(1.2);
      });
      gameOverImage.on("pointerout", () => gameOverImage.setScale(1));
    }
  }

  clearQuestionTexts() {
    // 배열에 저장된 모든 텍스트 객체를 제거
    this.questionTexts.forEach((text) => text.destroy());

    // 배열을 비움
    this.questionTexts = [];

    this.buttons.forEach((button) => button.destroy());
    this.buttons = []; // 버튼 배열을 비움
  }

  checkAnswer(choice: string, correctAnswer: string) {
    if (choice === correctAnswer) {
      console.log("정답!");
      this.necromancerHp -= 25;
      console.log(`necormancer HP: ${this.necromancerHp}`);
      this.witch.play("charge", true).once("animationcomplete-charge", () => {
        this.witch.play("atk").once("animationcomplete-atk", () => {
          this.necromancer
            .play("necromancerTakeDmg")
            .once("animationcomplete-necromancerTakeDmg", () => {
              this.updateHpBar();
              this.witch.play("idle");
              if (this.necromancerHp <= 0) {
                this.updateKillScore();
                this.choiceTexts.forEach((text) => text.disableInteractive());
                // HP 체크를 여기서 수행
                this.necromancer
                  .play("necromancerDeath")
                  .on("animationcomplete-necromancerDeath", () => {
                    // 애니메이션 완료 후 necromancer를 비활성화하거나 삭제
                    this.necromancer.setVisible(false); // 예시: necromancer를 화면에서 숨김
                    this.necromancerHp = 100;
                    this.necromancer.setX(this.cameras.main.width + 743); // 화면 밖으로 초기 위치 설정
                    this.necromancer.play("necromancerIdle");
                    this.necromancer.setVisible(true);
                    this.choiceTexts.forEach((text) =>
                      text.disableInteractive()
                    );
                    this.startBackgroundMovement();
                  });
              } else {
                this.necromancer.play("necromancerIdle");
              }
            });
        });
      });
    } else {
      console.log("오답!");
      this.witchHp -= 25;
      console.log(`Witch HP: ${this.witchHp}`);
      this.necromancer
        .play("necromancerAtk")
        .on("animationcomplete-necromancerAtk", () => {
          this.witch.play("takeDmg").on("animationcomplete-takeDmg", () => {
            this.updateHpBar();
            this.witch.play("idle");
            this.necromancer.play("necromancerIdle");
            if (this.witchHp <= 0) {
              this.choiceTexts.forEach((text) => text.disableInteractive());

              console.log("Witch defeated!");
              this.witch.play("death");
              // 화면을 페이드 아웃
              // 페이드 아웃이 완료된 후에 실행될 콜백
            }
          });
        });
    }

    this.choiceTexts.forEach((text) => text.disableInteractive());

    this.choiceTexts.forEach((choiceText) => {
      if (choiceText.text === correctAnswer) {
        // 정답인 선택지 스타일 변경
        choiceText.setColor("#4CAF50"); // 정답 표시
      } else {
        // 오답인 선택지 스타일 초기화
        choiceText.setBackgroundColor("transparent");
      }
      choiceText.disableInteractive(); // 선택 후 인터랙션 비활성화
    });

    this.time.delayedCall(
      1700,
      () => {
        // 다음 문제 설정 전에 모든 선택지의 스타일을 초기화
        this.choiceTexts.forEach((choiceText) => {
          // 선택지의 스타일을 초기 상태로 재설정, 예를 들어 배경색을 투명으로
          choiceText.setInteractive(); // 선택지를 다시 활성화
        });
        this.setupQuestion(); // 다음 문제 출제 함수 호출
      },
      [],
      this
    );
  }

  startBackgroundMovement() {
    this.isBackgroundMoving = true; // 배경 이동 시작
    this.witch.play("run"); // witch가 달리는 애니메이션 시작

    this.time.delayedCall(
      3000, // 3초 동안 배경 이동
      () => {
        this.isBackgroundMoving = false; // 3초 후 배경 이동 멈춤
        this.witch.play("idle"); // 배경 이동이 멈춘 후 witch가 idle 애니메이션으로 돌아감
        this.necromancer.setX(this.cameras.main.width / 2);
        this.choiceTexts.forEach((text) => text.setInteractive());
      },
      [],
      this
    );
  }

  update() {
    if (this.isBackgroundMoving) {
      this.updateHpBar();
      this.bg1.x -= 7;
      this.bg2.x -= 7;

      if (this.bg1.x <= -1680) {
        this.bg1.x = this.bg2.x + 1680;
      }

      if (this.bg2.x <= -1680) {
        this.bg2.x = this.bg1.x + 1680;
      }

      if (this.necromancer.x > -200) {
        // 네크로맨서의 초기 위치를 화면 오른쪽 바깥으로 설정
        this.necromancer.x -= 7; // 네크로맨서를 배경과 동일한 속도로 왼쪽으로 이동
      }
    }
  }
}
