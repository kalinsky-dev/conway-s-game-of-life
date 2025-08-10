'use client';

import { useState, useRef, useEffect } from 'react';

type Board = number[][];

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 800;
const GRID_SIZE = 20;
const NUMBER_OF_ROWS = BOARD_HEIGHT / GRID_SIZE;
const NUMBER_OF_COLUMNS = BOARD_WIDTH / GRID_SIZE;

const COLORS = ['black', 'white'] as const;

function createEmptyBoard(): Board {
  return Array.from({ length: NUMBER_OF_ROWS }, () =>
    Array.from({ length: NUMBER_OF_COLUMNS }, () => 0)
  );
}

export default function Home() {
  const emptyBoard = createEmptyBoard();
  const [boardState, setBoardState] = useState<Board>(emptyBoard);
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

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

  return (
    <section className=' flex flex-col items-center'>
      <h1 className='text-3xl font-serif my-4'>Conway&apos;s Game of Life</h1>
      <canvas
        className='border border-green-500'
        ref={canvasRef}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
      ></canvas>
    </section>
  );
}
