const canvas = document.getElementById("Umbrella");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t=0;
let umbrellaRotation= 0; //initial rotation angle in radians

function drawBaseLighting() {
    const pulse = (Math.sin(t) +1)/2; // 0 to 1

    //backgorund
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //global red wash
    ctx.fillStyle = "rgba(255,0,0,0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //dynamic center
    const cx = canvas.width/2 + Math.sin(t*0.5)*100; // oscillate horizontally
    const cy = canvas.height/2 + Math.cos(t*0.3)*60; // oscillate vertically

    const maxRadius = Math.max(canvas.width, canvas.height);
    const radius = maxRadius * (0.6 + pulse * 0.4);

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

    gradient.addColorStop(0, `rgba(255,0,0,${0.8 + pulse * 0.2})`);
    gradient.addColorStop(0.4, 'rgba(255,0,0,0.5)');
    gradient.addColorStop(1, 'rgba(255,0,0,0.25)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function drawGrid(){
    const spacing = 80;//pixels between lines
    ctx.strokeStyle = "rgba(255,0,0,0.15)";
    ctx.lineWidth = 1;

    //vertical lines
    for( let x=0; x< canvas.width;  x += spacing){
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    //horizontal lines
    for(let y=0; y<canvas.height; y+= spacing){
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }    
}

function drawUmbrella(cx, cy, radius, angle){
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle); //spinning effect

    for(let i=0; i<8; i++){
        ctx.beginPath();
        ctx.moveTo(0,0);
        const startAngle= (i * Math.PI/4); // 8 segments for 360 degrees
        const endAngle= startAngle + Math.PI/4;
        const midAngle= (startAngle + endAngle)/2;

        //first edge
        const x1 = radius * Math.cos(startAngle);
        const y1 = radius * Math.sin(startAngle);
        ctx.lineTo(x1,y1);
       
        //second edge
        const x2= radius * Math.cos(endAngle);
        const y2= radius * Math.sin(endAngle);

        //control point for curve (pulling towards center for a dome shape)
        const curveRadius = radius * .85; // how much the curve pulls outward
        const cxCurve=curveRadius * Math.cos(midAngle);
        const cyCurve=curveRadius * Math.sin(midAngle);

        //draw curve
        ctx.quadraticCurveTo(cxCurve, cyCurve, x2, y2);
        ctx.closePath();

        const gradient = ctx.createRadialGradient(0, 0, radius*0.1, 0, 0, radius); //inner glow and outter edge
        if ( i % 2 === 0) {
            gradient.addColorStop(0, 'rgba(255, 80, 80, 0.8)'); // bright red center
            gradient.addColorStop(1, 'rgba(120, 0, 0, 0.4)'); // darker red edges
        } else {
            gradient.addColorStop(0, 'rgba(255,255,255,0.4)');
            gradient.addColorStop(1, 'rgba(200,200,200,0.2)');
        }
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,.06)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    ctx.restore();
}

function drawVignette(){
    const vignette = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);//center radius to edge

    vignette.addColorStop(0, 'rgba(0,0,0,0)'); //center is transparent
    vignette.addColorStop(1, 'rgba(0,0,0,0.6)'); // subtle darkening

    ctx.save();
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

}

function glow(){
    t+= 0.03;
    umbrellaRotation += 0.005; //rotate umbrella over time
    drawBaseLighting();
    drawGrid();
    drawUmbrella(canvas.width/2, canvas.height/2, 300, umbrellaRotation);
    drawVignette();
    requestAnimationFrame(glow);
}

glow();

//update dynamically when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
//EXPANDING TERMINAL CONTENT
//BFS button setup
const terminalContent= document.getElementById('UmbrellaTerminalContent');
const bfsButton= document.querySelector('[data-algo="bfs"]');
//DFS button setup
const dfsButton= document.querySelector('[data-algo="dfs"]');
//Dijkstra button setup
const dijkstraButton= document.querySelector('[data-algo="dijkstra"]');
let activeAlgorithm = null; // Track the currently active algorithm

