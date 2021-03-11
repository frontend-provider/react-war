import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import useGameSize from '../utils/useGameSize'
import AnimatedNumber from './AnimatedNumber'
import NumberDiff from './NumberDiff'

import brickBg from '../../assets/img/res_1.png'
import gemBg from '../../assets/img/res_2.png'
import recruitBg from '../../assets/img/res_3.png'

const whRatio = 156 / 216

const getFontSize = (height: number, percentage: number): number => {
  const fontSizeTemp = height * percentage
  return fontSizeTemp >= 12 ? fontSizeTemp : 12
}

const getLineHeight = (height: number, percentage: number): number =>
  getFontSize(height, percentage) * 1.2

const calcProdHeight = (height: number): string =>
  `(${height}px - 1.25rem * 2 - (1.75rem + 0.25rem * 2 + 1rem) - (0.25rem * 2 + ${getLineHeight(
    height,
    0.036,
  )}px + 0.25rem + 0.75rem) * 3) / 3`

export const calcStatusWidth = (height: number): string =>
  `${calcProdHeight(height)} / ${whRatio} + 0.25rem * 2 + 1.25rem * 2`

const useStyles = createUseStyles({
  brick: {
    background: {
      image: `url(${brickBg})`,
    },
  },
  gem: {
    background: {
      image: `url(${gemBg})`,
    },
  },
  recruit: {
    background: {
      image: `url(${recruitBg})`,
    },
  },
  prod: {
    'font-size': (height) => `${getFontSize(height, 0.05)}px`,
    'line-height': (height) => `${getLineHeight(height, 0.05)}px`,
    'margin-bottom': '-0.2em',
  },
  count: {
    'font-size': (height) => `${getFontSize(height, 0.036)}px`,
    'line-height': (height) => `${getLineHeight(height, 0.036)}px`,
    height: (height) => `${getLineHeight(height, 0.036)}px`,
  },
  unit: {
    'font-size': (height) => `${getFontSize(height, 0.036)}px`,
    'line-height': (height) => `${getLineHeight(height, 0.036)}px`,
    height: (height) => `${getLineHeight(height, 0.036)}px`,
  },
  fatnumber: {
    font: {
      family: 'FatNumber',
      weight: 'bold',
    },
    'letter-spacing': '-1px',
  },
  condensed: {
    font: {
      family: 'RobotoCondensed',
      weight: 'bold',
    },
  },
})

type PropType = {
  type: 'brick' | 'gem' | 'recruit'
  count: number
  prod: number
}
const Resource = ({ type, count, prod }: PropType) => {
  const size = useGameSize()
  const height = (size.height / 3) * 2

  const classes = useStyles(height)
  const color = { brick: 'red', gem: 'blue', recruit: 'green' }[type]
  const text = { brick: 'bricks', gem: 'gems', recruit: 'recruits' }[type]
  // Force TailwindCSS to aware of these classes:
  // bg-red-300
  // bg-blue-300
  // bg-green-300
  return (
    <div className={cx('mb-3 p-1 shadow-lg', `bg-${color}-300`)}>
      <div
        className={cx(
          classes[type],
          'bg-no-repeat bg-cover bg-center border border-l-darkborder border-t-darkborder border-r-lightborder border-b-lightborder relative',
        )}
        style={{
          height: `calc(${calcProdHeight(height)})`,
        }}
      >
        <div
          className={cx(
            'text-yellow-400 absolute bottom-1 left-1 text-shadow-md',
            classes.fatnumber,
            classes.prod,
          )}
        >
          <NumberDiff n={prod} />
          <AnimatedNumber n={prod} />
        </div>
      </div>
      <div className="flow-root mt-1">
        <div
          className={cx(
            'float-left text-black flex-1 text-left relative',
            classes.fatnumber,
            classes.count,
          )}
        >
          <NumberDiff n={count} />
          <AnimatedNumber n={count} />
        </div>
        <div
          className={cx(
            'float-right text-black flex-1 text-right',
            classes.condensed,
            classes.unit,
          )}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

export default Resource
