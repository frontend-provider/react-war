import { createStore, applyMiddleware } from 'redux'
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import rootReducer from './reducers'
import { createEpicMiddleware } from 'redux-observable'
import { RootActionType } from './types/actionObj'
import { RootStateType } from './types/state'

export const epicMiddleware = createEpicMiddleware<
  RootActionType,
  RootActionType,
  RootStateType
>()

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
