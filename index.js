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


    // check right
    if (rightOne === '0') value++
    if (rightTwo === '0') value++
    if (leftOne === '0') value++
    if (leftTwo === '0') value++
    if (rowDownOne === '0') value++
    if (rowDownTwo === '0') value++
    if (rowUpOne === '0') value++
    if (rowUpTwo === '0') value++


    printErr('blast value', value);

    return value;
}

const isGoodPlaceToBomb = (tableState, myState) => {
    const { x, y } = myState;
    // do 3 tiles to the right contain a box?
    // const twoTilesRight = tableState[`row_${ y }`].split('').slice(x + 1, x + 3);

    // if (twoTilesRight[0] === '0' || twoTilesRight[1] === '0') return true;

    // // do 3 tiles down contain a box?
    // if (y < height - 3) {
    //     const twoTilesDown = [tableState[`row_${ y + 1 }`].split('')[x], tableState[`row_${ y + 2 }`].split('')[x]];
    //     if (twoTilesDown[0] === '0' || twoTilesDown[1] === '0') return true;
    // }

    // get info on first 7 tiles
    const maxMoves = 7;
    // const currentRow = tableState[`row_${ y }`].split('').slice(x + 1, x + 7);
    // printErr('current Row--', currentRow);

    bestLocationAndValue = { x, y, value: 0 };

    for (let i = 0; i < maxMoves; i++) {
        for (let j = 0; j < maxMoves - i; j++) {
            let currentTile = isUndefined(tableState[`row_${ y + j }`]) ? false : tableState[`row_${ y + j }`];
            if (currentTile !== false) {
                currentTile = isUndefined(currentTile.split('')[x + i]) ? false : currentTile.split('')[x + i];
            }

            if (currentTile === '.') {
                const currentLocationValue = checkBlastValue(tableState, { x: x + i, y: y + j });

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
                const currentLocationValue = checkBlastValue(tableState, { x: x - i, y: y - j });

                if (currentLocationValue > bestLocationAndValue.value) {
                    bestLocationAndValue = { x: x - i, y: y - j, value: currentLocationValue }
                }
            }
        } 
    }

    printErr('best location and value-------------', `${ bestLocationAndValue.x } ${ bestLocationAndValue.y } ${ bestLocationAndValue.value }`)

    return bestLocationAndValue;
}

const moveToBetterLocation = (myState, letsBomb = false) => {
    const { x, y } = myState;

    if (x !== width - 1 && y !== height - 1 && y === 0) {
        if (letsBomb) {
            bombAndMoveTo(myState.x + 1, myState.y);
        } else {
            moveTo(myState.x + 1, myState.y);
        }
    } else if (y !== height - 1 && x !== 0) {
        if (letsBomb) {
            bombAndMoveTo(myState.x, myState.y + 1);
        } else {
            moveTo(myState.x, myState.y + 1);
        }
    } else if (x !== 0) {
        if (letsBomb) {
            bombAndMoveTo(myState.x - 1, myState.y);
        } else {
            moveTo(myState.x - 1, myState.y);
        }
    } else {
        if (letsBomb) {
            bombAndMoveTo(myState.x, myState.y - 1);
        } else {
            moveTo(myState.x, myState.y - 1);
        }
    }
}

// MAIN FUNCTION
const run = (tableState, myState) => {
    info(tableState, myState);

    const bestLocationAndValue = isGoodPlaceToBomb(tableState, myState);

    bombAndMoveTo(bestLocationAndValue.x, bestLocationAndValue.y);

    // if (myState.canBomb && shouldBomb) {
    //     moveToBetterLocation(myState, shouldBomb);
    // } else if (shouldBomb) {
    //     waitHere(myState);
    // } else {
    //     moveToBetterLocation(myState);
    // }
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
