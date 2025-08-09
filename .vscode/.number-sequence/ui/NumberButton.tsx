import * as React from 'react';

type NumberButtonProps = {
  num: number;
  onPress: (num: number) => void;
  row: number;
  col: number;
};

export function NumberButton({ num, onPress, row, col }: NumberButtonProps) {
  const handlePress = () => onPress(num);

  return (
    <button
      className="text-2xl m-1 p-4 bg-gray-200 rounded-lg"
      text={num.toString()}
      row={row}
      col={col}
      onTap={handlePress}
    />
  );
}