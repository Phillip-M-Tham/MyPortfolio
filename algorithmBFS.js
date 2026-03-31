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