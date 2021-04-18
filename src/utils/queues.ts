import {
  DiscardCardCoreActionType,
  UseCardCoreActionType,
} from '../types/actionObj'
import Queue from './Queue'

export const drawCardQueue = new Queue<number>()

export const useCardQueue = new Queue<
  UseCardCoreActionType | DiscardCardCoreActionType
>()

if (process.env.ISDEV) {
  ;(window as any).dcq = drawCardQueue
  ;(window as any).ucq = drawCardQueue
}
