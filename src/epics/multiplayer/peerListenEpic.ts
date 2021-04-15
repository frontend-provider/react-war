import {
  PEER_LISTEN,
  ABORT_CONNECTION,
  CONNECTION_LISTEN,
  MULTIPLAYER_STATUS,
} from '../../constants/ActionTypes'
import { RootActionType } from '../../types/actionObj'
import { filter, concatMap, takeUntil, switchMap } from 'rxjs/operators'
import { concat, merge, EMPTY, fromEvent, of } from 'rxjs'
import { isOfType } from 'typesafe-actions'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { RootStateType } from '../../types/state'
import { peerAll } from '../../webrtc/peer'
import { JQueryStyleEventEmitter } from 'rxjs/internal/observable/fromEvent'
import Peer from 'peerjs'

export default (
  action$: ActionsObservable<RootActionType>,
  state$: StateObservable<RootStateType>,
) =>
  action$.pipe(
    filter(isOfType(PEER_LISTEN)),
    switchMap((action) => {
      const { peer } = peerAll
      if (peer === null) {
        return EMPTY
      }
      return merge(
        fromEvent<Peer.DataConnection>(
          (peer as unknown) as JQueryStyleEventEmitter,
          'connection',
        ).pipe(
          concatMap((conn) => {
            peerAll.conn = conn
            return concat(
              of<RootActionType>({
                type: CONNECTION_LISTEN,
                host: false,
              }),
            )
          }),
        ),
        fromEvent(
          (peer as unknown) as JQueryStyleEventEmitter,
          'disconnected',
        ).pipe(
          concatMap(() => {
            return concat(
              of<RootActionType>({
                type: MULTIPLAYER_STATUS,
                status: 'disconnected',
              }),
            )
          }),
        ),
        fromEvent((peer as unknown) as JQueryStyleEventEmitter, 'close').pipe(
          concatMap(() => {
            return concat(
              of<RootActionType>({
                type: MULTIPLAYER_STATUS,
                status: 'disconnected',
              }),
            )
          }),
        ),
        fromEvent((peer as unknown) as JQueryStyleEventEmitter, 'error').pipe(
          concatMap(() => {
            console.log('error')
            return EMPTY
          }),
        ),
      ).pipe(takeUntil(action$.ofType(ABORT_CONNECTION)))
    }),
  )
