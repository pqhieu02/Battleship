const UNMARKED = -1;
const WATER = 0;
const SHIP = 1;
const DESTROYED_SHIP = 2;

module.exports.WIDTH = 9;
module.exports.HEIGHT = 9;
module.exports.SHIPTOTAL = 1;
module.exports.UNMARKED = -1;
module.exports.WATER = 0;
module.exports.SHIP = 1;
module.exports.DESTROYED_SHIP = 2;
module.exports.COLOR = {
    [UNMARKED]: {
        FRIENDLY: "white",
        ENEMY: "white",
    },
    [WATER]: {
        FRIENDLY: "blue",
        ENEMY: "blue",
    },
    [SHIP]: {
        FRIENDLY: "lightblue",
        ENEMY: "lightblue",
    },
    [DESTROYED_SHIP]: {
        FRIENDLY: "gray",
        ENEMY: "red",
    },
};

// module.exports.BASE_URL = "https://backend-battleship.quangnau.com";
module.exports.BASE_URL = "http://localhost:443";
