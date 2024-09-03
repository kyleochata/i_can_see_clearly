import React from 'react'

interface ControlsProps {
  onStart: () => void
  onReset: () => void
  isSorting: boolean
}

const Controls: React.FC<ControlsProps> = ({ onStart, onReset, isSorting }) => {
  return (
    <div>
      <button onClick={onStart} disabled={isSorting}>
        Start Sorting
      </button>
      <button onClick={onReset}>Reset</button>
    </div>
  )
}

export default Controls
