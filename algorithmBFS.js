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
function printMaze(maze){
    let block = '';
    let row =0;
    let col = 0;
    for(row=0; row<maze.length; row++){
        for(col=0; col < maze[row].length; col ++){
            block += maze[row][col]
        }
        if(row < maze.length -1){
            block += '\n';
        }
    }
    return block;
}