'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

type Board = number[][];

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 800;
const GRID_SIZE = 20;
const NUMBER_OF_ROWS = BOARD_HEIGHT / GRID_SIZE;
const NUMBER_OF_COLUMNS = BOARD_WIDTH / GRID_SIZE;

const COLORS = ['black', 'white'] as const;

export const DIRECTIONS = [
  [0, 1], // Right
  [1, 1], // Down-Right
  [1, 0], // Down
  [1, -1], // Down-Left
  [0, -1], // Left
  [-1, -1], // Up-Left
  [-1, 0], // Up
  [-1, 1], // Up-Right
];

function createEmptyBoard(): Board {
  return Array.from({ length: NUMBER_OF_ROWS }, () =>
    Array.from({ length: NUMBER_OF_COLUMNS }, () => 0)
  );
}

export default function Home() {
  const emptyBoard = createEmptyBoard();
  const [boardState, setBoardState] = useState<Board>(emptyBoard);
  const [prevBoardState, setPrevBoardState] = useState<Board>(emptyBoard);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;

  // console.log('Initial board state:', boardState);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    ctx2d.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    ctx2d.strokeStyle = 'white';
    ctx2d.lineWidth = 0.1;

    for (let row = 0; row < NUMBER_OF_ROWS; row++) {
      for (let column = 0; column < NUMBER_OF_COLUMNS; column++) {
        ctx2d.fillStyle = COLORS[boardState[row][column]];

        ctx2d.fillRect(
          Math.floor((BOARD_WIDTH / NUMBER_OF_COLUMNS) * row),
          Math.floor((BOARD_HEIGHT / NUMBER_OF_ROWS) * column),
          GRID_SIZE,
          GRID_SIZE
        );

        ctx2d.strokeRect(
          Math.floor((BOARD_WIDTH / NUMBER_OF_ROWS) * row),
          Math.floor((BOARD_HEIGHT / NUMBER_OF_COLUMNS) * column),
          GRID_SIZE,
          GRID_SIZE
        );
      }
    }
  }, [boardState, canvasRef]);

  const calculateNextBoardState = (prevState: Board): Board => {
    const newBoardState = prevState.map((row) => [...row]);

    for (let row = 0; row < NUMBER_OF_ROWS; row++) {
      for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
        let liveNeighbors = 0;

        // Check all neighboring cells
        DIRECTIONS.forEach(([directionX, directionY]) => {
          const neighborRow = row + directionX;
          const neighborCol = col + directionY;

          // Ensure the neighbor is within grid bounds
          if (
            neighborRow >= 0 &&
            neighborRow < NUMBER_OF_ROWS &&
            neighborCol >= 0 &&
            neighborCol < NUMBER_OF_COLUMNS
          ) {
            liveNeighbors += prevState[neighborRow][neighborCol] ? 1 : 0;
          }
        });

        // Apply Conway's Game of Life rules
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          newBoardState[row][col] = 0;
        } else if (prevState[row][col] === 0 && liveNeighbors === 3) {
          newBoardState[row][col] = 1;
        }
      }
    }

    return newBoardState;
  };

  const calculateNextGeneration = useCallback(() => {
    if (!playingRef.current) {
      return;
    }
    setBoardState((prevState) => {
      const prevBoard = prevState.map((row) => [...row]);
      setPrevBoardState(prevBoard);
      return calculateNextBoardState(prevState);
    });
    setTimeout(calculateNextGeneration, 100);
  }, [setBoardState, setPrevBoardState]);

  const calculateNextGenerationOnce = useCallback(() => {
    setBoardState((prevState) => {
      const prevBoard = prevState.map((row) => [...row]);
      setPrevBoardState(prevBoard);
      return calculateNextBoardState(prevState);
    });
  }, [setBoardState, setPrevBoardState]);

  function calculatePreviousGeneration() {
    setBoardState(prevBoardState);
  }

  function resetBoard() {
    setBoardState(createEmptyBoard());
    setPrevBoardState(createEmptyBoard());
  }

  return (
    <section className=' flex flex-col items-center'>
      <h1 className='text-3xl font-serif my-4'>Conway&apos;s Game of Life</h1>
      <section className='flex gap-4 mb-4'>
        <button
          className='bg-gray-500 text-white px-4 py-2 rounded'
          onClick={calculatePreviousGeneration}
        >
          Previous
        </button>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={() => calculateNextGenerationOnce()}
        >
          Next
        </button>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded'
          onClick={resetBoard}
        >
          Reset
        </button>
        <button
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (!isPlaying) {
              playingRef.current = true;
              calculateNextGeneration();
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </section>

      <canvas
        onClick={(e) => {
          const x = Math.floor(e.nativeEvent.offsetX / GRID_SIZE);
          const y = Math.floor(e.nativeEvent.offsetY / GRID_SIZE);

          const updatedBoardState = [...boardState];
          if (updatedBoardState[x][y] === 0) {
            updatedBoardState[x][y] = 1;
          } else {
            updatedBoardState[x][y] = 0;
          }
          setBoardState(updatedBoardState);
        }}
        className='border border-green-500'
        ref={canvasRef}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
      ></canvas>
    </section>
  );
}
