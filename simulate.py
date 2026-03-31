import random
from collections import Counter

DIE_SIDES = [4, 6, 8, 10, 10, 12, 20]
D20 = 6
WIN_GOALS = 3
Z_IDS = ["-3", "-2", "-1", "1", "2", "3"]

def roll(s): return random.randint(1, s)
def make_dice(): return [{"id": i, "sides": s, "value": 0, "rest_until": 0} for i, s in enumerate(DIE_SIDES)]
def is_avail(d, pos): return pos > d["rest_until"]
def use_die(d, pos): d["rest_until"] = pos + 1

def get_next_zone(curr, dir_):
    if curr == 0: return "1" if dir_ == 1 else "-1"
    idx = Z_IDS.index(str(curr))
    nxt = idx + dir_
    if nxt < 0 or nxt >= len(Z_IDS): return None
    return Z_IDS[nxt]

def simulate_game():
    h_dice = make_dice()
    v_dice = make_dice()
    scores = {"h": 0, "v": 0}
    turn = 0
    possession = 1
    ball_pos = 0  # persists across possessions now

    while scores["h"] < WIN_GOALS and scores["v"] < WIN_GOALS:
        pos = possession
        wall = {z: 0 for z in Z_IDS}

        # Re-roll dice returning from rest
        for dice in (h_dice, v_dice):
            for d in dice:
                if d["rest_until"] == pos - 1:
                    d["value"] = roll(d["sides"])

        scored = False
        turnover = False

        if turn == 0:
            # Home (human) attacks — Visitor (AI) defends
            # AI only defends zones attacker still needs to breach
            d20v = v_dice[D20]
            if is_avail(d20v, pos): wall["3"] = d20v["value"]; use_die(d20v, pos)

            avail_v = sorted([d for d in v_dice if is_avail(d, pos)], key=lambda d: -d["value"])
            i = 0
            if ball_pos < 2:  # zone 2 not yet bypassed
                if len(avail_v) > i: wall["2"] += avail_v[i]["value"]; use_die(avail_v[i], pos); i += 1
                if len(avail_v) > i: wall["2"] += avail_v[i]["value"]; use_die(avail_v[i], pos); i += 1
            if ball_pos < 1:  # zone 1 not yet bypassed
                if len(avail_v) > i: wall["1"] = avail_v[i]["value"]; use_die(avail_v[i], pos); i += 1

            # Human attacks greedily from current ball_pos
            bp = ball_pos
            while not scored and not turnover:
                target = get_next_zone(bp, 1)
                if target is None: turnover = True; break
                wall_val = wall[target]
                avail_h = sorted([d for d in h_dice if is_avail(d, pos)], key=lambda d: -d["value"])
                if not avail_h: turnover = True; break
                total, used = 0, []
                for d in avail_h:
                    if len(used) >= 3: break
                    total += d["value"]; used.append(d)
                    if total > wall_val: break
                for d in used: use_die(d, pos)
                if total > wall_val:
                    bp = int(target)
                    if bp == 3: scores["h"] += 1; scored = True
                else:
                    turnover = True

            ball_pos = 0 if scored else bp

        else:
            # Visitor (AI) attacks — Home (human) defends
            # Human mirrors AI: only defend negative zones not yet bypassed
            d20h = h_dice[D20]
            if is_avail(d20h, pos): wall["-3"] = d20h["value"]; use_die(d20h, pos)

            avail_h = sorted([d for d in h_dice if is_avail(d, pos)], key=lambda d: -d["value"])
            i = 0
            if ball_pos >= -1:  # zone -2 not yet bypassed
                if len(avail_h) > i: wall["-2"] += avail_h[i]["value"]; use_die(avail_h[i], pos); i += 1
                if len(avail_h) > i: wall["-2"] += avail_h[i]["value"]; use_die(avail_h[i], pos); i += 1
            if ball_pos >= 0:  # zone -1 not yet bypassed
                if len(avail_h) > i: wall["-1"] = avail_h[i]["value"]; use_die(avail_h[i], pos); i += 1

            # AI (visitor) attacks greedily from current ball_pos
            bp = ball_pos
            while not scored and not turnover:
                target = get_next_zone(bp, -1)
                if target is None: turnover = True; break
                wall_val = wall[target]
                avail_v = sorted([d for d in v_dice if is_avail(d, pos)], key=lambda d: -d["value"])
                if not avail_v: turnover = True; break
                total, used = 0, []
                for d in avail_v:
                    if len(used) >= 3: break
                    total += d["value"]; used.append(d)
                    if total > wall_val: break
                for d in used: use_die(d, pos)
                if total > wall_val:
                    bp = int(target)
                    if bp == -3: scores["v"] += 1; scored = True
                else:
                    turnover = True

            ball_pos = 0 if scored else bp

        if scores["h"] >= WIN_GOALS or scores["v"] >= WIN_GOALS:
            break
        possession += 1
        turn = 1 - turn

    return possession, scores["h"], scores["v"]


random.seed(42)
N = 10_000
results = [simulate_game() for _ in range(N)]
poss_list = [r[0] for r in results]
poss_list_sorted = sorted(poss_list)

home_wins   = sum(1 for _, h, v in results if h > v)
visitor_wins = sum(1 for _, h, v in results if v > h)
score_counts = Counter((h, v) for _, h, v in results)

avg = sum(poss_list) / N
p50 = poss_list_sorted[N // 2]
p90 = poss_list_sorted[int(N * 0.90)]
p95 = poss_list_sorted[int(N * 0.95)]
p99 = poss_list_sorted[int(N * 0.99)]

print(f"\n=== 10,000 games · ball stays on turnover ===")
print(f"Avg possessions : {avg:.1f}")
print(f"Median          : {p50}")
print(f"P90 / P95 / P99 : {p90} / {p95} / {p99}")
print(f"Min / Max       : {poss_list_sorted[0]} / {poss_list_sorted[-1]}")
print(f"\nHome wins    : {home_wins:,} ({home_wins/N*100:.1f}%)")
print(f"Visitor wins : {visitor_wins:,} ({visitor_wins/N*100:.1f}%)")
print(f"\nScore breakdown:")
for score, cnt in sorted(score_counts.items(), key=lambda x: -x[1])[:15]:
    bar = '█' * (cnt // 60)
    print(f"  {score[0]}-{score[1]} : {cnt:>5} ({cnt/N*100:.1f}%)  {bar}")
