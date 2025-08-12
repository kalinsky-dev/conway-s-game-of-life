
# Conway's Game of Life

A React-based implementation of Conway's Game of Life cellular automaton built with Next.js and TypeScript.

## Features

- **Interactive Grid**: Click cells to toggle between alive/dead states
- **Playback Controls**: Play/Pause, Next, Previous, and Reset buttons
- **Real-time Statistics**: Live generation counter and population display
- **Canvas Rendering**: Smooth HTML5 canvas visualization with grid lines
- **Responsive Design**: Clean UI built with Tailwind CSS

## Game Rules

- Any live cell with fewer than two live neighbors dies (underpopulation)
- Any live cell with two or three live neighbors survives
- Any live cell with more than three live neighbors dies (overpopulation)
- Any dead cell with exactly three live neighbors becomes alive (reproduction)

## Tech Stack

- **Framework**: Next.js 15, React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: HTML5 Canvas API
- **State Management**: React Hooks (useState, useEffect, useCallback, useRef)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```
Open http://localhost:3000 to play with the Game of Life!

## Controls
* Click: Toggle cell state
* Play/Pause: Start/stop automatic generation
* Next: Advance one generation
* Previous: Go back one generation
* Reset: Clear the board

## Demo
Create interesting patterns and watch them evolve according to Conway's rules.


<img width="906" height="1062" alt="CGofLife" src="https://github.com/user-attachments/assets/7cbf641a-13f0-4537-a929-c8fbb210de91" />
