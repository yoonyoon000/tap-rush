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

// -------- LEVEL 3 --------
const tapBtn3 = document.querySelector("#tapBtn");
const tapCountEl3 = document.querySelector("#tapCount");
const missCountEl3 = document.querySelector("#missCount");
const statusTextEl3 = document.querySelector("#statusText");

const resultOverlay3 = document.querySelector("#resultOverlay");
const resultTitleEl3 = document.querySelector("#resultTitle");
const resultCountEl3 = document.querySelector("#resultCount");
const resultMessageEl3 = document.querySelector("#resultMessage");
const retryBtn3 = document.querySelector("#retryBtn");
const nextBtn3 = document.querySelector("#nextBtn");

let isBluePhase3 = false;
let totalTapCount3 = 0;
let missCount3 = 0;
let currentPhaseIndex3 = -1;
let phaseTapCounts3 = [];
let timerId3 = null;
let lastSuccess3 = false;

const neutralColors3 = ["#f5f5f7", "#fff7ed", "#fefce8"];
const blueColor3 = "#2563eb";

// 1.0 → 0.8 → 0.6 → 0.4초
const PHASE_DURATIONS_3 = [1000, 800, 600, 400];
const TOTAL_PHASES_3 = PHASE_DURATIONS_3.length;
const GAP_DURATION_3 = 400;
const MIN_TOTAL_TAPS_3 = 18;

function setBodyColor3(c) {
    document.body.style.background = c;
}
function randNeutral3() {
    return neutralColors3[Math.floor(Math.random() * neutralColors3.length)];
}
function updateCounts3() {
    tapCountEl3.textContent = totalTapCount3.toString();
    missCountEl3.textContent = missCount3.toString();
}
function setStatus3(text) {
    statusTextEl3.textContent = text;
}

function startRound3() {
    clearTimeout(timerId3);

    isBluePhase3 = false;
    totalTapCount3 = 0;
    missCount3 = 0;
    currentPhaseIndex3 = -1;
    phaseTapCounts3 = Array(TOTAL_PHASES_3).fill(0);
    lastSuccess3 = false;

    updateCounts3();
    setBodyColor3(randNeutral3());
    setStatus3(`첫 번째 파란색을 기다리는 중... (0 / ${TOTAL_PHASES_3})`);

    const delay = Math.floor(Math.random() * 1000) + 1000; // 1~2초
    timerId3 = setTimeout(startNextPhase3, delay);
}

function startNextPhase3() {
    currentPhaseIndex3++;

    if (currentPhaseIndex3 >= TOTAL_PHASES_3) {
        finishAllPhases3();
        return;
    }

    isBluePhase3 = true;
    setBodyColor3(blueColor3);

    const phaseNumber = currentPhaseIndex3 + 1;
    setStatus3(
        `${phaseNumber}번째 파란색! (짧아지는 중... ${phaseNumber} / ${TOTAL_PHASES_3})`
    );

    const duration = PHASE_DURATIONS_3[currentPhaseIndex3];
    timerId3 = setTimeout(endCurrentPhase3, duration);
}

function endCurrentPhase3() {
    isBluePhase3 = false;
    setBodyColor3(randNeutral3());

    const phaseNumber = currentPhaseIndex3 + 1;
    const pressedInThisPhase = phaseTapCounts3[currentPhaseIndex3] > 0;

    if (!pressedInThisPhase) {
        setStatus3(
            `${phaseNumber}번째 파란색을 한 번도 누르지 못했어요...`
        );
    } else {
        setStatus3(
            `${phaseNumber}번째 파란색은 성공! (${phaseNumber} / ${TOTAL_PHASES_3})`
        );
    }

    if (currentPhaseIndex3 < TOTAL_PHASES_3 - 1) {
        timerId3 = setTimeout(startNextPhase3, GAP_DURATION_3);
    } else {
        timerId3 = setTimeout(finishAllPhases3, 500);
    }
}

function finishAllPhases3() {
    setStatus3("라운드 종료");
    showResult3();
}

tapBtn3.addEventListener("click", () => {
    if (isBluePhase3) {
        totalTapCount3++;
        if (
            currentPhaseIndex3 >= 0 &&
            currentPhaseIndex3 < TOTAL_PHASES_3
        ) {
            phaseTapCounts3[currentPhaseIndex3]++;
        }
    } else {
        missCount3++;
    }
    updateCounts3();

    tapBtn3.style.transform = "scale(0.96)";
    setTimeout(() => (tapBtn3.style.transform = "scale(1)"), 70);
});

function showResult3() {
    const allHit = phaseTapCounts3.every((c) => c > 0);
    const enoughTaps = totalTapCount3 >= MIN_TOTAL_TAPS_3;
    const success = allHit && enoughTaps;
    lastSuccess3 = success;

    saveLevelResult(3, totalTapCount3, missCount3);

    resultCountEl3.textContent = `${totalTapCount3}회`;

    if (success) {
        resultTitleEl3.textContent = "성공!";
        resultMessageEl3.textContent =
            `모든 파란 구간을 최소 한 번씩 눌렀고,\n` +
            `총 성공 연타 ${totalTapCount3}회, 미스 ${missCount3}회를 기록했습니다.`;
    } else {
        let reason = "";
        if (!allHit && !enoughTaps) {
            reason =
                "어떤 파란 구간은 한 번도 누르지 못했고,\n성공 연타도 아직 부족합니다.";
        } else if (!allHit) {
            reason = "어떤 파란 구간은 한 번도 누르지 못했습니다.";
        } else if (!enoughTaps) {
            reason = `모든 구간을 누르긴 했지만,\n총 성공 연타가 아직 ${MIN_TOTAL_TAPS_3}회에 도달하지 못했습니다.`;
        }

        resultTitleEl3.textContent = "실패...";
        resultMessageEl3.textContent =
            `${reason}\n\n성공 연타 ${totalTapCount3}회, 미스 ${missCount3}회입니다.`;
    }

    nextBtn3.disabled = !success;
    resultOverlay3.classList.remove("hidden");
}

retryBtn3.addEventListener("click", () => {
    if (lastSuccess3) {
        const ok = window.confirm("정말 다시 하겠습니까?");
        if (!ok) return;
    }
    resultOverlay3.classList.add("hidden");
    startRound3();
});

nextBtn3.addEventListener("click", () => {
    if (nextBtn3.disabled) return;
    location.href = "level4.html";
});

startRound3();
