let selectedNumber = null;

const allDigits = document.getElementById("digits");
const board = document.getElementById("board");
const boardContainer = document.getElementById("board-container");
const resultBoard = document.getElementById("result-board");
const size = 9;

document.body.onclick = (e) => selectNumber(e, null)

window.onmousemove = (e) => {

    const body = document.body;

    let x = e.clientX;
    let y = e.clientY;

    body.style.backgroundPositionX = x / 15 + "px"
    body.style.backgroundPositionY = y / 15 + "px"
}

let prevGrid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// این تابع جداول را میسازد

const makeBoard = (isResult) => {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            let tile = document.createElement("div");

            if (r === 0 && c === 0) tile.classList.add("radius-t-l")
            if (r === 0 && c === 8) tile.classList.add("radius-t-r")
            if (r === 8 && c === 0) tile.classList.add("radius-b-l")
            if (r === 8 && c === 8) tile.classList.add("radius-b-r")

            if (r === 2 || r === 5) tile.classList.add("horizontal-line-b")
            if (r === 3 || r === 6) tile.classList.add("horizontal-line-t")
            if (c === 2 || c === 5) tile.classList.add("vertical-line-r")
            if (c === 3 || c === 6) tile.classList.add("vertical-line-l")

            tile.id = r.toString() + "-" + c.toString();

            if (isResult) {
                tile.innerHTML = grid[r][c];
                if (grid[r][c] !== prevGrid[r][c]) tile.classList.add("answer");
                else tile.style.background = "#ccc";
                tile.classList.add("tile");
                resultBoard.append(tile)
            } else {
                tile.addEventListener("click", (e) => {
                    e.stopPropagation();

                    if (selectedNumber && !tile.children.length) {
                        const iTag = document.createElement("i");
                        iTag.className = "clear-number fa fa-close"
                        iTag.onclick = (e) => {
                            e.stopPropagation();
                            iTag.parentElement.innerHTML = "";
                            grid[r][c] = 0;
                            prevGrid[r][c] = 0;
                        }
                        const span = document.createElement("span")
                        span.innerHTML = selectedNumber
                        tile.appendChild(iTag);
                        tile.appendChild(span)

                    }
                });
                tile.classList.add("tile");
                boardContainer.append(tile)
            }
        }
    }
}

// این تابع به منظور انتخاب یک عدد است

const selectNumber = (e, num) => {
    e.stopPropagation();

    selectedNumber = num;
    Array.from(allDigits.children).forEach(item =>
        +item.innerText === num ?
            item.classList.add("number-selcted")
            : item.classList.remove("number-selcted")
    )
}

// این تابع جدول را استایل دهی میکند و باکس اعداد را میسازد

const setGame = () => {
    for (let i = 1; i <= size; i++) {
        let number = document.createElement("div");
        if (i === 1) number.className = "radius-t-l radius-b-l"
        if (i === size) number.className = "radius-t-r radius-b-r"
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", (e) => selectNumber(e, i));
        number.classList.add("number");
        allDigits.insertAdjacentElement("beforeend", number)
    }
    makeBoard();
}

setGame()

// این تابع با زدن دکمه به منظور حل کردن جدول فراخوانی میشود

const solveHandler = () => {

    Array.from(boardContainer.children).forEach((item, i) => {
        let col = Math.floor(i / size);
        let row = i % size;

        grid[col][row] = 0;

        if (item.innerHTML) {
            grid[col][row] = +item.children[1].innerHTML;
            prevGrid[col][row] = +item.children[1].innerHTML;
        }
    })

    if (solve({ col: 0, row: 0 })) {

        resultBoard.innerHTML = "";

        makeBoard(true);

        const btn = document.createElement("button");
        btn.classList.add("btn")
        btn.innerText = "BACK"
        btn.addEventListener("click", backHandler);
        resultBoard.append(btn);

        resultBoard.classList.add("show");
        resultBoard.classList.remove("hide");
        board.classList.remove("show");
        board.classList.add("hide");
    } else {
        alert("جدول قابل حل نیست")
    }
}

// این تابع، دکمه بازگشت را هندل میکند

const backHandler = () => {
    resultBoard.classList.remove("show");
    resultBoard.classList.add("hide");
    board.classList.add("show");
    board.classList.remove("hide");
}

// این تابع چک میکند که ایا ان خانه از جدول برای ان عدد مناسب است یا خیر
// O(n^2)

const isSafe = ({ col, row, num }) => {
    for (let i = 0; i < size; i++) {
        if (grid[col][i] === num) return false
    }

    for (let i = 0; i < size; i++) {
        if (grid[i][row] === num) return false
    }

    let startCol = col - col % 3;
    let startRow = row - row % 3;

    for (let i = startCol; i < startCol + 3; i++) {
        for (let j = startRow; j < startRow + 3; j++) {
            if (grid[i][j] === num) return false
        }
    }
    return true;
}

// این تابع به روش پسگرد جدول را حل میکند
// O(9n)

const solve = ({ col, row }) => {

    if (col === size && row === size - 1) return true

    if (col === size) {
        col = 0;
        row = row + 1;
    }

    if (grid[col][row] !== 0) return solve({ col: col + 1, row })

    for (let num = 1; num <= 9; num++) {
        let isItSafe = isSafe({ col, row, num });

        if (isItSafe) {
            grid[col][row] = num;
            if (solve({ col: col + 1, row })) return true
        }

        grid[col][row] = 0;
    }

    return false;
}