const RESULT_STORAGE_KEY = "timingMaster_levelResults";

const overallAccuracyEl = document.querySelector("#overallAccuracy");
const overallSuccessEl = document.querySelector("#overallSuccess");
const overallMissEl = document.querySelector("#overallMiss");
const resultTableBody = document.querySelector("#resultTableBody");
const restartBtn = document.querySelector("#restartBtn");
const retryLastBtn = document.querySelector("#retryLastBtn");

function loadResults() {
    try {
        const raw = localStorage.getItem(RESULT_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

function formatDate(isoString) {
    if (!isoString) return "-";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "-";
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const h = d.getHours();
    const min = d.getMinutes().toString().padStart(2, "0");
    return `${m}/${day} ${h}:${min}`;
}

function renderEnding() {
    const data = loadResults();
    const levels = [1, 2, 3, 4, 5];

    let totalSuccess = 0;
    let totalMiss = 0;
    let bestLevel = null;

    resultTableBody.innerHTML = "";

    levels.forEach((lv) => {
        const row = document.createElement("tr");
        const info = data[lv];

        let accText = "-";
        let succText = "-";
        let missText = "-";
        let timeText = "-";
        let accValue = null;

        if (info) {
            accValue =
                typeof info.accuracy === "number" ? info.accuracy : null;
            const success = info.successTaps ?? 0;
            const miss = info.missCount ?? 0;

            accText = accValue !== null ? `${accValue}%` : "-";
            succText = `${success}`;
            missText = `${miss}`;
            timeText = formatDate(info.time);

            totalSuccess += success;
            totalMiss += miss;

            if (accValue !== null) {
                if (!bestLevel || accValue > bestLevel.accuracy) {
                    bestLevel = { level: lv, accuracy: accValue };
                }
            }
        }

        row.innerHTML = `
      <td>Level ${lv}</td>
      <td>${accText}</td>
      <td>${succText}</td>
      <td>${missText}</td>
      <td>${timeText}</td>
    `;
        row.dataset.level = lv;
        resultTableBody.appendChild(row);
    });

    if (totalSuccess + totalMiss === 0) {
        overallAccuracyEl.textContent = "-";
        overallSuccessEl.textContent = "-";
        overallMissEl.textContent = "-";
    } else {
        const overallAcc = Math.round(
            (totalSuccess / (totalSuccess + totalMiss)) * 100
        );
        overallAccuracyEl.textContent = `${overallAcc}%`;
        overallSuccessEl.textContent = `${totalSuccess}회`;
        overallMissEl.textContent = `${totalMiss}회`;
    }

    if (bestLevel) {
        const rows = resultTableBody.querySelectorAll("tr");
        rows.forEach((tr) => {
            if (Number(tr.dataset.level) === bestLevel.level) {
                tr.classList.add("best-level");
            }
        });
    }
}

restartBtn.addEventListener("click", () => {
    location.href = "index.html";
});

retryLastBtn.addEventListener("click", () => {
    location.href = "level5.html";
});

renderEnding();
ㅓ