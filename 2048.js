let board;
let score = 0;
let rows = 4;
let columns = 4;
// let boardCopy = [];

const setGame = () => {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;

            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    spawnRandomTwoTile();
    spawnRandomTwoTile();
}

const spawnRandomTwoTile = () => {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(`${r}-${c}`);
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

const hasEmptyTile = () => {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
}

const updateTile = (tile, num) => {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add(`x${num}`);
        } else {
            tile.classList.add(`x8192`);
        }
    }
}

const slideRows = (reverse = false) => {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        reverse && row.reverse();
        row = slide(row);
        reverse && row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

const slideColumns = (reverse = false) => {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];  // Transpose first num in rows for each column to new row
        reverse && row.reverse();
        row = slide(row);
        reverse && row.reverse();

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r]; //  Detranstopse to original
            let tile = document.getElementById(`${r}-${c}`);
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

const slide = (row) => {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        //  check every 2
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        } // [2, 2, 2] => [4, 0, 2]
    }

    row = filterZero(row); // [4, 2]

    //  Add zeroes back
    while (row.length < columns) {
        row.push(0);
        //  [4, 2, 0, 0]
    }

    return row;
}

const filterZero = (row) => {
    return row.filter(num => num != 0);
}

const reset = () => {
    score = 0;
    boardCopy = [];
    document.getElementById("board").innerHTML = "";
    setGame();
}

// const copyBoard = () => {
//     boardCopy = [];
//     for (let r = 0; r < rows; r++) {
//         let copyRow = [];
//         for (let c = 0; c < columns; c++) {
//             copyRow.push(board[r][c]);
//         }
//         boardCopy.push(copyRow);
//     }

//     console.log("current", boardCopy);
//     console.log("copy:", boardCopy);
// }

window.onload = () => {
    setGame();
    document.addEventListener("keyup", (e) => {
        if (e.code == "ArrowLeft") {
            slideRows(false);
            spawnRandomTwoTile();
        } else if (e.code == "ArrowRight") {
            slideRows(true);
            spawnRandomTwoTile();
        } else if (e.code == "ArrowUp") {
            slideColumns(false);
            spawnRandomTwoTile();
        } else if (e.code == "ArrowDown") {
            slideColumns(true);
            spawnRandomTwoTile();
        } else if (e.code == "Space") {
            reset();
        }

        document.getElementById("score").innerText = score;
    });
}
