export const BOARD_WIDTH = 800;
export const BOARD_HEIGHT = 800;
export const GRID_SIZE = 20;
export const NUMBER_OF_ROWS = BOARD_HEIGHT / GRID_SIZE;
export const NUMBER_OF_COLUMNS = BOARD_WIDTH / GRID_SIZE;

export const COLORS = ['black', 'white'] as const;
export type Board = number[][];

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

export const createEmptyBoard = (): Board => {
  return Array.from({ length: NUMBER_OF_ROWS }, () =>
    Array.from({ length: NUMBER_OF_COLUMNS }, () => 0)
  );
}