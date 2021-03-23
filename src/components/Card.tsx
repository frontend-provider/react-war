import React, { useState, useContext, memo } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { GameSizeContext } from '../utils/GameSizeContext'

import { useAppSelector, useAppDispatch } from '../utils/useAppDispatch'
import {
  USE_CARD,
  MOVE_CARD_TO_TOP,
  NEXT_ROUND,
  DELETE_CARD,
  DISCARD_CARD,
} from '../constants/ActionTypes'
import { CardTotalType, ownerType, StateType } from '../types/state'
import {
  cardTransitionDurationMs,
  cardNextStepTimeoutMs,
  unusableCardOpacity,
} from '../constants/transition'
import { resNames } from '../constants/resourceNames'
import { cardCountPerType } from '../data/cardCountPerType'

import dataCards from '../../src/data/cards'

import noise from '../../assets/img/noise.png'
import cardbackbg from '../../assets/img/cardback.png'
import brick from '../../assets/img/brick.svg'
import gem from '../../assets/img/gem.svg'
import recruit from '../../assets/img/recruit.svg'

import { I18nContext } from '../i18n/I18nContext'
import { DataCardI18nType } from '../types/dataCard'

const heightPercToTable = 0.8
const whRatio = 188 / 252
const marginSpacingXRatio = 1.5
const minSpacingXPx = 5
const topCardSpacingPx = 10
const topCardMarginTop = '1rem'
const middleCardMarginBottom = '1rem'

const useWidth = (
  tableHeight: number,
  tableWidth: number,
  total: number,
): boolean =>
  tableHeight * heightPercToTable * whRatio * total +
    (minSpacingXPx * (total - 1) + minSpacingXPx * marginSpacingXRatio) <=
  tableWidth

const getHeight = (
  tableHeight: number,
  tableWidth: number,
  total: number,
): number => {
  if (useWidth(tableHeight, tableWidth, total)) {
    return tableHeight * heightPercToTable
  } else {
    return getWidth(tableHeight, tableWidth, total) / whRatio
  }
}

const getWidth = (
  tableHeight: number,
  tableWidth: number,
  total: number,
): number => {
  if (useWidth(tableHeight, tableWidth, total)) {
    return getHeight(tableHeight, tableWidth, total) * whRatio
  } else {
    return (
      (tableWidth -
        (minSpacingXPx * (total - 1) + minSpacingXPx * marginSpacingXRatio)) /
      total
    )
  }
}

const getSpacingX = (
  winWidth: number,
  total: number,
  tableHeight: number,
): number => {
  if (useWidth(tableHeight, winWidth, total)) {
    return (
      (winWidth - getWidth(tableHeight, winWidth, total) * total) /
      (total - 1 + 2 * marginSpacingXRatio)
    )
  } else {
    return minSpacingXPx
  }
}

const getMarginX = (
  winWidth: number,
  total: number,
  tableHeight: number,
): number => getSpacingX(winWidth, total, tableHeight) * marginSpacingXRatio

