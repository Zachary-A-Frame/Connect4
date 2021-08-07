/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let p1Score = 0
let p2Score = 0

let currPlayer = 1; // active player: 1 or 2
let board = new Set(); // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  // Set "board" to empty HEIGHT x WIDTH matrix array
  // When this function is called, we want our board to be cleared.
  board.clear()

  // To set up to our matrix, we use nested for loops. The first allows us to set our row, the second adds each column to it.
  for (y = 1; y <= HEIGHT; y++) {
    let row = new Set();
    for (x = 1; x <= WIDTH; x++) {
      row.add([x, y])
    }
    board.add(row)
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board")

  // Create a table row in html, give it an id of column-top, and add an event listener for if players click it. This is our top row, this is how we allow players to choose their piece location.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // This will create a data container element, or td, with an id of variable x, and then we're appending it to the top of our htmlBoard. The ID we're giving it is based on its x value.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // This will create rows and data containers for our height, including adding an id, etc.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  // We spread our set out, giving us an array to work with.
  const boardArr = [...board]
  // This checks to see if a spot is filled or not, returning the coordinate we want our piece to go to, given X as a parameter.
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!boardArr[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // This will check if currPlayer value is set to 1 or 2, indicating which player it is, and adding a class of p1 or p2, as well as the piece class. This will ensure our div is filled with the right color correctly, alternating between red and blue.
  const piece = document.createElement("div");
  if (currPlayer === 1) {
    piece.classList.add("p1")
  } else {
    piece.classList.add("p2")
  }
  piece.classList.add("piece")

  const location = document.getElementById(`${y}-${x}`);

  location.append(piece)
}

/** endGame: announce game end */

const endGame = (msg) => {
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // console.log(x)
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  const boardArr = [...board]
  boardArr[y][x] = currPlayer
  placeInTable(y, x);
  // check for win, if this function returns true the game restarts. We run our makeBoard function, which also clears the set and recreates it. Then we remove all of the p1, p2, and piece classes.
  if (checkForWin()) {
    makeBoard()
    const boardArr = document.querySelectorAll(`.piece`)
    for (i = 0; i < boardArr.length; i++) {
      boardArr[i].classList.remove("p1")
      boardArr[i].classList.remove("p2")
      boardArr[i].classList.remove("piece")
    }
    // This is where we control our scoreboard. After checking if there is a victory, we want to set up some values to manipulate in our scoreboard. Our scoreboard updates each time a player wins, and will hand over a crown to whichever player currently has more victories.
    let currPlayerText = document.getElementById(`p${currPlayer}score`)
    const p1 = document.getElementById(`p1score`)
    const p2 = document.getElementById(`p2score`)

    if (currPlayer === 1) {
      p1Score++
      if (p1Score > p2Score) {
        currPlayerText.innerHTML = `&#128081;Player 1: ${p1Score} `
        p2.innerHTML = `Player 2: ${p2Score}`

      } else {
        currPlayerText.innerHTML = `Player 1: ${p1Score} `
      }
    } else {
      p2Score++
      if (p2Score > p1Score) {
        currPlayerText.innerHTML = `&#128081; Player 2: ${p2Score} `
        p1.innerHTML = `Player 1: ${p1Score}`
      } else {
        currPlayerText.innerHTML = `Player 2: ${p2Score} `
      }
    }
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // const boardArr = document.querySelectorAll(`.piece`)
  // for (i = 0; i < boardArr.length; i++) {
  //   boardArr[i].classList.remove("p1")
  //   boardArr[i].classList.remove("p2")
  //   boardArr[i].classList.remove("piece")
  // }

  const boardClasslist = document.querySelectorAll(`.piece`)
  let total = 0
  for (i = 0; i < boardClasslist.length; i++) {
    if (boardClasslist[i].classList.contains("p2")) {
      total++
      if (total === 26) {
        endGame(`Tie!`)
      }
    }
  }

  currPlayer = currPlayer === 1 ? 2 : 1;

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const boardArr = [...board]

    // Uses the every() method to determine if every value within a victory condition is met.
    // Performs simple validation to ensure no NaN, undefined, etc. Then checks to see if the value is set to the current player.
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        boardArr[y][x] === currPlayer
    );
  }

  // Within our checkForWin() we have a for loop, which checks each row. The first loop is designating that we're checking by row.
  for (let y = 0; y < HEIGHT; y++) {
    // The second loop is going through each row itself.
    for (let x = 0; x < WIDTH; x++) {
      // For a horizontal win  to occur, we need four across. Starting from any [y, x], we can add one to each x value until we've reached [y, x + 3], which would indicate four adjacent pieces. Our function below will return true only if each possible array is owned by the currect player.
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // For a verticle win  to occur, we need four up or down. Starting from any [y, x], we can add one to each y value until we've reached [y + 3, x]. Starting from y, add one three times, checking each time if that piece is owned by the same player. As long as every value is true, a win has been achieved.
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // For a diagonal win, increment both height and width, or increase height but decrement width. This creates both diagonal shapes.
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      // We try out each possible win condition within our .every() method, stopping if one of them returns true.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();