let destination = false;
const bombingHistory = [];
let hidingDestination = false;
let isHiding = false;
let hidingTimer = 8;
let firstLoop = true;

// HELPERS
const info = (tableState, myState) => {
    const { x, y, canBomb } = myState;
    printErr(`MY STATE - X: ${ x }, Y: ${ y }, canBomb: ${ canBomb === 1 }`);
    printErr('--------------------------');
}

const moveTo = (x, y) => {
    print(`MOVE ${ x } ${ y }`);
}

const bombAndMoveTo = (x, y) => {
    print(`BOMB ${ x } ${ y }`);
}

const waitHere = myState => {
    print(`MOVE ${ myState.x } ${ myState.y }`);
}

const isBox = tile => tile === '0' || tile === '1' || tile === '2';

const isWall = tile => tile === 'X';

const isUndefined = tile => {
    return tile === undefined
}

// CHECK IF BOMB HAS ALREADY BEEN PLACED HERE AT SOME POINT
const consultHistory = locationAndValue => {
    let value = locationAndValue.value;

    for (let i = 0; i < bombingHistory.length; i++) {
        if (bombingHistory[i].x === locationAndValue.x && bombingHistory[i].y === locationAndValue.y) {
            value = 0;
        }
    }
    return value;
}

// CHECK THE VALUE OF BOMBING A CERTAIN TILE
const checkBlastValue = (tableState, { x, y }) => {
    let value = 0;

    let rightOne = tableState[`row_${ y }`].split('')[x + 1];
    rightOne = isUndefined(rightOne) ? false : rightOne;

    let rightTwo = tableState[`row_${ y }`].split('')[x + 2];
    rightTwo = isUndefined(rightTwo) ? false : rightTwo;

    let leftOne = tableState[`row_${ y }`].split('')[x - 1];
    leftOne = isUndefined(leftOne) ? false : leftOne;

    let leftTwo = tableState[`row_${ y }`].split('')[x - 2];
    leftTwo = isUndefined(leftTwo) ? false : leftTwo;

    let rowDownOne = isUndefined(tableState[`row_${ y + 1 }`]) ? false : tableState[`row_${ y + 1 }`].split('')[x];
    let rowDownTwo = isUndefined(tableState[`row_${ y + 2 }`]) ? false : tableState[`row_${ y + 2 }`].split('')[x];

    let rowUpOne = isUndefined(tableState[`row_${ y - 1 }`]) ? false : tableState[`row_${ y - 1 }`].split('')[x];
    let rowUpTwo = isUndefined(tableState[`row_${ y - 2 }`]) ? false : tableState[`row_${ y - 2 }`].split('')[x];

    if (isBox(rightOne)) value++
    if (isWall(rightOne)) value--

    if (isBox(rightTwo)) value++
    if (isWall(rightTwo)) value--

    if (isBox(leftOne)) value++
    if (isWall(leftOne)) value--

    if (isBox(leftTwo)) value++
    if (isWall(leftTwo)) value--

    if (isBox(rowDownOne)) value++
    if (isWall(rowDownOne)) value--

    if (isBox(rowDownTwo)) value++
    if (isWall(rowDownTwo)) value--

    if (isBox(rowUpOne)) value++
    if (isWall(rowUpOne)) value--

    if (isBox(rowUpTwo)) value++
    if (isWall(rowUpTwo)) value--

    return value;
}

// LOOK FOR BEST TILE TO PLACE BOMB IN A CERTAIN DISTANCE (maxMoves) FROM CURRENT LOCATION
const findGoodPlaceToBomb = (tableState, myState) => {
    const { x, y } = myState;

    let maxMoves = 4;
    if (firstLoop) {
        maxMoves = 5;
        firstLoop = false;
    }

    let bestLocationAndValue = { x, y, value: 0 };

    for (let i = 0; i < maxMoves; i++) {
        for (let j = 0; j < maxMoves - i; j++) {
            let currentTile = isUndefined(tableState[`row_${ y + j }`]) ? false : tableState[`row_${ y + j }`];
            if (currentTile !== false) {
                currentTile = isUndefined(currentTile.split('')[x + i]) ? false : currentTile.split('')[x + i];
            }

            if (currentTile === '.') {
                let currentLocationValue = checkBlastValue(tableState, { x: x + i, y: y + j });

                currentLocationValue = consultHistory({ x: x + i, y: y + j, value: currentLocationValue });

                if (currentLocationValue > bestLocationAndValue.value) {
                    bestLocationAndValue = { x: x + i, y: y + j, value: currentLocationValue }
                }
            }
        } 
    }

    for (let i = 0; i < maxMoves; i++) {
        for (let j = 0; j < maxMoves - i; j++) {
            let currentTile = isUndefined(tableState[`row_${ y - j }`]) ? false : tableState[`row_${ y - j }`];
            if (currentTile !== false) {
                currentTile = isUndefined(currentTile.split('')[x - i]) ? false : currentTile.split('')[x - i];
            }

            if (currentTile === '.') {
                let currentLocationValue = checkBlastValue(tableState, { x: x - i, y: y - j });

                currentLocationValue = consultHistory({ x: x - i, y: y - j, value: currentLocationValue });

                if (currentLocationValue > bestLocationAndValue.value) {
                    bestLocationAndValue = { x: x - i, y: y - j, value: currentLocationValue }
                }
            }
        } 
    }

    return bestLocationAndValue;
}

