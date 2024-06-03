const cellSheet = [];
const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

//---cell 만들기---//
function createCell(row, column, cellRow) {
  const cell = {
    row,
    column,
    content: '',
    isClicked: false,
    isHeader: false,
    isActive: false,
  };

  // header에 추가 속성 부여
  if (row === 0 && column >= 1) {
    cell.isHeader = true;
    cell.content = alphabets[column - 1];
  } else if (row >= 1 && column === 0) {
    cell.isHeader = true;
    cell.content = row;
  } else if (row === 0 && column === 0) {
    cell.isHeader = true;
  }

  cellRow.push(cell);
}

function createCellRow(row) {
  const cellRow = [];
  for (let i = 0; i < 10; i++) {
    createCell(row, i, cellRow);
  }
  cellSheet.push(cellRow);
}

function createCellSheet() {
  for (let i = 0; i < 10; i++) {
    createCellRow(i);
  }
}

createCellSheet();

//---만들어진 cell 바탕으로 요소 만들기---//
const cellContainer = document.getElementById('cell-container');

function createCellEl(cell) {
  const cellEl = document.createElement('input');
  cellEl.className = 'cell';
  cellEl.id = `cell-${cell.row}-${cell.column}`;
  cellEl.value = cell.content;
  if (cell.isHeader) {
    cellEl.classList.add('header');
  }

  cellEl.onclick = () => handleCellClick(cell);
  cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

  return cellEl;
}

function handleOnChange(content, cell) {
  cell.content = content;
}

function drawSheet() {
  for (let i = 0; i < 10; i++) {
    const cellRowEl = document.createElement('div');
    cellRowEl.className = 'cell-row';

    for (let j = 0; j < 10; j++) {
      const cell = cellSheet[i][j];
      cellRowEl.append(createCellEl(cell));
    }

    cellContainer.append(cellRowEl);
  }
}

drawSheet();

//---클릭하면 헤더 색 변하기---//
function handleCellClick(cell) {
  clearHeaderActiveStates();
  const columnHeader = cellSheet[0][cell.column];
  const rowHeader = cellSheet[cell.row][0];
  console.log(columnHeader, rowHeader);
  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
  columnHeaderEl.classList.add('active');
  rowHeaderEl.classList.add('active');
  document.querySelector('#cell-status').innerHTML =
    alphabets[cell.column - 1] + cell.row;
}

function clearHeaderActiveStates() {
  const headers = document.querySelectorAll('.header');

  headers.forEach((header) => {
    header.classList.remove('active');
  });
}

function getElFromRowCol(row, col) {
  return document.querySelector(`#cell-${row}-${col}`);
}

//---excel 파일로 생성하기---//
const exportBtn = document.querySelector('#export-btn');

exportBtn.onclick = function (e) {
  let csv = '';
  console.log(cellSheet);

  for (let i = 0; i < cellSheet.length; i++) {
    if (i === 0) continue;
    csv +=
      cellSheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.content)
        .join(',') + '\r\n';
  }

  const csvObj = new Blob([csv]);
  console.log('csvObj', csvObj);

  const csvUrl = URL.createObjectURL(csvObj);
  console.log('csvUrl', csvUrl);

  const a = document.createElement('a');
  a.href = csvUrl;
  a.download = 'spreadsheet.csv';
  a.click();
};
