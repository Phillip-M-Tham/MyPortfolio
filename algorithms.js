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
//function to print out solution
function setSolution(theMaze,theSolution){
    let html="";
    for(let row=0; row< theMaze.length;row++){
         for(let col=0;col <theMaze[row].length;col++){
            let curSpot= theMaze[row][col]
            
            if(theSolution.some(function(solutionSpot){
                return solutionSpot[0]===row && solutionSpot[1]===col;
            }))
            {//if row column is in the solution path, append to html with green characters
                if(curSpot=="0"){
                    html += `<span style="color:green";>x</span>`
                }else{
                    html += `<span style="color:green";>${curSpot}</span>`    
                }
            }else{//cur spot is not part of the solution path
                html += curSpot;
            }
         }
         html += "\n";
    }
    return html
}

//function Conduct BFS
function bfs(theMaze,startPos,totalRows,totalColumns){
    let allRows=totalRows;
    let allCols=totalColumns;
    let tempRow =0;
    let tempCol =0;
    //This is the queue as an array to process all cells in the maze
    let queue=[
        [startPos[0],startPos[1],[[startPos[0],startPos[1]]]]
    ]
    let visited =[];
    //while queue is not empty run this while loop
    while(queue.length > 0){
        let [curRow,curCol,path] = queue.shift(); //sets curRow,curCol and path to first item in Queue and removes first item in the queue
        //Check if current spot is the goal
        if(theMaze[curRow][curCol] ==="F"){
            return path;
        }
        //visited.push([curRow,curCol]); //update visited array with current coordinates

        //check directions up, left, down , right
            //check boundaries first
                //check if you reached the goal
                    //check if its a valid spot
                        //check if it already visited
        //up (5,5) -> (4,5)
        tempRow= curRow -1;
        tempCol= curCol;
        if(tempRow >=0){
            let newPath = [...path, [tempRow,tempCol]]
            if(theMaze[tempRow][tempCol]==="F"){
                return newPath;
            }
            if(theMaze[tempRow][tempCol]==="0"){
                if(!visited.some(function(visitedCoordinate){
                    return visitedCoordinate[0]===tempRow && visitedCoordinate[1]===tempCol;
                })){
                    visited.push([tempRow,tempCol]);
                    queue.push([tempRow, tempCol, newPath]);
                }            
            }
        }
        //left (5,5) -> (5,4)
        tempRow=curRow;
        tempCol=curCol -1;
        if(tempCol >=0){
            let newPath= [...path, [tempRow,tempCol]]
            if(theMaze[tempRow][tempCol]==="F"){
                return newPath;
            }
            if(theMaze[tempRow][tempCol]==="0"){
                if(!visited.some(function(visitedCoordinate){
                    return visitedCoordinate[0]===tempRow && visitedCoordinate[1]===tempCol;
                })){
                    visited.push([tempRow,tempCol]);
                    queue.push([tempRow,tempCol,newPath]);
                }
            }
        }
        //check down (5,5) -> (6,5)
        tempRow=curRow+1;
        tempCol=curCol;
        if(tempRow <= allRows){
            let newPath= [...path, [tempRow,tempCol]]
            if(theMaze[tempRow][tempCol]==="F"){
                return newPath;
            }
            if(theMaze[tempRow][tempCol]==="0"){
                if(!visited.some(function(visitedCoordinate){
                    return visitedCoordinate[0]===tempRow && visitedCoordinate[1]===tempCol;
                })){
                    visited.push([tempRow,tempCol]);
                    queue.push([tempRow,tempCol,newPath]);
                }
            }
        }
        //check right (5,5) -> (5,6)
        tempRow=curRow;
        tempCol=curCol +1;
        if(tempCol <= allCols){
            let newPath=[...path, [tempRow,tempCol]]
            if(theMaze[tempRow][tempCol]==="F"){
                return newPath;
            }
            if(theMaze[tempRow][tempCol]==="0"){
                if(!visited.some(function(visitedCoordinate){
                    return visitedCoordinate[0]===tempRow && visitedCoordinate[1]===tempCol;
                })){
                    visited.push([tempRow,tempCol]);
                    queue.push([tempRow,tempCol,newPath]);
                }
            }
        }
    }
    return null;
}

//function Conduct DFS
function dfs(theMaze,curRow,curCol,dfsPath,dfsVisited){
    //set up base cases
    //check booundaries
    if(curRow <0 || curRow >= theMaze.length || curCol <0 || curCol >= theMaze[0].length){
        return null;
    }
    //check if its a wall
    if(theMaze[curRow][curCol]==="1"){
        return null;
    }
    //update path
    let newPath = [...dfsPath, [curRow,curCol]]
    //check if its the goal
    if(theMaze[curRow][curCol]==="F"){
        return newPath;
    }
    //check if its already visited
    if(dfsVisited.some(function(visitedSpots){
        return visitedSpots[0]===curRow && visitedSpots[1]===curCol;
    })){
        return null;
    }
    //update visited
    dfsVisited.push([curRow,curCol]);
    //check right
    let rightPath = dfs(theMaze,curRow,curCol+1,newPath,dfsVisited);
    if(rightPath !== null){
        return rightPath;
    }
    //check down
    let downPath = dfs(theMaze,curRow+1,curCol,newPath,dfsVisited);
    if(downPath !== null){
        return downPath;
    }
    //check left
    let leftPath = dfs(theMaze,curRow,curCol-1,newPath,dfsVisited);
    if(leftPath !== null){
        return leftPath;
    }
    //check up
    let upPath = dfs(theMaze,curRow-1,curCol,newPath,dfsVisited);
    if(upPath !== null){
        return upPath;
    }
    return null;
}