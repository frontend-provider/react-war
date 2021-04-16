import {
  DRAW_CARD_CORE,
  DRAW_CARD_PRE,
  DRAW_CARD_MAIN,
  CHECK_UNUSABLE,
  AI_USE_CARD,
  ABORT_ALL,
  CHECK_SURRENDER,
  SWITCH_LOCK,
} from '../../constants/ActionTypes'
import { RootActionType } from '../../types/actionObj'
import {
  withLatestFrom,
  filter,
  concatMap,
  delay,
  takeUntil,
} from 'rxjs/operators'
import { isOfType } from 'typesafe-actions'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { RootStateType } from '../../types/state'
import { concat, EMPTY, of } from 'rxjs'
import playSound from '../../utils/playSound'
import {
  aiDelay,
  cardTransitionDuration,
  drawCardPre,
} from '../../constants/visuals'
import {
  aiExtraDelay,
  noAiExtraDelay,
  useAi,
} from '../../constants/devSettings'

export default (
  action$: ActionsObservable<RootActionType>,
  state$: StateObservable<RootStateType>,
) =>
  action$.pipe(
    filter(isOfType(DRAW_CARD_CORE)),
    withLatestFrom(state$),
    concatMap(([action, state]) => {
      const { n } = action
      const owner = state.game.playersTurn ? 'player' : 'opponent'
      const isConnected =
        state.multiplayer.on &&
        (state.multiplayer.status === 'connected_to_id' ||
          state.multiplayer.status === 'connected_by_id')
      playSound('deal', state.volume)

      return concat(
        of<RootActionType>({
          type: SWITCH_LOCK,
          on: true,
          locknumber: 1,
        }),
        of<RootActionType>({
          type: DRAW_CARD_PRE,
          n,
        }),
        of<RootActionType>({
          type: CHECK_UNUSABLE,
          lastOnly: true,
        }),
        of<RootActionType>({
          type: DRAW_CARD_MAIN,
          owner,
        }).pipe(delay(drawCardPre)),
        of<RootActionType>({
          type: SWITCH_LOCK,
          on: false,
          locknumber: 1,
        }).pipe(delay(0)),
        owner === 'opponent' && useAi && !isConnected
          ? of<RootActionType>({
              type: AI_USE_CARD,
            }).pipe(
              delay(
                cardTransitionDuration +
                  aiDelay +
                  (noAiExtraDelay ? 0 : aiExtraDelay),
              ),
            )
          : EMPTY,
        owner === 'player'
          ? of<RootActionType>({
              type: CHECK_SURRENDER,
            }).pipe(delay(0))
          : EMPTY,
      ).pipe(takeUntil(action$.ofType(ABORT_ALL)))
    }),
  )
