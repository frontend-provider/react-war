import {
  CHECK_UNUSABLE,
  CHECK_VICTORY,
  UPDATE_STATUS,
  UPDATE_STATUS_MAIN,
} from '../constants/ActionTypes'
import { RootActionType } from '../types/actionObj'
import { withLatestFrom, filter, concatMap } from 'rxjs/operators'
import { isOfType } from 'typesafe-actions'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { RootStateType } from '../types/state'
import playSound from '../utils/playSound'
import { concat, of } from 'rxjs'

export const updateStatusEpic = (
  action$: ActionsObservable<RootActionType>,
  state$: StateObservable<RootStateType>,
) =>
  action$.pipe(
    filter(isOfType(UPDATE_STATUS)),
    withLatestFrom(state$),
    concatMap(([action, state]) => {
      const newUpdArr = action.payload.map((upd) => {
        const { isPlayer, statusProp, noSound } = upd
        let increase: boolean | null = null
        if ('to' in upd) {
          const from =
            state.status[isPlayer ? 'player' : 'opponent'][statusProp]
          if (upd.to !== from) {
            increase = upd.to > from
          }
        } else {
          if (upd.diff !== 0) {
            increase = upd.diff > 0
          }
        }
        if (!noSound) {
          playSound(statusProp, state.volume, increase)
        }
        return {
          increase,
          isPlayer,
          statusProp,
          ...('to' in upd ? { to: upd.to } : { diff: upd.diff }),
        }
      })
      return concat(
        of({
          type: UPDATE_STATUS_MAIN,
          payload: newUpdArr,
        }),
        of({
          type: CHECK_UNUSABLE,
        }),
        of({
          type: CHECK_VICTORY,
        }),
      )
    }),
  )

export default updateStatusEpic