const findHidingPlace = (tableState, myState) => {
    const { x, y } = myState;
    let hidingPlace = { x, y };

    // right one
    let rightOne = tableState[`row_${ y }`].split('')[x + 1];
    rightOne = isUndefined(rightOne) ? false : rightOne;
    if (rightOne === '.') {
        // check right one one up
        const oneUp = tableState[`row_${ y - 1 }`];
        const rightOneOneUp = isUndefined(oneUp) ? false : oneUp.split('')[x + 1]

        if (rightOneOneUp === '.') {
            hidingPlace = { x: x + 1, y: y - 1 }
        }

        const oneDown = tableState[`row_${ y + 1 }`];
        const rightOneOneDown = isUndefined(oneDown) ? false : oneDown.split('')[x + 1];

        if (rightOneOneDown == '.') {
            hidingPlace = { x: x + 1, y: y + 1 }
        }
    }

    // right two
    let rightTwo = tableState[`row_${ y }`].split('')[x + 2];
    rightTwo = isUndefined(rightTwo) ? false : rightTwo;
    if (rightTwo === '.' && rightOne === '.') {
        // check right two one up
        const oneUp = tableState[`row_${ y - 1 }`];
        const rightTwoOneUp = isUndefined(oneUp) ? false : oneUp.split('')[x + 2]

        if (rightTwoOneUp === '.') {
            hidingPlace = { x: x + 2, y: y - 1 }
        }

        const oneDown = tableState[`row_${ y + 1 }`];
        const rightTwoOneDown = isUndefined(oneDown) ? false : oneDown.split('')[x + 2];

        if (rightTwoOneDown == '.') {
            hidingPlace = { x: x + 2, y: y + 1 }
        }
    }

    // left one
    let leftOne = tableState[`row_${ y }`].split('')[x - 1];
    leftOne = isUndefined(leftOne) ? false : leftOne;
    if (leftOne === '.') {
        // check left one one up
        const oneUp = tableState[`row_${ y - 1 }`];
        const leftOneOneUp = isUndefined(oneUp) ? false : oneUp.split('')[x - 1]

        if (leftOneOneUp === '.') {
            hidingPlace = { x: x - 1, y: y - 1 }
        }

        const oneDown = tableState[`row_${ y + 1 }`];
        const leftOneOneDown = isUndefined(oneDown) ? false : oneDown.split('')[x - 1];

        if (leftOneOneDown === '.') {
            hidingPlace = { x: x - 1, y: y + 1 }
        }
    }

    // left two
    let leftTwo = tableState[`row_${ y }`].split('')[x - 2];
    leftTwo = isUndefined(leftTwo) ? false : leftTwo;
    if (leftTwo === '.' && leftOne === '.') {
        // check left two one up
        const oneUp = tableState[`row_${ y - 1 }`];
        const leftTwoOneUp = isUndefined(oneUp) ? false : oneUp.split('')[x - 2]

        if (leftTwoOneUp === '.') {
            hidingPlace = { x: x - 2, y: y - 1 }
        }

        const oneDown = tableState[`row_${ y + 1 }`];
        const leftTwoOneDown = isUndefined(oneDown) ? false : oneDown.split('')[x - 2];

        if (leftTwoOneDown === '.') {
            hidingPlace = { x: x - 2, y: y + 1 }
        }
    }

    // down one and two
    let downOne = isUndefined(tableState[`row_${ y + 1 }`]) ? false : tableState[`row_${ y + 1 }`].split('')[x];
    let downTwo = isUndefined(tableState[`row_${ y + 2 }`]) ? false : tableState[`row_${ y + 2 }`].split('')[x];

    if (downOne === '.') {
        const oneLeft = isUndefined(tableState[`row_${ y + 1 }`].split('')[x - 1]) ? false : tableState[`row_${ y + 1 }`].split('')[x - 1];
        
        if (oneLeft === '.') {
            hidingPlace = { x: x - 1, y: y + 1 }
        }

        const oneRight = isUndefined(tableState[`row_${ y + 1 }`].split('')[x + 1]) ? false : tableState[`row_${ y + 1 }`].split('')[x + 1];

        if (oneRight === '.') {
            hidingPlace = { x: x + 1, y: y + 1 }
        }
    }

    if (downTwo === '.' && downOne === '.') {
        const oneLeft = isUndefined(tableState[`row_${ y + 2 }`].split('')[x - 1]) ? false : tableState[`row_${ y + 2 }`].split('')[x - 1];
        
        if (oneLeft === '.') {
            hidingPlace = { x: x - 1, y: y + 2 }
        }

        const oneRight = isUndefined(tableState[`row_${ y + 2 }`].split('')[x + 1]) ? false : tableState[`row_${ y + 2 }`].split('')[x + 1];

        if (oneRight === '.') {
            hidingPlace = { x: x + 1, y: y + 2 }
        }
    }

    // up one and two
    let upOne = isUndefined(tableState[`row_${ y - 1 }`]) ? false : tableState[`row_${ y - 1 }`].split('')[x];
    let upTwo = isUndefined(tableState[`row_${ y - 2 }`]) ? false : tableState[`row_${ y - 2 }`].split('')[x];

    if (upOne === '.') {
        const oneLeft = isUndefined(tableState[`row_${ y - 1 }`].split('')[x - 1]) ? false : tableState[`row_${ y - 1 }`].split('')[x - 1];
        
        if (oneLeft === '.') {
            hidingPlace = { x: x - 1, y: y - 1 }
        }

        const oneRight = isUndefined(tableState[`row_${ y - 1 }`].split('')[x + 1]) ? false : tableState[`row_${ y - 1 }`].split('')[x + 1];

        if (oneRight === '.') {
            hidingPlace = { x: x + 1, y: y - 1 }
        }
    }

    if (upTwo === '.' && upOne === '.') {
        const oneLeft = isUndefined(tableState[`row_${ y - 2 }`].split('')[x - 1]) ? false : tableState[`row_${ y - 2 }`].split('')[x - 1];
        
        if (oneLeft === '.') {
            hidingPlace = { x: x - 1, y: y - 2 }
        }

        const oneRight = isUndefined(tableState[`row_${ y - 2 }`].split('')[x + 1]) ? false : tableState[`row_${ y - 2 }`].split('')[x + 1];

        if (oneRight === '.') {
            hidingPlace = { x: x + 1, y: y - 2 }
        }
    }

    return hidingPlace;
}

