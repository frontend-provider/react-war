import produce from 'immer'
import {
  INIT_GAME,
  SWITCH_DISCARD_MODE,
  SWITCH_LOCK,
  SWITCH_TURN,
} from '../constants/ActionTypes'
import { GameStateType } from '../types/state'
import { ActionType } from '../types/actionObj'

const defaultGame: GameStateType = {
  playersTurn: true,
  locked: false,
  discardMode: false,
}

const game = produce((draft: GameStateType, action: ActionType) => {
  switch (action.type) {
    case INIT_GAME: {
      return {
        playersTurn: action.playersTurn,
        locked: false,
        discardMode: false,
      }
    }
    case SWITCH_DISCARD_MODE: {
      draft.discardMode = !draft.discardMode
      break
    }
    case SWITCH_TURN: {
      draft.playersTurn = !draft.playersTurn
      break
    }
    case SWITCH_LOCK: {
      draft.locked = !draft.locked
      break
    }
  }
}, defaultGame)

export default game