bfsButton.addEventListener('click', async() => {
    //collapse terminal and load defualt
    if(activeAlgorithm === 'bfs'){
        terminalContent.classList.remove('expanded');
        terminalContent.innerHTML = `
           <p>> Awaiting algorithm selection...</p>
        `;
        activeAlgorithm = null; // Reset active algorithm
        return;
    }
    activeAlgorithm = 'bfs'; // Set BFS as the active algorithm
    terminalContent.classList.add('expanded');
    terminalContent.innerHTML = `
        <p>> Loading Breadth First Search...</p>
        <p>> Breadth First Search (BFS) is an algorithm that visits each node level by level from a specified starting point. This requires a queue that conducts First In First Out(FIFO), a list for visited nodes, and a method to track a valid path. This is designed to find the shortest path. </p>
    `;

    const myMaze = await loadMaze();
    //ERROR HANDLING
    if(!myMaze){
        const errorLine = document.createElement('p');
        errorLine.textContent = '> Error: Failed to load maze.txt';
        terminalContent.appendChild(errorLine);
        return;
    }

    //DISPLAY MAZE IN TERMINAL
    const mazeBlock = document.createElement('pre');
    mazeBlock.textContent = printMaze(myMaze);
    terminalContent.appendChild(mazeBlock);
    //center the maze
    mazeBlock.style.textAlign="center"
    //Analyze maze
    const analyzeMazeBlock = document.createElement('p');
    const {totalRows,totalColumns,startPos,endPos} =analyzeMaze(myMaze);
    analyzeMazeBlock.innerHTML= `
        > Analyzing maze...<br>
        > Map Key: 1=walls, 0=valid spot, S=Starting Position, F =End Position<br>
        > Total size of maze: ${totalRows} x ${totalColumns}<br>
        > Starting Position: ${startPos}<br>
        > End Position: ${endPos}<br>
    `;
    terminalContent.appendChild(analyzeMazeBlock);
    //Find Valid solution using BFS
    const statusUpdate = document.createElement('p');
    statusUpdate.textContent='> Generating Valid Path...'
    terminalContent.appendChild(statusUpdate);
    const validPath= document.createElement('p');
    const bfsPath= bfs(myMaze,startPos,totalRows,totalColumns);
    validPath.textContent= JSON.stringify(bfsPath);
    terminalContent.appendChild(validPath);
    //Analyze Solution
    let totalSteps= bfsPath.length;
    const analyzeSolution=document.createElement('p');
    analyzeSolution.innerHTML=`
        > Analyzing Solution...<br>
        > Solution found in ${totalSteps} steps <br>
        > printing solution path<br>
    `;
    terminalContent.appendChild(analyzeSolution);
    //printing solution
    const printedSolution=document.createElement('p');
    printedSolution.innerHTML=setSolution(myMaze,bfsPath);
    terminalContent.appendChild(printedSolution);
    //Center solution
    printedSolution.style.textAlign="center";
});

dfsButton.addEventListener('click', async() => {
    //collapse terminal and load defualt
    if(activeAlgorithm === 'dfs'){
        terminalContent.classList.remove('expanded');
        terminalContent.innerHTML = `
           <p>> Awaiting algorithm selection...</p>
        `;
        activeAlgorithm = null; // Reset active algorithm
        return;
    }
    activeAlgorithm = 'dfs'; // Set DFS as the active algorithm
    terminalContent.classList.add('expanded');
    terminalContent.innerHTML = `
        <p>> Loading Depth First Search...</p>
        <p>> Depth First Search (DFS) is an algorithm that explores as far as possible along each path before backtracking. This requires a stack that conducts Last In First Out(LIFO), a list for visited nodes, and a method to track a valid path. This is not designed to find the shortest path, but can be more memory efficient than BFS in certain cases. </p>
    `;
    const myMaze = await loadMaze();
    //ERROR HANDLING
    if(!myMaze){
        const errorLine = document.createElement('p');
        errorLine.textContent = '> Error: Failed to load maze.txt';
        terminalContent.appendChild(errorLine);
        return;
    }
    //DISPLAY MAZE IN TERMINAL
    const mazeBlock = document.createElement('pre');
    mazeBlock.textContent = printMaze(myMaze);
    terminalContent.appendChild(mazeBlock);
    //center the maze
    mazeBlock.style.textAlign="center";
    //Analyze maze
    const analyzeMazeBlock = document.createElement('p');
    const {totalRows,totalColumns,startPos,endPos} =analyzeMaze(myMaze);
    analyzeMazeBlock.innerHTML= `
        > Analyzing maze...<br>
        > Map Key: 1=walls, 0=valid spot, S=Starting Position, F =End Position<br>
        > Total size of maze: ${totalRows} x ${totalColumns}<br>
        > Starting Position: ${startPos}<br>
        > End Position: ${endPos}<br>
    `;
    terminalContent.appendChild(analyzeMazeBlock);
    //find valid solution using DFS
    const statusUpdate = document.createElement('p');
    statusUpdate.textContent='> Generating Valid Path...'
    terminalContent.appendChild(statusUpdate);
    //set up variables for recursionDFS
    let visitedDFS = [];
    let path = [];
    const validPath = document.createElement('p');
    const dfsPath= dfs(myMaze,startPos[0],startPos[1],path,visitedDFS);
    //console.log('DFS result:', dfsPath);
    validPath.textContent= JSON.stringify(dfsPath);
    terminalContent.appendChild(validPath);
    //Analyze Solution
    let totalSteps= dfsPath.length;
    const analyzeSolution=document.createElement('p');
    analyzeSolution.innerHTML=`
        > Analyzing Solution...<br>
        > Solution found in ${totalSteps} steps <br>
        > printing solution path<br>
    `;
    terminalContent.appendChild(analyzeSolution);
    //printing solution
    const printedSolution=document.createElement('p');
    printedSolution.innerHTML=setSolution(myMaze,dfsPath);
    terminalContent.appendChild(printedSolution);
    //center solution
    printedSolution.style.textAlign="center";
});

