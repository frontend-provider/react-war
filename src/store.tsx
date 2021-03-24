import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { createEpicMiddleware } from 'redux-observable'
import { ActionType } from './types/actionObj'
import { StateType } from './types/state'

export const epicMiddleware = createEpicMiddleware<ActionType, ActionType, StateType>()

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
