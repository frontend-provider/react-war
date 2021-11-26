import React, { memo, useContext, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { GameSizeContext } from '../utils/GameSizeContext'
import TowerOrWallNumber from './TowerOrWallNumber'
import {
  maxWallOnScreen,
  towerWallHeightDelay,
  wallPixelationFallbackHeight,
} from '../constants/visuals'

import wall from '../../assets/img/wall.webp'
import { I18nContext } from '../i18n/I18nContext'
import TooltipAll from './special/TooltipAll'
import Pixelation from './effects/Pixelation'
import { useAppSelector } from '../utils/useAppDispatch'
import { upper1st } from '../utils/upper1st'

const calcBaseRatio = (height: number): string =>
  `(${height}px - (1.75rem + 0.25rem * 2)) / (282 + 600)`

const heightByCurrent = (height: number, currentGoalRatio: string): string =>
  `calc(${calcBaseRatio(height)} * 597 * ${currentGoalRatio})`

const useStyles = createUseStyles<string, number>({
  main: {
    width: (height) => `calc(${calcBaseRatio(height)} * 72 + 1rem * 2)`,
  },
  wallwrapper: {
    height: (height) => heightByCurrent(height, '1'),
    bottom: 'calc(1.75rem + 0.25rem * 2)',
  },
  wallbody: {
    height: (height) =>
      heightByCurrent(height, `(var(--n) / ${maxWallOnScreen})`),
    background: {
      image: `url(${wall})`,
      repeat: 'repeat-y',
      size: '100%',
      position: 'center 0',
    },
    width: (height) => `calc(${calcBaseRatio(height)} * 72)`,
    'max-height': (height) => `calc(${calcBaseRatio(height)} * 597)`,
    'will-change': 'height',
    'transition-property': 'height',
    'transition-timing-function': 'linear',
    'transition-duration': '0.4s',
  },
})

type PropType = {
  isOpponent?: boolean
}
const Wall = ({ isOpponent = false }: PropType) => {
  const _ = useContext(I18nContext)
  const size = useContext(GameSizeContext)
  const height = size.height * (size.narrowMobile ? 1 / 2 : 2 / 3)

  const classes = useStyles(height)

  // Force TailwindCSS to aware of these classes:
  // float-left
  // float-right

  const wallTitle = upper1st(
    _.i18n(isOpponent ? "Opponent's %s" : 'Your %s').replace(
      '%s',
      _.i18n('wall'),
    ),
  )

  const pixelationLevel = useAppSelector((state) => state.visual.pixelation)

  const wallBody = useRef<HTMLDivElement | null>(null)
  const [wallBodyMaxHeight, setWallBodyMaxHeight] = useState(
    wallPixelationFallbackHeight,
  )
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        if (pixelationLevel !== 0 && wallBody.current) {
          setWallBodyMaxHeight(
            window
              .getComputedStyle(wallBody.current)
              .getPropertyValue('max-height'),
          )
        }
      }, towerWallHeightDelay)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return (
    <div
      className={cx(
        'h-full mx-2 relative',
        `float-${isOpponent ? 'right' : 'left'}`,
        classes.main,
      )}
    >
      <TooltipAll title={wallTitle} placement="bottom">
        <div className="w-full h-full">
          <div className={cx('z-20 w-full absolute px-4', classes.wallwrapper)}>
            <div
              ref={wallBody}
              className={cx(
                'absolute bottom-0 overflow-hidden',
                classes.wallbody,
              )}
            >
              {pixelationLevel !== 0 && (
                <Pixelation
                  src={wall}
                  level={pixelationLevel}
                  height={wallBodyMaxHeight}
                />
              )}
            </div>
          </div>
          <div className="bg-black bg-opacity-50 p-1 shadow-lg w-full absolute bottom-0">
            <div
              className={cx(
                'border border-yellow-400 border-opacity-25 text-yellow-400 text-center h-7 leading-7 font-mono',
                'el-number',
              )}
            >
              <TowerOrWallNumber
                isOpponent={isOpponent}
                isWall
                target={wallBody}
              />
            </div>
          </div>
        </div>
      </TooltipAll>
    </div>
  )
}

export default memo(Wall)
