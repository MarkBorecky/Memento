 // Function to create falling characters
 const createMatrix = () => {
    const matrix = document.getElementById('matrix');
    const chars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    // const numCols = Math.floor(window.innerWidth / 20);

    const left = Math.floor(Math.random() * window.innerWidth); 

console.log('left', left)

    const column = createColumn(left, matrix);

    column.print(chars);



    
}

const createColumn = (left, matrix) => {
    const maxTop = window.innerHeight;

    const indexes = Array.from({ length: (maxTop + 1) / 20 }, (_, i) => i);
    
    const cells = indexes.map(id => ({ 
        id: id, 
        cell: createCell(left, id * 20)
    }));

    cells.forEach(cell => matrix.appendChild(cell.cell));

    return {
        id: left,
        cells: cells,
        print: (text) => {
            console.log('print')
            let index = 0;
            for (const char of text) {
                const cellId = index++ % cells.length;
                cells[cellId].cell.textContent = char;
            }
        }
    };
}

const createCell = (left, top) => {
    console.log(`left ${left}, top ${top}`)
    const cell = document.createElement('span');
    cell.textContent = 'A';
    cell.style.left = `${left}px`;
    cell.style.top = `${top}px`;
    return cell;
}


createMatrix();

