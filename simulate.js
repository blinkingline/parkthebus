// Park the Bus — 10,000-game simulation
// Human (Home) uses greedy strategy mirroring the AI

const DIE_SIDES = [4, 6, 8, 10, 10, 12, 20];
const D20 = 6;
const WIN_GOALS = 3;
const Z_IDS = ["-3", "-2", "-1", "1", "2", "3"];

const rollDie = s => Math.floor(Math.random() * s) + 1;
const makeDice = () => DIE_SIDES.map((s, i) => ({ id: i, sides: s, value: 0, restUntil: 0 }));
const isAvail = (d, pos) => pos > d.restUntil;
const useDie = (d, pos) => { d.restUntil = pos + 1; };

function getNextZone(curr, dir) {
    if (curr === 0) return dir === 1 ? "1" : "-1";
    const idx = Z_IDS.indexOf(curr.toString());
    const next = idx + dir;
    if (next < 0 || next >= Z_IDS.length) return null;
    return Z_IDS[next];
}

function simulateGame() {
    const state = {
        scores: { h: 0, v: 0 },
        turn: 0,
        hDice: makeDice(),
        vDice: makeDice(),
        possession: 1,
    };

    while (state.scores.h < WIN_GOALS && state.scores.v < WIN_GOALS) {
        const pos = state.possession;
        const wall = { "-3": 0, "-2": 0, "-1": 0, "1": 0, "2": 0, "3": 0 };

        // Re-roll dice returning from rest (restUntil === pos-1), skip unused (restUntil < pos-1)
        [state.hDice, state.vDice].forEach(dice =>
            dice.forEach(d => {
                if (d.restUntil === pos - 1) d.value = rollDie(d.sides);
            })
        );

        let scored = false;
        let turnover = false;

        if (state.turn === 0) {
            // Home attacks (human) — Visitor defends (AI sets wall)
            const d20v = state.vDice[D20];
            if (isAvail(d20v, pos)) { wall["3"] = d20v.value; useDie(d20v, pos); }

            const availV = state.vDice.filter(d => isAvail(d, pos)).sort((a, b) => b.value - a.value);
            if (availV[0]) { wall["2"] += availV[0].value; useDie(availV[0], pos); }
            if (availV[1]) { wall["2"] += availV[1].value; useDie(availV[1], pos); }
            if (availV[2]) { wall["1"]  = availV[2].value; useDie(availV[2], pos); }

            // Human attacks: greedy, up to 3 dice, must use at least 1
            let ballPos = 0;
            while (!scored && !turnover) {
                const target = getNextZone(ballPos, 1);
                if (!target) { turnover = true; break; }

                const wallVal = wall[target] || 0;
                const availH = state.hDice.filter(d => isAvail(d, pos)).sort((a, b) => b.value - a.value);
                if (availH.length === 0) { turnover = true; break; }

                let sum = 0, used = [];
                for (const d of availH) {
                    if (used.length >= 3) break;
                    sum += d.value; used.push(d);
                    if (sum > wallVal) break;
                }
                used.forEach(d => useDie(d, pos));

                if (sum > wallVal) {
                    ballPos = parseInt(target);
                    if (ballPos === 3) { state.scores.h++; scored = true; }
                } else {
                    turnover = true;
                }
            }

        } else {
            // Visitor attacks (AI) — Home defends (human mirrors AI strategy)
            const d20h = state.hDice[D20];
            if (isAvail(d20h, pos)) { wall["-3"] = d20h.value; useDie(d20h, pos); }

            const availH = state.hDice.filter(d => isAvail(d, pos)).sort((a, b) => b.value - a.value);
            if (availH[0]) { wall["-2"] += availH[0].value; useDie(availH[0], pos); }
            if (availH[1]) { wall["-2"] += availH[1].value; useDie(availH[1], pos); }
            if (availH[2]) { wall["-1"]  = availH[2].value; useDie(availH[2], pos); }

            // AI attacks: greedy, up to 3 dice
            let ballPos = 0;
            while (!scored && !turnover) {
                const target = getNextZone(ballPos, -1);
                if (!target) { turnover = true; break; }

                const wallVal = wall[target] || 0;
                const availV = state.vDice.filter(d => isAvail(d, pos)).sort((a, b) => b.value - a.value);
                if (availV.length === 0) { turnover = true; break; }

                let sum = 0, used = [];
                for (const d of availV) {
                    if (used.length >= 3) break;
                    sum += d.value; used.push(d);
                    if (sum > wallVal) break;
                }
                used.forEach(d => useDie(d, pos));

                if (sum > wallVal) {
                    ballPos = parseInt(target);
                    if (ballPos === -3) { state.scores.v++; scored = true; }
                } else {
                    turnover = true;
                }
            }
        }

        if (state.scores.h >= WIN_GOALS || state.scores.v >= WIN_GOALS) break;
        state.possession++;
        state.turn = 1 - state.turn;
    }

    return { possessions: state.possession, h: state.scores.h, v: state.scores.v };
}

const N = 10000;
let totalPoss = 0, homeWins = 0, visitorWins = 0;
const possHist = {};

for (let i = 0; i < N; i++) {
    const r = simulateGame();
    totalPoss += r.possessions;
    if (r.h > r.v) homeWins++;
    else visitorWins++;
    possHist[r.possessions] = (possHist[r.possessions] || 0) + 1;
}

const avg = totalPoss / N;
const sorted = Object.keys(possHist).map(Number).sort((a, b) => a - b);
let cumul = 0, p50, p95;
for (const k of sorted) {
    cumul += possHist[k];
    if (!p50 && cumul >= N * 0.5) p50 = k;
    if (!p95 && cumul >= N * 0.95) p95 = k;
}

console.log(`\n=== Park the Bus — ${N.toLocaleString()} game simulation ===`);
console.log(`Average possessions per game : ${avg.toFixed(2)}`);
console.log(`Median possessions           : ${p50}`);
console.log(`95th-percentile possessions  : ${p95}`);
console.log(`Min / Max                    : ${sorted[0]} / ${sorted[sorted.length - 1]}`);
console.log(`\nHome (human) wins  : ${homeWins.toLocaleString()} (${(homeWins/N*100).toFixed(1)}%)`);
console.log(`Visitor (AI) wins  : ${visitorWins.toLocaleString()} (${(visitorWins/N*100).toFixed(1)}%)`);
