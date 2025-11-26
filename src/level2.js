// 공통
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

// -------- LEVEL 2 --------
const tapBtn2 = document.querySelector("#tapBtn");
const tapCountEl2 = document.querySelector("#tapCount");
const missCountEl2 = document.querySelector("#missCount");
const statusTextEl2 = document.querySelector("#statusText");

const resultOverlay2 = document.querySelector("#resultOverlay");
const resultTitleEl2 = document.querySelector("#resultTitle");
const resultCountEl2 = document.querySelector("#resultCount");
const resultMessageEl2 = document.querySelector("#resultMessage");
const retryBtn2 = document.querySelector("#retryBtn");
const nextBtn2 = document.querySelector("#nextBtn");

let isBluePhase2 = false;
let tapCount2 = 0;
let missCount2 = 0;
let phaseIndex2 = 0;
let timerId2 = null;
let lastSuccess2 = false;

const neutralColors2 = ["#f5f5f7", "#fff7ed", "#fefce8"];
const blueColor2 = "#2563eb";
const TOTAL_PHASES_2 = 2;
const BLUE_DURATION_2 = 800;
const GAP_DURATION_2 = 600;
const SUCCESS_THRESHOLD_2 = 10;

function setBodyColor2(color) {
    document.body.style.background = color;
}
function randNeutral2() {
    return neutralColors2[Math.floor(Math.random() * neutralColors2.length)];
}
function updateCounts2() {
    tapCountEl2.textContent = tapCount2.toString();
    missCountEl2.textContent = missCount2.toString();
}
function setStatus2(text) {
    statusTextEl2.textContent = text;
}

function startRound2() {
    clearTimeout(timerId2);

    tapCount2 = 0;
    missCount2 = 0;
    phaseIndex2 = 0;
    isBluePhase2 = false;
    lastSuccess2 = false;

    updateCounts2();
    setBodyColor2(randNeutral2());
    setStatus2("첫 번째 파란색을 기다리는 중...");

    const delay = Math.floor(Math.random() * 1500) + 1000; // 1~2.5초
    timerId2 = setTimeout(startBluePhase2, delay);
}

function startBluePhase2() {
    isBluePhase2 = true;
    setBodyColor2(blueColor2);

    const current = phaseIndex2 + 1;
    setStatus2(`${current}번째 파란색! 연타하세요!`);

    timerId2 = setTimeout(endBluePhase2, BLUE_DURATION_2);
}

function endBluePhase2() {
    isBluePhase2 = false;
    setBodyColor2(randNeutral2());

    phaseIndex2++;

    if (phaseIndex2 < TOTAL_PHASES_2) {
        setStatus2("두 번째 파란색을 준비 중...");
        timerId2 = setTimeout(startBluePhase2, GAP_DURATION_2);
    } else {
        setStatus2("라운드 종료");
        showResult2();
    }
}

tapBtn2.addEventListener("click", () => {
    if (isBluePhase2) {
        tapCount2++;
    } else {
        missCount2++;
    }
    updateCounts2();

    tapBtn2.style.transform = "scale(0.96)";
    setTimeout(() => (tapBtn2.style.transform = "scale(1)"), 70);
});

function showResult2() {
    const success = tapCount2 >= SUCCESS_THRESHOLD_2;
    lastSuccess2 = success;

    saveLevelResult(2, tapCount2, missCount2);

    resultCountEl2.textContent = `${tapCount2}회`;
    if (success) {
        resultTitleEl2.textContent = "성공!";
        resultMessageEl2.textContent =
            `두 번의 파란 구간에서 성공 연타 ${tapCount2}회를 기록했습니다.\n` +
            `최소 ${SUCCESS_THRESHOLD_2}회 이상 연타하면 클리어입니다.`;
    } else {
        resultTitleEl2.textContent = "실패...";
        resultMessageEl2.textContent =
            `성공 연타 ${tapCount2}회입니다.\n두 구간 합산 최소 ${SUCCESS_THRESHOLD_2}회 이상 필요합니다.`;
    }

    nextBtn2.disabled = !success;
    resultOverlay2.classList.remove("hidden");
}

retryBtn2.addEventListener("click", () => {
    if (lastSuccess2) {
        const ok = window.confirm("정말 다시 하겠습니까?");
        if (!ok) return;
    }
    resultOverlay2.classList.add("hidden");
    startRound2();
});

nextBtn2.addEventListener("click", () => {
    if (nextBtn2.disabled) return;
    location.href = "level3.html";
});

startRound2();
