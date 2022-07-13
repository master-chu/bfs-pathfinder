# BFS Pathfinder Visualization

```bash
# First time
npm i

# Start app
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

![Screenshot](/screenshot.png?raw=true "Screenshot")


## Explanation of algorithm
This algorithm finds the shortest path between two points on a grid. 

* It avoids obstructions (denoted by a `1` in the grid)
* It cannot move diagonally; it can only look up, down, left, and right
* For two equidistant paths, it will prefer to start moving in the direction of the destination; this is to make the trajectory look more natural, since it will be used by enemies pursuing the player. 
### Steps
The algorithm keeps track of two accumulators:
* The history of visited tiles; this ensures we only search a tile once, and prevents cyclic loops.
* A queue of tiles to be searched; this is what allows us to search in a breadth-first manner. By queueing tiles in the order we discover them, we ensure that we never search too far down any particular path until we've searched the local surrouding area.
    * Additionally, each tile in the queue tracks its own history of which tiles were traversed to reach it. This allows us to return the full path back to the start point once we discover the end tile.

The steps are as follows:
* Check the tile at the front of the queue
    * If this is the end tile, we're done. The path of visted tiles we've accumulated is our solution.
* Look up, down, left, and right at all 4 neighbor tiles
* For each neighbor:
    * If the space is traversible, and we haven't visited it yet, then add it to the end of our queue
* Repeat

## Available Scripts

In the project directory, you can run:

### `npm start`


The page will reload if you make edits.\
You will also see any lint errors in the console.

## Learn More

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
