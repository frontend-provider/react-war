import React from 'react'
import Resource, { calcStatusWidth } from './Resource'
import useGameSize from '../utils/useGameSize'

type PropType = {
  playerName: string
  bricks: number
  gems: number
  recruits: number
  brickProd: number
  gemProd: number
  recruitProd: number
  isOpponent?: boolean
}
const Status = ({
  playerName,
  bricks,
  gems,
  recruits,
  brickProd,
  gemProd,
  recruitProd,
  isOpponent = false,
}: PropType) => {
  const size = useGameSize()
  const height = (size.height / 3) * 2

  return (
    <div
      className="z-20 p-5 h-full relative"
      style={{
        width: `calc(${calcStatusWidth(height)})`,
        float: isOpponent ? 'right' : 'left',
      }}
    >
      <div className="bg-black bg-opacity-50 mb-4 p-1 shadow-lg">
        <div className="border border-yellow-400 border-opacity-25 text-yellow-400 text-center h-7 leading-7 font-mono">
          {playerName}
        </div>
      </div>

      <Resource type="brick" count={bricks} prod={brickProd} />
      <Resource type="gem" count={gems} prod={gemProd} />
      <Resource type="recruit" count={recruits} prod={recruitProd} />
    </div>
  )
}

export default Status