const useStyles = createUseStyles({
  main: {
    width: ({ winHeight, winWidth, total }) =>
      `${getWidth(winHeight / 3, winWidth, total)}px`,
    height: ({ winHeight, winWidth, total }) =>
      `${getHeight(winHeight / 3, winWidth, total)}px`,
    top: ({ winHeight, winWidth, total, position }) => {
      if (position >= 0) {
        return `${
          (winHeight / 3) * 2 +
          (winHeight / 3 - getHeight(winHeight / 3, winWidth, total)) / 2
        }px`
      } else if (position === -5) {
        return `calc(${
          (winHeight / 3) * 2 - getHeight(winHeight / 3, winWidth, total)
        }px - ${middleCardMarginBottom})`
      } else {
        return topCardMarginTop
      }
    },
    left: ({ winHeight, winWidth, total, position }) => {
      if (position >= 0) {
        return `${
          getMarginX(winWidth, total, winHeight / 3) +
          (getWidth(winHeight / 3, winWidth, total) +
            getSpacingX(winWidth, total, winHeight / 3)) *
            position
        }px`
      } else if (position === -5) {
        return `${
          winWidth / 2 - getWidth(winHeight / 3, winWidth, total) / 2
        }px`
      } else {
        return `${
          winWidth / 2 -
          (getWidth(winHeight / 3, winWidth, total) * (position + 3) -
            (1 / 2 - 3 - position) * topCardSpacingPx)
        }px`
      }
    },
    'transition-property': 'opacity, transform, left, top, box-shadow',
    'transition-timing-function': 'ease-in-out',
    'transition-duration': `${cardTransitionDurationMs}ms`,
  },
  isflipped: {
    transform: 'translateX(-100%) rotateY(-179.99deg)',
  },
  cardeffect: {
    'transform-style': 'preserve-3d',
    'transform-origin': 'center right',
  },
  cardfront: {
    'background-image': `url(${noise})`,
    'backface-visibility': 'hidden',
    opacity: ({ unusable, zeroOpacity }) => {
      if (zeroOpacity) {
        return 0
      }
      if (unusable) {
        return unusableCardOpacity
      }
      return 1
    },
    'transition-property': 'opacity, transform, left, top, box-shadow',
    'transition-timing-function': 'ease-in-out',
    'transition-duration': `${cardTransitionDurationMs}ms`,
  },
  cardback: {
    background: {
      image: `url(${cardbackbg})`,
      size: 'cover',
      position: 'center',
      repeat: 'no-repeat',
    },
    opacity: ({ unusable, zeroOpacity }) => {
      if (zeroOpacity) {
        return 0
      }
      if (unusable) {
        return unusableCardOpacity
      }
      return 1
    },
    'transition-property': 'opacity, transform, left, top, box-shadow',
    'transition-timing-function': 'ease-in-out',
    'transition-duration': `${cardTransitionDurationMs}ms`,
  },
  cardbackeffect: {
    transform: 'translateX(0) rotateY(180deg)',
    'backface-visibility': 'hidden',
  },
  image: {
    // width: calc(100% - 0.25rem * 2),
    height: 'calc((100% / 63 * 47 - 0.5rem) / 22 * 13)',
  },
  text: {
    // width: calc(100% - 0.25rem * 2),
    height:
      'calc(100% - (1.25rem + 0.25rem + 0.25rem) - (0.5rem + 0.5rem) - (100% / 63 * 47 - 0.5rem) / 22 * 13)',
  },
  resbg: {
    'background-image': ({ type }) => `url(${[brick, gem, recruit][type]})`,
    background: {
      repeat: 'no-repeat',
      size: 'cover',
      position: 'center center',
    },
    opacity: 0.35,
  },
  condensed: {
    font: {
      family: 'RobotoCondensed',
      weight: 'bold',
    },
  },
})

