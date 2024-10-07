 // Function to create falling characters
 const createMatrix = () => {
    const matrix = document.getElementById('matrix');
    // const chars = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const chars = 'Dobranoc!!!';
    // const numCols = Math.floor(window.innerWidth / 20);

    const left = Math.floor(Math.random() * window.innerWidth);

    const column = createColumn(left, matrix);

    column.print(chars);



    
}

const randomInterval = () => Math.floor(Math.random * 1000);

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
            let index = 0;
            const interval = randomInterval();
            const printCharacter = (index, text) => {
                if (text.length >= 1) {
                    setTimeout(() => {
                        const cell = cells[index++ % cells.length].cell;
                        cell.textContent = text.substring(0, 1);
                        cell.classList.add("fade-out-rain");
                        setTimeout(() => cell.textContent = '', 5000);
                        setTimeout(() => cell.classList.remove("fade-out-rain"), 5500);

                        printCharacter(index, text.substring(1, text.length))
                    }, interval);
                }
            }

            // }
            printCharacter(index, text)
        }
    };
}

const createCell = (left, top) => {
    console.log(`left ${left}, top ${top}`)
    const cell = document.createElement('span');
    cell.textContent = '';
    cell.style.left = `${left}px`;
    cell.style.top = `${top}px`;
    return cell;
}


createMatrix();