// MAIN FUNCTION
const run = (tableState, myState) => {
    info(tableState, myState);

    if (!destination) {
        const bestLocationAndValue = findGoodPlaceToBomb(tableState, myState);
        destination = { x: bestLocationAndValue.x, y: bestLocationAndValue.y };
    }

    const inDesiredLocaion = destination.x === myState.x && destination.y === myState.y;
    const inHidingLoction = hidingDestination.x === myState.x && hidingDestination.y === myState.y;

    if (inDesiredLocaion && myState.canBomb && !isHiding) {
        printErr('1 - BOMB AND HIDE')

        const hidingPlace = findHidingPlace(tableState, myState);
        
        bombAndMoveTo(hidingPlace.x, hidingPlace.y);

        destination = false;
        hidingDestination = { x: hidingPlace.x, y: hidingPlace.y }
        
        bombingHistory.push({ x: myState.x, y: myState.y });

        isHiding = true;
    } else if (myState.canBomb && !isHiding && destination) {
        printErr('2 - CAN BOMB, AM NOT HIDING, HAVE A DESTINATION');

        moveTo(destination.x, destination.y);
    } else if (myState.canBomb && !isHiding && destination === false) {
        printErr('3 - CAN BOMB, AM NOT HIDING, DONT HAVE A DESTINATION');

        hidingDestination = false;

        const bestLocationAndValue = findGoodPlaceToBomb(tableState, myState);
        destination = { x: bestLocationAndValue.x, y: bestLocationAndValue.y };

        moveTo(destination.x, destination.y);
    } else if (isHiding) {
        printErr('4 - AM HIDING');

        moveTo(hidingDestination.x, hidingDestination.y);
    } else {
        printErr('5 - ENDING');
        
        if (destination) {
            moveTo(destination.x, destination.y);
        } else {
            moveTo(hidingDestination.x, hidingDestination.y);
        }
    }

    if(isHiding) {
        hidingTimer--;
    }

    if (hidingTimer === 0) {
        isHiding = false;
        hidingTimer = 8;
    }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var inputs = readline().split(' ');
const width = parseInt(inputs[0]);
const height = parseInt(inputs[1]);
const myId = parseInt(inputs[2]);

// game loop
while (true) {
    const tableState = {};
    let myState = {};

    for (let i = 0; i < height; i++) {
        const row = readline();
        tableState[`row_${ i }`] = row;
    }
    const entities = parseInt(readline());
    for (let i = 0; i < entities; i++) {
        var inputs = readline().split(' ');
        const entityType = parseInt(inputs[0]);
        const owner = parseInt(inputs[1]);
        const x = parseInt(inputs[2]);
        const y = parseInt(inputs[3]);
        const param1 = parseInt(inputs[4]);
        const param2 = parseInt(inputs[5]);

        if (entityType === 0 && owner === myId) {
            myState = { x, y, canBomb: param1 }
        }
    }

    // Write an action using print()
    // To debug: printErr('Debug messages...');

   run(tableState, myState);
}
