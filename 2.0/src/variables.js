//Setting it up: Vars
let stars = [], enemies = [], particles = [], coins = [], bullets = [], combos = [], collectableHearts = [],
    ship, selectedUpgrade = "none", currentUpgrades = [], collectableBombs = [], bombs = [], storageBombs = 0,
    possibleUpgrades = ["none", "split", "laser", "bomb", "return", "slice", "bounce"],
    costs = [0, 0, 0, 0, 0, 0],
    coinImageData = [0, 137, 265, 389, 508, 606, 83, 205, 325, 452], shipImgs = null, enemyImg = null, 
    heartImg = null, heartCollectImg = null, closeImg = null, bombImg = null, coinImage = null, fonts = null
    upgradeMenu = [], playButton = null, upgradeButton = null
    lagMode = null, mode = null,
    coinsCollected = 0,
    keyWait = 0;