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

// -------- LEVEL 4 --------
const tapBtn4 = document.querySelector("#tapBtn");
const tapCountEl4 = document.querySelector("#tapCount");
const missCountEl4 = document.querySelector("#missCount");
const beatSuccessEl4 = document.querySelector("#beatSuccess");

const resultOverlay4 = document.querySelector("#resultOverlay");
const resultTitleEl4 = document.querySelector("#resultTitle");
const resultCountEl4 = document.querySelector("#resultCount");
const resultMessageEl4 = document.querySelector("#resultMessage");
const retryBtn4 = document.querySelector("#retryBtn");
const nextBtn4 = document.querySelector("#nextBtn");

let isBluePhase4 = false;
let beatHasClick4 = false;
let beatIndex4 = -1;
let totalTapCount4 = 0;
let missCount4 = 0;
let successBeats4 = 0;
let lastSuccess4 = false;

const TOTAL_BEATS_4 = 12;
const MIN_SUCCESS_BEATS_4 = 8;
const BEAT_INTERVAL_4 = 700;  // 0.7s
const BLUE_DURATION_4 = 200;  // 0.2s

const neutralColors4 = ["#f5f5f7", "#fff7ed", "#fefce8"];
const blueColor4 = "#2563eb";

function setBodyColor4(c) {
    document.body.style.background = c;
}
function randNeutral4() {
    return neutralColors4[Math.floor(Math.random() * neutralColors4.length)];
}
function updateUI4() {
    tapCountEl4.textContent = totalTapCount4.toString();
    missCountEl4.textContent = missCount4.toString();
    beatSuccessEl4.textContent = successBeats4.toString();
}

function startRound4() {
    beatIndex4 = -1;
    totalTapCount4 = 0;
    missCount4 = 0;
    successBeats4 = 0;
    lastSuccess4 = false;

    updateUI4();
    setBodyColor4(randNeutral4());

    setTimeout(nextBeat4, 1000);
}

function nextBeat4() {
    beatIndex4++;

    if (beatIndex4 >= TOTAL_BEATS_4) {
        finishRound4();
        return;
    }

    beatHasClick4 = false;
    isBluePhase4 = true;
    setBodyColor4(blueColor4);

    setTimeout(() => {
        isBluePhase4 = false;
        setBodyColor4(randNeutral4());

        if (beatHasClick4) {
            successBeats4++;
            updateUI4();
        }

        setTimeout(nextBeat4, BEAT_INTERVAL_4 - BLUE_DURATION_4);
    }, BLUE_DURATION_4);
}

tapBtn4.addEventListener("click", () => {
    if (isBluePhase4) {
        if (!beatHasClick4) beatHasClick4 = true;
        totalTapCount4++;
    } else {
        totalTapCount4++;
        missCount4++;
    }

    updateUI4();

    tapBtn4.style.transform = "scale(0.95)";
    setTimeout(() => (tapBtn4.style.transform = "scale(1)"), 80);
});

function finishRound4() {
    const success = successBeats4 >= MIN_SUCCESS_BEATS_4;
    lastSuccess4 = success;

    const successTaps = totalTapCount4 - missCount4;
    saveLevelResult(4, successTaps, missCount4);

    resultCountEl4.textContent = totalTapCount4.toString();

    if (success) {
        resultTitleEl4.textContent = "성공!";
        resultMessageEl4.textContent =
            `12개의 박자 중 ${successBeats4}개를 맞췄습니다.\n` +
            `성공 연타: ${successTaps}회, 미스: ${missCount4}회`;
    } else {
        resultTitleEl4.textContent = "실패...";
        resultMessageEl4.textContent =
            `박자 성공 ${successBeats4}개입니다.\n최소 ${MIN_SUCCESS_BEATS_4}개 이상 맞춰야 합니다.\n` +
            `성공 연타: ${successTaps}회, 미스: ${missCount4}회`;
    }

    nextBtn4.disabled = !success;
    resultOverlay4.classList.remove("hidden");
}

retryBtn4.addEventListener("click", () => {
    if (lastSuccess4) {
        const ok = window.confirm("정말 다시 하겠습니까?");
        if (!ok) return;
    }
    resultOverlay4.classList.add("hidden");
    startRound4();
});

nextBtn4.addEventListener("click", () => {
    if (nextBtn4.disabled) return;
    location.href = "level5.html";
});

startRound4();
