let destination = false;
const bombingHistory = [];

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

const isBox = tile => tile === '0';

const isUndefined = tile => {
    return tile === undefined
}

const consultHistory = locationAndValue => {
    let value = locationAndValue.value;

    for (let i = 0; i < bombingHistory.length; i++) {
        if (bombingHistory[i].x === locationAndValue.x && bombingHistory[i].y === locationAndValue.y) {
            value = 0;
        }
    }
    return value;
}

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

    if (rightOne === '0' || rightOne === '1' || rightOne === '2') value++
    if (rightTwo === '0' || rightTwo === '1' || rightTwo === '2') value++
    if (leftOne === '0' || leftOne === '1' || leftOne === '2') value++
    if (leftTwo === '0' || leftTwo === '1' || leftTwo === '2') value++
    if (rowDownOne === '0' || rowDownOne === '1' || rowDownOne === '2') value++
    if (rowDownTwo === '0' || rowDownTwo === '1' || rowDownTwo === '2') value++
    if (rowUpOne === '0' || rowUpOne === '1' || rowUpOne === '2') value++
    if (rowUpTwo === '0' || rowUpTwo === '1' || rowUpTwo === '2') value++

    printErr('blast value', value);

    return value;
}

const findGoodPlaceToBomb = (tableState, myState) => {
    const { x, y } = myState;

    const maxMoves = 10;

    bestLocationAndValue = { x, y, value: 0 };

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

    printErr('best location and value-------------', `${ bestLocationAndValue.x } ${ bestLocationAndValue.y } ${ bestLocationAndValue.value }`)

    return bestLocationAndValue;
}

// MAIN FUNCTION
const run = (tableState, myState) => {
    info(tableState, myState);

    if (!destination) {
        const bestLocationAndValue = findGoodPlaceToBomb(tableState, myState);
        destination = { x: bestLocationAndValue.x, y: bestLocationAndValue.y };
        bombingHistory.push(destination);
    }

    const inDesiredLocaion = destination.x === myState.x && destination.y === myState.y;

    if (inDesiredLocaion && myState.canBomb) {
        const bestLocationAndValue = findGoodPlaceToBomb(tableState, myState);

        bombAndMoveTo(bestLocationAndValue.x, bestLocationAndValue.y);

        destination = { x: bestLocationAndValue.x, y: bestLocationAndValue.y };
        bombingHistory.push(destination);
    } else if (inDesiredLocaion) {
        waitHere(myState);
    } else {
        moveTo(destination.x, destination.y);
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
