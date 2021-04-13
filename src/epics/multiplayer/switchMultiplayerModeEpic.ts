import {
  SWITCH_MULTIPLAYER_MODE,
  SWITCH_MULTIPLAYER_MODE_MAIN,
  ABORT_ALL,
  CONNECT_TO_NETWORK,
  DISCONNECT,
  ABORT_CONNECTION,
} from '../../constants/ActionTypes'
import { RootActionType } from '../../types/actionObj'
import { filter, concatMap, takeUntil } from 'rxjs/operators'
import { of, concat, merge } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { RootStateType } from '../../types/state'

export default (
  action$: ActionsObservable<RootActionType>,
  state$: StateObservable<RootStateType>,
) =>
  action$.pipe(
    filter(isOfType(SWITCH_MULTIPLAYER_MODE)),
    concatMap((action) => {
      const { on } = action
      return concat(
        on
          ? of<RootActionType>({
              type: CONNECT_TO_NETWORK,
            })
          : of<RootActionType>({
              type: DISCONNECT,
            }),
        of<RootActionType>({
          type: SWITCH_MULTIPLAYER_MODE_MAIN,
          on,
        }),
      ).pipe(
        takeUntil(
          merge(action$.ofType(ABORT_CONNECTION), action$.ofType(ABORT_ALL)),
        ),
      )
    }),
  )
