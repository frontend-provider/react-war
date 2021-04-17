import { RECEIVE } from '../../constants/ActionTypes'
import { RootActionType } from '../../types/actionObj'
import { filter, concatMap, delay } from 'rxjs/operators'
import { concat, EMPTY, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { RootStateType } from '../../types/state'
import { ConnDataType, instructionActionTypes } from '../../types/connData'
import { INST } from '../../constants/connDataKind'
import { noLatency, testLatency } from '../../constants/devSettings'
import { randomIntFrom } from '../../utils/random'
import devLog from '../../utils/devLog'

export default (
  action$: ActionsObservable<RootActionType>,
  state$: StateObservable<RootStateType>,
) =>
  action$.pipe(
    filter(isOfType(RECEIVE)),
    concatMap((action) => {
      const { data: connDataStr } = action
      devLog(`received: ${connDataStr}`)
      try {
        const connData: ConnDataType = JSON.parse(connDataStr)
        const { kind, data } = connData
        const latency = noLatency
          ? 0
          : randomIntFrom(testLatency[0], testLatency[1])
        switch (kind) {
          case INST: {
            if (instructionActionTypes.includes(data.type)) {
              return of<RootActionType>(data).pipe(delay(latency))
            }
            break
          }
        }
      } catch (error) {}
      return EMPTY
    }),
  )
