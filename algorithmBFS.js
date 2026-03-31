//Try to load maze.txt and parse it into a 2D array of characters, catch errors if load fails
async function loadMaze(){
    try{
        const response = await fetch('./maze.txt');
        if(!response.ok){
            throw new Error(`Could not load maze.txt: ${response.status}`);
        }

        const theMaze = await response.text();

        return theMaze.trimEnd().split(/\r?\n/).map(line =>[...line]);
    }catch(error){
        console.error('Maze load failed:', error);
        return null;
    }
}
//function to turn 2d array into usable pre block string
function printMaze(theMaze){
    let block = '';
    let row =0;
    let col = 0;
    for(row=0; row<theMaze.length; row++){
        for(col=0; col < theMaze[row].length; col ++){
            block += theMaze[row][col]
        }
        if(row < theMaze.length -1){
            block += '\n';
        }
    }
    return block;
}
//function to get start pos, end pos, and overall size of maze
function analyzeMaze(theMaze){
    let totalRows = theMaze.length-1;
    let totalColumns = theMaze[0].length-1;
    let startPos= [];
    let endPos =[];
    for(let row=0; row<theMaze.length; row++){
        for(let col=0; col <theMaze[row].length;col ++){
            if(theMaze[row][col]=="S"){
                startPos=[row,col];
            }
            if(theMaze[row][col]=="F"){
                endPos=[row,col];
            }
        }
    }
    return {totalRows,totalColumns,startPos,endPos};
}

//function Conduct BFS
function bfs(theMaze,startPos,totalRows,totalColumns){
    let allRows=totalRows;
    let allCols=totalColumns;
    //This is the queue as an array to process all cells in the maze
    let queue=[[startPos[0],startPos[1],[startPos[0],startPos[1]]]]
    let visited =[];
    
}