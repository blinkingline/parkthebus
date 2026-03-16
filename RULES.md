# Park the Bus — Rules

## Overview

Park the Bus is a two-player dice game played on a six-zone pitch. Each player controls a set of TTRPG dice. One player is **Home**, the other is **Visitor**. The first to score **3 goals** wins.

---

## The Pitch

The pitch has six zones, arranged left to right:

```
[ Goal (H) | Defense (H) | Midfield (H) | Midfield (V) | Defense (V) | Goal (V) ]
```

- Home attacks toward the right (Goal V). Visitor attacks toward the left (Goal H).
- The ball starts at center. Its position is tracked throughout the game.

---

## Dice

Each player has an identical set of seven dice:

| Die  | Shape    | Role              |
|------|----------|-------------------|
| d4   | Triangle | Attack / Defense  |
| d6   | Square   | Attack / Defense  |
| d8   | Diamond  | Attack / Defense  |
| d10  | Pentagon | Attack / Defense  |
| d10  | Pentagon | Attack / Defense  |
| d12  | Hexagon  | Attack / Defense  |
| d20  | Crystal  | **Goalie** (auto) |

The **d20 is always automatically assigned to guard your own goal.** It cannot be used for any other purpose.

---

## Dice Fatigue

- Any die used in a possession (for attack or defense) becomes **Resting** and is unavailable for the next possession.
- When a resting die returns to play, it is **re-rolled**.
- Dice that are **not used** in a possession keep their current value and do not re-roll.

---

## Kick-Off

At the start of each game, a **coin flip** determines which team attacks first. This eliminates any first-player advantage.

---

## Possession Structure

Each possession follows this sequence:

### 1. Returning Dice Re-Roll
Any dice that finished resting are re-rolled before play begins.

### 2. Defender Sets the Wall
The defending team places dice into zones to create a wall:

- The **d20 automatically guards the goal** (no choice required). If the d20 is resting, the goal is unguarded.
- The defender then **selects 1–3 available dice** and assigns them to any zone that the attacker still needs to breach.
- Dice assigned to a zone are summed; only zones where the attacker must still advance need to be defended.
- Once the wall is set, the defender clicks **Lock In**.

### 3. Attacker Advances Zone by Zone
The attacker attempts to advance the ball one zone at a time toward the opponent's goal:

- The attacker **selects 1–3 available dice** and clicks **Attack**.
- The sum of the selected dice must be **strictly greater than** the wall value in the target zone.
- **At least 1 die must be committed**, even if the zone is unguarded (wall = 0).
- All dice used in the attack become Resting, **regardless of whether the breach succeeds**.

**If the breach succeeds:** The ball advances to that zone. The attacker may immediately attempt the next zone using remaining available dice.

**If the breach fails:** The possession ends in a turnover. The ball **stays where it is** — it does not reset to center.

### 4. Scoring
If the ball reaches the opponent's goal zone, a **goal is scored**. The ball resets to center and possession alternates.

### 5. Turnover
If the attacker is stopped, possession switches to the other team. The ball remains at its current position — giving the new attacker a positional advantage or disadvantage depending on where it stopped.

---

## Winning

The first team to score **3 goals** wins.

---

## Key Decisions

**As the defender:**
- Which zones are worth protecting with your stronger dice?
- Save your best dice for defense, or spend them now and hope the opponent can't breach your weakened wall next possession?

**As the attacker:**
- Commit strong dice early to guarantee progress, or hold them back for the goal?
- If the ball is already in scoring position, you may only need to breach 1–2 zones.
- Running out of available dice mid-attack means a forced turnover.
