// 공통: 결과 저장
const RESULT_STORAGE_KEY = "timingMaster_levelResults";

function saveLevelResult(levelNumber, successTaps, missCount) {
    let data = {};
    try {
        const raw = localStorage.getItem(RESULT_STORAGE_KEY);
        if (raw) data = JSON.parse(raw) || {};
    } catch {
        data = {};
    }

    const total = successTaps + missCount;
    const accuracy = total > 0 ? Math.round((successTaps / total) * 100) : 0;

    data[levelNumber] = {
        level: levelNumber,
        successTaps,
        missCount,
        accuracy,
        time: new Date().toISOString(),
    };

    localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(data));
}

// -------- LEVEL 1 --------
const tapBtn = document.querySelector("#tapBtn");
const tapCountEl = document.querySelector("#tapCount");
const missCountEl = document.querySelector("#missCount");
const statusTextEl = document.querySelector("#statusText");

const resultOverlay = document.querySelector("#resultOverlay");
const resultTitleEl = document.querySelector("#resultTitle");
const resultCountEl = document.querySelector("#resultCount");
const resultMessageEl = document.querySelector("#resultMessage");
const retryBtn = document.querySelector("#retryBtn");
const nextBtn = document.querySelector("#nextBtn");

let isBluePhase = false;
let tapCount = 0;
let missCount = 0;
let preDelayTimeoutId = null;
let blueTimeoutId = null;
let lastSuccess = false;

const neutralColors1 = ["#f5f5f7", "#fff7ed", "#fefce8"];
const blueColor1 = "#2563eb";
const SUCCESS_THRESHOLD_1 = 7;

function setBodyColor1(color) {
    document.body.style.background = color;
}

function getRandomNeutral1() {
    return neutralColors1[Math.floor(Math.random() * neutralColors1.length)];
}

function updateCounts1() {
    tapCountEl.textContent = tapCount.toString();
    missCountEl.textContent = missCount.toString();
}

function setStatus1(text) {
    statusTextEl.textContent = text;
}

function startRound1() {
    clearTimeout(preDelayTimeoutId);
    clearTimeout(blueTimeoutId);

    tapCount = 0;
    missCount = 0;
    isBluePhase = false;
    lastSuccess = false;

    updateCounts1();
    setBodyColor1(getRandomNeutral1());
    setStatus1("파란색을 기다리는 중...");

    const delay = Math.floor(Math.random() * 2000) + 1000; // 1~3초
    preDelayTimeoutId = setTimeout(startBluePhase1, delay);
}

function startBluePhase1() {
    isBluePhase = true;
    setBodyColor1(blueColor1);
    setStatus1("지금이다! 1초 동안 연타하세요!");

    blueTimeoutId = setTimeout(endBluePhase1, 1000);
}

function endBluePhase1() {
    isBluePhase = false;
    setBodyColor1(getRandomNeutral1());
    setStatus1("라운드 종료");
    showResult1();
}

tapBtn.addEventListener("click", () => {
    if (isBluePhase) {
        tapCount++;
    } else {
        missCount++;
    }
    updateCounts1();

    tapBtn.style.transform = "scale(0.96)";
    setTimeout(() => (tapBtn.style.transform = "scale(1)"), 70);
});

function showResult1() {
    const success = tapCount >= SUCCESS_THRESHOLD_1;
    lastSuccess = success;

    saveLevelResult(1, tapCount, missCount);

    resultCountEl.textContent = `${tapCount}회`;

    if (success) {
        resultTitleEl.textContent = "성공!";
        resultMessageEl.textContent =
            `1초 동안 ${tapCount}회 연타했습니다.\n(최소 ${SUCCESS_THRESHOLD_1}회 이상 필요)`;
    } else {
        resultTitleEl.textContent = "실패...";
        resultMessageEl.textContent =
            `1초 동안 ${tapCount}회 연타했습니다.\n최소 ${SUCCESS_THRESHOLD_1}회 이상 눌러야 합니다.`;
    }

    nextBtn.disabled = !success;
    resultOverlay.classList.remove("hidden");
}

retryBtn.addEventListener("click", () => {
    if (lastSuccess) {
        const ok = window.confirm("정말 다시 하겠습니까?");
        if (!ok) return;
    }
    resultOverlay.classList.add("hidden");
    startRound1();
});

nextBtn.addEventListener("click", () => {
    if (nextBtn.disabled) return;
    location.href = "level2.html";
});

startRound1();
