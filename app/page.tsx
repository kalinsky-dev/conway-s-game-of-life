'use client';

import { useState, useRef, useEffect, useCallback, MouseEvent } from 'react';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  GRID_SIZE,
  NUMBER_OF_ROWS,
  NUMBER_OF_COLUMNS,
  DIRECTIONS,
  COLORS,
  createEmptyBoard,
  Board,
} from './utils/utils';

export default function ConwayGameOfLife() {
  const emptyBoard = createEmptyBoard();

  const [boardState, setBoardState] = useState<Board>(emptyBoard);
  const [prevBoardState, setPrevBoardState] = useState<Board>(emptyBoard);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);
  const [hasPreviousState, setHasPreviousState] = useState(false);

  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const playingRef = useRef(isPlaying);
  playingRef.current = isPlaying;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Calculate population whenever board state changes
  useEffect(() => {
    let aliveCount = 0;
    for (const row of boardState) {
      for (const cell of row) {
        if (cell === 1) aliveCount++;
      }
    }
    setPopulation(aliveCount);
  }, [boardState]);

  // Cleanup `setTimeout` on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (playingRef.current) return; // Prevent editing while playing

    const x = Math.floor(e.nativeEvent.offsetX / GRID_SIZE);
    const y = Math.floor(e.nativeEvent.offsetY / GRID_SIZE);

    const updatedBoardState = [...boardState];
    if (updatedBoardState[x][y] === 0) {
      updatedBoardState[x][y] = 1;
    } else {
      updatedBoardState[x][y] = 0;
    }
    setBoardState(updatedBoardState);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      playingRef.current = true;
      calculateNextGeneration();
    }
  };

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

  const calculateNextGenerationOnce = () => {
    setBoardState((prevState) => {
      const prevBoard = prevState.map((row) => [...row]);
      setPrevBoardState(prevBoard);
      setHasPreviousState(true);
      return calculateNextBoardState(prevState);
    });
    setGeneration((prev) => prev + 1);
  };

  const calculateNextGeneration = useCallback(() => {
    if (!playingRef.current) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    setBoardState((prevState) => {
      const prevBoard = prevState.map((row) => [...row]);
      setPrevBoardState(prevBoard);
      setHasPreviousState(true);
      return calculateNextBoardState(prevState);
    });
    setGeneration((prev) => prev + 1);
    timeoutRef.current = setTimeout(calculateNextGeneration, 100);
  }, [setBoardState, setPrevBoardState]);

  const calculatePreviousGeneration = () => {
    if (!hasPreviousState) return;
    setBoardState(prevBoardState);
    setGeneration((prev) => Math.max(0, prev - 1));
    setHasPreviousState(false);
  };

  const resetBoard = () => {
    setBoardState(createEmptyBoard());
    setPrevBoardState(createEmptyBoard());
    setGeneration(0);
    setHasPreviousState(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Stop the loop when resetting
    }
  };

  return (
    <section className='flex flex-col items-center'>
      <h1 className='text-3xl font-serif my-4'>Conway&apos;s Game of Life</h1>

      <section className='flex gap-6 mb-4 text-lg font-semibold'>
        <div className='bg-blue-100 px-4 py-2 rounded-lg border'>
          <span className='text-blue-700'>Generation: </span>
          <span className='text-blue-900'>{generation}</span>
        </div>
        <div className='bg-green-100 px-4 py-2 rounded-lg border'>
          <span className='text-green-700'>Population: </span>
          <span className='text-green-900'>{population}</span>
        </div>
      </section>

      <section className='flex gap-4 mb-4'>
        <button
          className={`px-4 py-2 rounded transition-colors ${
            !hasPreviousState
              ? 'bg-red-500 text-white cursor-not-allowed opacity-75'
              : 'bg-gray-500 text-white hover:cursor-pointer hover:bg-gray-700'
          }`}
          onClick={calculatePreviousGeneration}
          disabled={!hasPreviousState}
        >
          Previous
        </button>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer'
          onClick={calculateNextGenerationOnce}
        >
          Next
        </button>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 hover:cursor-pointer'
          onClick={resetBoard}
        >
          Reset
        </button>
        <button
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 hover:cursor-pointer'
          onClick={handlePlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </section>

      <canvas
        onClick={handleCanvasClick}
        className='border border-green-500'
        ref={canvasRef}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
      ></canvas>
    </section>
  );
}
