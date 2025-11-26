// 시작 화면 전용 스크립트

const startBtn = document.querySelector("#startBtn");

// 레벨들이랑 맞추기: 연한 중립색 + 파란색
const neutralColors = ["#f5f5f7", "#fff7ed", "#fefce8"];
const blueColor = "#2563eb";

let isBluePhase = false;
let timerId = null;

function setBackground(color) {
    // 🔹 body 전체 배경을 바꿈 (gradient까지 덮어쓰게)
    document.body.style.background = color;
}

function randomNeutral() {
    return neutralColors[Math.floor(Math.random() * neutralColors.length)];
}

// 파란색 나올 때까지 대기
function waitForBlue() {
    isBluePhase = false;
    startBtn.disabled = true;
    setBackground(randomNeutral());

    // 0.2초 ~ 1초 사이 랜덤 (너무 느리지 않게)
    const delay = 200 + Math.random() * 800;
    timerId = setTimeout(startBluePhase, delay);
}

function startBluePhase() {
    isBluePhase = true;
    setBackground(blueColor);
    startBtn.disabled = false;
}

startBtn.addEventListener("click", () => {
    // 파란색 아닐 때 누르면: 실수로 눌렀다고 보고 다시 대기
    if (!isBluePhase) {
        startBtn.disabled = true;
        clearTimeout(timerId);
        waitForBlue();
        return;
    }

    // 🔵 파란색일 때만 실제 게임 시작
    location.href = "level1.html";
});

// 첫 진입 시 바로 타이밍 대기 시작
waitForBlue();
