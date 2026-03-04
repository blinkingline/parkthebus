const diceFaces = {
    pitch: ["Attack", "Attack", "Defense", "Defense", "Midfield", "Midfield"],
    shot: ["GOAL!", "Midfield", "Counter Attack!", "Free Kick", "Corner", "Penalty"]
};

let gameState = {
    scores: [0, 0],
    currentPlayer: 0,
    rollsRemaining: 3,
    lockedDice: [false, false],
    currentRoll: [null, null]
};