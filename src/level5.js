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

// -------- LEVEL 5 --------
const tapBtn5 = document.querySelector("#tapBtn");
const tapCountEl5 = document.querySelector("#tapCount");
const missCountEl5 = document.querySelector("#missCount");
const hitPhasesEl5 = document.querySelector("#hitPhases");

const resultOverlay5 = document.querySelector("#resultOverlay");
const resultTitleEl5 = document.querySelector("#resultTitle");
const resultCountEl5 = document.querySelector("#resultCount");
const resultMessageEl5 = document.querySelector("#resultMessage");
const retryBtn5 = document.querySelector("#retryBtn");
const homeBtn5 = document.querySelector("#homeBtn");

let isBluePhase5 = false;
let currentPhaseIndex5 = -1;
let phaseTapCounts5 = [];
let totalTapCount5 = 0;
let missCount5 = 0;
let hitPhases5 = 0;
let timerId5 = null;
let lastSuccess5 = false;

// 점점 짧아지는 파란 구간
const PHASE_DURATIONS_5 = [
    200, 180, 170, 150, 140, 130, 120, 110, 100, 90, 80, 80, 70, 60, 60,
];
const TOTAL_PHASES_5 = PHASE_DURATIONS_5.length;
const GAP_DURATION_5 = 120;
const MIN_HIT_PHASES_5 = 10;

const neutralColors5 = ["#f5f5f7", "#fff7ed", "#fefce8"];
const blueColor5 = "#2563eb";

function setBodyColor5(c) {
    document.body.style.background = c;
}
function randNeutral5() {
    return neutralColors5[Math.floor(Math.random() * neutralColors5.length)];
}
function updateInfo5() {
    tapCountEl5.textContent = totalTapCount5.toString();
    missCountEl5.textContent = missCount5.toString();
    hitPhasesEl5.textContent = hitPhases5.toString();
}

// 라운드 시작
function startRound5() {
    clearTimeout(timerId5);

    isBluePhase5 = false;
    currentPhaseIndex5 = -1;
    phaseTapCounts5 = Array(TOTAL_PHASES_5).fill(0);
    totalTapCount5 = 0;
    missCount5 = 0;
    hitPhases5 = 0;
    lastSuccess5 = false;

    updateInfo5();
    setBodyColor5(randNeutral5());

    // 1초 후 폭주 시작
    timerId5 = setTimeout(startNextPhase5, 1000);
}

function startNextPhase5() {
    currentPhaseIndex5++;

    if (currentPhaseIndex5 >= TOTAL_PHASES_5) {
        finishRound5();
        return;
    }

    isBluePhase5 = true;
    setBodyColor5(blueColor5);

    const duration = PHASE_DURATIONS_5[currentPhaseIndex5];
    timerId5 = setTimeout(endCurrentPhase5, duration);
}

function endCurrentPhase5() {
    isBluePhase5 = false;
    setBodyColor5(randNeutral5());

    if (phaseTapCounts5[currentPhaseIndex5] > 0) {
        hitPhases5++;
        updateInfo5();
    }

    if (currentPhaseIndex5 < TOTAL_PHASES_5 - 1) {
        timerId5 = setTimeout(startNextPhase5, GAP_DURATION_5);
    } else {
        timerId5 = setTimeout(finishRound5, 200);
    }
}

tapBtn5.addEventListener("click", () => {
    if (isBluePhase5) {
        totalTapCount5++;
        if (
            currentPhaseIndex5 >= 0 &&
            currentPhaseIndex5 < TOTAL_PHASES_5
        ) {
            phaseTapCounts5[currentPhaseIndex5]++;
        }
    } else {
        totalTapCount5++;
        missCount5++;
    }

    updateInfo5();

    tapBtn5.style.transform = "scale(0.94)";
    setTimeout(() => (tapBtn5.style.transform = "scale(1)"), 70);
});

function finishRound5() {
    const success = hitPhases5 >= MIN_HIT_PHASES_5;
    lastSuccess5 = success;

    const successTaps = phaseTapCounts5.reduce((sum, v) => sum + v, 0);
    saveLevelResult(5, successTaps, missCount5);

    resultCountEl5.textContent = totalTapCount5.toString();

    if (success) {
        resultTitleEl5.textContent = "클리어!";
        resultMessageEl5.textContent =
            `총 ${TOTAL_PHASES_5}개의 파란 구간 중 ${hitPhases5}개에 반응했습니다.\n` +
            `성공 연타: ${successTaps}회, 전체 클릭: ${totalTapCount5}회, 미스: ${missCount5}회`;
    } else {
        resultTitleEl5.textContent = "실패...";
        resultMessageEl5.textContent =
            `${TOTAL_PHASES_5}개 구간 중 ${hitPhases5}개만 성공했습니다.\n` +
            `최소 ${MIN_HIT_PHASES_5}개 이상 성공해야 클리어예요.\n` +
            `성공 연타: ${successTaps}회, 전체 클릭: ${totalTapCount5}회, 미스: ${missCount5}회`;
    }

    resultOverlay5.classList.remove("hidden");
}

retryBtn5.addEventListener("click", () => {
    if (lastSuccess5) {
        const ok = window.confirm("정말 다시 하겠습니까?");
        if (!ok) return;
    }
    resultOverlay5.classList.add("hidden");
    startRound5();
});

homeBtn5.addEventListener("click", () => {
    location.href = "ending.html";
});

startRound5();