dijkstraButton.addEventListener('click', async() => {
    //collapse terminal and load defualt
    if(activeAlgorithm === 'dijkstra'){
        terminalContent.classList.remove('expanded');
        terminalContent.innerHTML = `
           <p>> Awaiting algorithm selection...</p>
        `;
        activeAlgorithm = null; // Reset active algorithm
        return;
    }
    activeAlgorithm = 'dijkstra'; // Set Dijkstra as the active algorithm
    terminalContent.classList.add('expanded');
    terminalContent.innerHTML = `
        <p>> Loading Dijkstra's Algorithm...</p>
        <p>> Dijkstra's Algorithm is an algorithm to find the cheapest cost in a weighted system. It uses a priority queue to explore nodes based on the lowest cumulative cost from the starting point. The priority queue can be implemented using a min-heap in order to sort the cheapest node as the next node to explore. </p>
    `;
    //set up maze
    let myMaze = await loadMaze();
    //ERROR HANDLING
    if(!myMaze){
        const errorLine = document.createElement('p');
        errorLine.textContent = '> Error: Failed to load maze.txt';
        terminalContent.appendChild(errorLine);
        return;
    }
    //scatter weights
    myMaze = setWeights(myMaze);
    //DISPLAY MAZE IN TERMINAL
    const mazeBlock = document.createElement('pre');
    mazeBlock.textContent = printMaze(myMaze);
    terminalContent.appendChild(mazeBlock);
    //center the maze
    mazeBlock.style.textAlign="center";
    //Analyze maze
    const analyzeMazeBlock = document.createElement('p');
    const {totalRows,totalColumns,startPos,endPos} =analyzeMaze(myMaze);
    analyzeMazeBlock.innerHTML= `
        > Analyzing maze...<br>
        > Map Key: 1=walls, 0=valid spot with cost of 1, 3=valid spot with cost of 3, 4=valid spot with cost of 4,  S=Starting Position, F =End Position<br>
        > Total size of maze: ${totalRows} x ${totalColumns}<br>
        > Starting Position: ${startPos}<br>
        > End Position: ${endPos}<br>
    `;
    terminalContent.appendChild(analyzeMazeBlock);
    //find valid solution using Dijkstra's Algorithm
    const statusUpdate = document.createElement('p');
    statusUpdate.textContent='> Generating Valid Path...'
    terminalContent.appendChild(statusUpdate);
    const validPath = document.createElement('p');
    const [cost,prevGrid] = dijkstra(myMaze,startPos);
    console.log('Dijkstra result:', cost);
    //error handling for no solution
    if(!cost){
        validPath.textContent = 'No valid path found';
        terminalContent.appendChild(validPath);
        return;
    }else{
        const dijkstraPath = reconstructPath(prevGrid, endPos);
        validPath.textContent= JSON.stringify(dijkstraPath);
        terminalContent.appendChild(validPath);
        //Analyze Solution
        let totalSteps= dijkstraPath.length;
        const analyzeSolution=document.createElement('p');
        analyzeSolution.innerHTML=`
            > Analyzing Solution...<br>
            > Solution found in ${totalSteps} steps with total cost of ${cost} <br>
            > printing solution path<br>
        `;
        terminalContent.appendChild(analyzeSolution);
        //printing solution
        const printedSolution=document.createElement('p');
        printedSolution.innerHTML=setSolution(myMaze,dijkstraPath);
        terminalContent.appendChild(printedSolution);
        //center solution
        printedSolution.style.textAlign="center";
    }
});