type PropType = {
  n: number // .. | -1: cardback
  unusable?: boolean
  discarded?: boolean
  position: number // 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | -1 | -2 | -3 | -4 | -5
  totalObj: CardTotalType // player: 4 | 5 | 6 | 7 | 8, opponent:...
  owner?: ownerType
  index?: number // in-store index
  isflipped?: boolean
}
const Card = ({
  n,
  unusable = false,
  discarded = false,
  position,
  totalObj,
  owner = 'common',
  index = -1,
  isflipped = false,
}: PropType) => {
  const trans = useContext(I18nContext)
  const cardsI18n = trans.cards
  const cardsI18nCurrent: DataCardI18nType | undefined = cardsI18n?.[n]
  const playersTurn = useAppSelector((state) => state.game.playersTurn)
  const locked = useAppSelector((state) => state.game.locked)

  const dispatch = useAppDispatch()
  const size = useContext(GameSizeContext)
  const winHeight = size.height
  const winWidth = size.width
  const [zeroOpacity, setZeroOpacity] = useState(false)

  const res = {
    player: {
      bricks: useAppSelector((state) => state.status.player.bricks),
      gems: useAppSelector((state) => state.status.player.gems),
      recruits: useAppSelector((state) => state.status.player.recruits),
    },
    opponent: {
      bricks: useAppSelector((state) => state.status.opponent.bricks),
      gems: useAppSelector((state) => state.status.opponent.gems),
      recruits: useAppSelector((state) => state.status.opponent.recruits),
    },
  }
  let total

  if (owner === 'common') {
    total = totalObj[playersTurn ? 'player' : 'opponent']
  } else {
    total = totalObj[owner]
  }

  if (n === -1) {
    const classes = useStyles({
      winHeight,
      winWidth,
      total,
      position,
      unusable,
      zeroOpacity,
    })
    return (
      <div
        className={cx(
          classes.main,
          classes.cardback,
          'transform absolute rounded shadow-lg',
        )}
      ></div>
    )
  } else {
    const { type, cost } = dataCards[n]

    const _unusable =
      unusable ||
      (!unusable &&
        owner !== 'common' &&
        !isflipped &&
        cost > res[owner][resNames[dataCards[n].type]])

    console.log(_unusable)

    const classes = useStyles({
      type,
      winHeight,
      winWidth,
      total,
      position,
      unusable: _unusable,
      zeroOpacity,
    })
    const color = ['red', 'blue', 'green'][type]
    // Force TailwindCSS to aware of these classes:
    // bg-red-200
    // bg-blue-200
    // bg-green-200
    // bg-red-300
    // bg-blue-300
    // bg-green-300
    return (
      <div
        className={cx(
          classes.main,
          classes.cardeffect,
          { [classes.isflipped]: isflipped },
          'transform absolute rounded',
          {
            'opacity-0 pointer-events-none':
              (playersTurn && owner === 'opponent') ||
              (!playersTurn && owner === 'player'),
          },
          { 'shadow-lg': position !== -1 },
          { 'cursor-pointer hover:scale-105': position >= 0 },
        )}
        {...(position >= 0 && !_unusable && !locked
          ? {
              onClick: () => {
                if (owner !== 'common') {
                  dispatch({
                    type: USE_CARD,
                    n,
                    index,
                    position,
                    owner,
                  })
                }
              },
            }
          : {})}
        {...(position >= 0 && !locked
          ? {
              onContextMenu: (e) => {
                e.preventDefault()
                if (owner !== 'common') {
                  dispatch({
                    type: DISCARD_CARD,
                    index,
                    position,
                    owner,
                  })
                }
              },
            }
          : {})}
        onTransitionEnd={(e) => {
          if (e.propertyName === 'top' && position === -5) {
            setTimeout(() => {
              dispatch({
                type: MOVE_CARD_TO_TOP,
                index,
              })
            }, cardNextStepTimeoutMs)
          }
          if (e.propertyName === 'top' && [-2, -3, -4].includes(position)) {
            dispatch({
              type: NEXT_ROUND,
            })
          }
          if (e.propertyName === 'transform' && position === -1) {
            setZeroOpacity(true)
          }
          if (e.propertyName === 'opacity' && position === -1) {
            dispatch({
              type: DELETE_CARD,
              index,
            })
          }
        }}
      >
        <div
          className={cx(
            classes.cardfront,
            'absolute top-0 bottom-0 left-0 right-0 rounded',
            `bg-${color}-300`,
          )}
        >
          <div
            className={cx(
              'm-1 shadow text-center font-bold leading-5 h-5',
              `bg-${color}-200`,
            )}
          >
            {cardsI18nCurrent?.name}
          </div>
          <div
            className={cx(
              classes.image,
              classes.condensed,
              'm-1 shadow bg-no-repeat bg-cover bg-center flex justify-center items-center text-red-600 text-xl font-bold uppercase text-shadow-stroke',
            )}
            style={{
              backgroundImage: `url(${
                require(`../../assets/img/cards/${dataCards[
                  n
                ].type.toString()}_${(n % cardCountPerType).toString()}.png`)
                  .default
              })`,
            }}
          >
            {discarded && trans?.i18n?.discarded}
          </div>
          <div
            className={cx(
              classes.text,
              'm-2 flex flex-wrap content-center justify-center',
            )}
          >
            <div className="leading-none break-words text-center">
              {cardsI18nCurrent?.desc}
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-9 h-9 leading-9 text-center font-bold">
            <div
              className={cx(
                classes.resbg,
                'absolute top-0 left-0 w-full h-full',
              )}
            ></div>
            <div className="absolute top-0 left-0 w-full h-full">{cost}</div>
          </div>
        </div>
        <div
          className={cx(
            classes.cardback,
            classes.cardbackeffect,
            'absolute top-0 bottom-0 left-0 right-0 rounded',
          )}
        ></div>
      </div>
    )
  }
}

export default memo(Card)
