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



const isGoodPlaceToBomb = (tableState, myState) => {
    const { x, y } = myState;
    // do 3 tiles to the right contain a box?
    const twoTilesRight = tableState[`row_${ y }`].split('').slice(x + 1, x + 3);

    if (twoTilesRight[0] === '0' || twoTilesRight[1] === '0') return true;

    // do 3 tiles down contain a box?
    if (y < height - 3) {
        const twoTilesDown = [tableState[`row_${ y + 1 }`].split('')[x], tableState[`row_${ y + 2 }`].split('')[x]];
        if (twoTilesDown[0] === '0' || twoTilesDown[1] === '0') return true;
    }
    
    // do 3 tiles left contain a box?
    const twoTilesLeft = tableState[`row_${ y }`].split('').slice(x - 2, x);

    if (twoTilesLeft[0] === '0' || twoTilesLeft[1] === '0') return true;
    // do 3 tiles up contain a box?
    if (y > 1) {
        const twoTilesUp = [tableState[`row_${ y - 1 }`].split('')[x], tableState[`row_${ y - 2 }`].split('')[x]];
        
        if (twoTilesUp[0] === '0' || twoTilesUp[1] === '0') return true;
    }

    return false;
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

    const shouldBomb = isGoodPlaceToBomb(tableState, myState);

    if (myState.canBomb && shouldBomb) {
        moveToBetterLocation(myState, shouldBomb);
    } else if (shouldBomb) {
        waitHere(myState);
    } else {
        moveToBetterLocation(myState);
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
