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
//function to set up random scatter of weights for Dijkstra's algorithm
function setWeights(theMaze){
    for(let row=0; row < theMaze.length; row++){
        for(let col=0; col< theMaze[row].length; col++){
            if(theMaze[row][col]==="0"){
                let randomIndex = Math.floor(Math.random() *3);
                if(randomIndex ===0){
                    theMaze[row][col]="0";
                }else if(randomIndex ===1){
                    theMaze[row][col]="3";
                }else{
                    theMaze[row][col]="4";
                }
            }
        }
    }
    return theMaze;
}
//set distance tracker and previous node tracker for Dijkstra's algorithm
function setGrids(theMaze){
    prevGrid=[];
    distGrid=[];
    for(let row=0; row< theMaze.length; row++){
        prevGrid[row]=[];
        distGrid[row]=[];
        for(let col=0; col < theMaze[row].length; col++){
            prevGrid[row][col]=null;
            distGrid[row][col]=Infinity;
        }
    }
    return {prevGrid,distGrid};
}
//get tile cost
function getCost(theMaze,row,col){
    const dict = new Map();
    dict.set("0",1);
    dict.set("3",3);
    dict.set("4",4);
    if(theMaze[row][col]==="0" || theMaze[row][col]==="F"){
        return dict.get("0");
    }else if(theMaze[row][col]==="3"){
        return dict.get("3");
    }else if(theMaze[row][col]==="4"){
        return dict.get("4");
    }else{
        //Error handling
        console.error(`Invalid tile type at (${row},${col}): ${theMaze[row][col]}`);
        return Infinity; // Treat invalid tiles as impassable
    }
}
//set up priority queue for Dijkstra's algorithm
class minHeap{
    //each item in heap is [cost, row, col] for each tile in the maze
    constructor(){
        this.heap=[];
    }
    push(val){
        this.heap.push(val);
        this.bubbleUp();
    }
    pop(){
        if(this.heap.length===1) return this.heap.pop();
        const min = this.heap[0];
        this.heap[0]= this.heap.pop();
        this.bubbleDown();
        return min;
    }
    peek(){
        return this.heap[0];
    }
    bubbleUp(){
        //set index to last item in heap
        let index = this.heap.length -1;
        while(index >0){
            let parentIndex = Math.floor((index -1)/2);
            if(this.heap[parentIndex][0] <= this.heap[index][0]){
                break;
            }
            //swap parent and current index
            [this.heap[parentIndex],this.heap[index]]=[this.heap[index],this.heap[parentIndex]];
            index= parentIndex;
        }
    }
    bubbleDown(){
        let index=0;
        while(index < this.heap.length){
            let leftChildIndex = 2*index +1;
            let rightChildIndex = 2*index +2;
            let smallestIndex = index;
            //check if left child exists in heap
            if(leftChildIndex < this.heap.length){
                //check if left child is smaller than current smallest
                if(this.heap[leftChildIndex][0] < this.heap[smallestIndex][0]){
                    smallestIndex = leftChildIndex;
                }
            }
            //check if right child exists in heap
            if(rightChildIndex < this.heap.length){
                //check if right child is smaller than current smallest
                if(this.heap[rightChildIndex][0] < this.heap[smallestIndex][0]){
                    smallestIndex = rightChildIndex;
                }
            }
            //stop if smallest index is current index
            if(smallestIndex === index){
                break;
            }
            //swap smallest index with current index
            [this.heap[index],this.heap[smallestIndex]]=[this.heap[smallestIndex],this.heap[index]];
            index=smallestIndex;
        }
    }
}
//function to conduct Dijkstra's algorithm
function dijkstra(theMaze,startPos){
    let {prevGrid,distGrid}= setGrids(theMaze);
    let heap = new minHeap();
    let startCost=0;
    distGrid[startPos[0]][startPos[1]]= startCost;
    heap.push([startCost,startPos[0],startPos[1]]);
    while(heap.heap.length > 0){
        let [curCost,curRow,curCol] = heap.pop();
        console.log("POP:", curCost, curRow, curCol, theMaze[curRow][curCol]);
        //check if we reached the goal
        if(theMaze[curRow][curCol]==="F"){
            return [curCost, prevGrid];
        }
        //check directions up (5,5)-> (4,5), left (5,5) -> (5,4), down (5,5) -> (6,5) , right (5,5) -> (5,6)
        for(let [deltaRow,deltaCol] of [[-1,0],[0,-1],[1,0],[0,1]]){
            let tempRow = curRow + deltaRow;
            let tempCol = curCol + deltaCol;
            let tempCost =0;
            let tileCost=0;
            //boundary check
            if(0 <= tempRow && tempRow < theMaze.length && 0 <= tempCol && tempCol < theMaze[0].length){
                //valid path check
                if(theMaze[tempRow][tempCol]==="F"){
                    //set tempCost for reaching goal
                    tileCost = getCost(theMaze,tempRow,tempCol);
                    tempCost= curCost + tileCost;
                }else if(theMaze[tempRow][tempCol]==="0"){
                    //set tempCost for reaching valid spot 0
                    tileCost = getCost(theMaze,tempRow,tempCol);
                    tempCost= curCost + tileCost;
                }else if(theMaze[tempRow][tempCol]==="3"){
                    //set tempCost for reaching valid spot 3
                    tileCost = getCost(theMaze,tempRow,tempCol);
                    tempCost= curCost + tileCost;
                }else if(theMaze[tempRow][tempCol]==="4"){
                    //set tempCost for reaching valid spot 4
                    tileCost = getCost(theMaze,tempRow,tempCol);
                    tempCost= curCost + tileCost;
                }else{
                    //we reached a wall skip this iteration
                    continue;
                }
                //check if we found a cheaper path to the neighboring tile
                if(tempCost < distGrid[tempRow][tempCol]){
                    //update distance grid with new cheaper cost
                    distGrid[tempRow][tempCol]= tempCost;
                    //update previous node grid with current node
                    prevGrid[tempRow][tempCol]=[curRow,curCol];
                    //update heap with new cost and neighboring tile coordinates
                    heap.push([tempCost,tempRow,tempCol]);
                }
            }
        }
    }
    return [null, null];
}
//function to reconstruct path from Dijkstra's algorithm
function reconstructPath(prevGrid,endPos){
    let curPos = endPos;
    let path = [];
    while(curPos !== null){
        path.push(curPos);
        curPos = prevGrid[curPos[0]][curPos[1]];
    }
    path.reverse();
    return path;
}