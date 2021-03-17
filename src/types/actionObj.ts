import {
  UPDATE_LANG,
  UPDATE_STATUS,
  UPDATE_STATUS_MAIN,
  EXEC_CARD,
  USE_CARD,
  MOVE_CARD_TO_CENTER,
  MOVE_CARD_TO_TOP,
  MOVE_CARD_TO_DECK,
  CLEAR_CARD,
  DELETE_CARD,
  SWITCH_TURN,
  SWITCH_LOCK,
  REMOVE_CARD,
} from '../constants/ActionTypes'
import { PersonStatusType } from '../types/state'

export type LangActionType = { type: typeof UPDATE_LANG; lang: string }

type UpdateStatusActionTypeSingle = {
  isPlayer: boolean
  statusProp: keyof PersonStatusType
  noSound?: boolean
} & (
  | {
      to: number
    }
  | {
      diff: number
    }
)

type UpdateStatusMainActionTypeSingle = {
  increase: boolean
  isPlayer: boolean
  statusProp: keyof PersonStatusType
} & (
  | {
      to: number
    }
  | {
      diff: number
    }
)

export type UpdateStatusActionType = {
  type: typeof UPDATE_STATUS
  updArr: UpdateStatusActionTypeSingle[]
}

export type UpdateStatusMainActionType = {
  type: typeof UPDATE_STATUS_MAIN
  updArr: UpdateStatusMainActionTypeSingle[]
}

export type ExecCardActionType = {
  type: typeof EXEC_CARD
  n: number
}

export type UseCardActionType = {
  type: typeof USE_CARD
  n: number
  index: number
  position: number
  owner: 'player' | 'opponent'
}

export type MoveCardToCenterActionType = {
  type: typeof MOVE_CARD_TO_CENTER
  index: number
}

export type MoveCardToTopActionType = {
  type: typeof MOVE_CARD_TO_TOP
  index: number
}

export type MoveCardToDeckActionType = {
  type: typeof MOVE_CARD_TO_DECK
  index: number
}

export type ClearCardActionType = {
  type: typeof CLEAR_CARD
}

export type DeleteCardInDeckActionType = {
  type: typeof DELETE_CARD
  index: number
}

export type RemoveCardActionType = {
  type: typeof REMOVE_CARD
  index: number
  position: number
  owner: 'player' | 'opponent'
}

export type SwitchTurnActionType = {
  type: typeof SWITCH_TURN
}

export type SwitchLockActionType = {
  type: typeof SWITCH_LOCK
}

export type ActionType =
  | LangActionType
  | UpdateStatusActionType
  | UpdateStatusMainActionType
  | ExecCardActionType
  | UseCardActionType
  | MoveCardToCenterActionType
  | MoveCardToTopActionType
  | MoveCardToDeckActionType
  | ClearCardActionType
  | DeleteCardInDeckActionType
  | RemoveCardActionType
  | SwitchTurnActionType
  | SwitchLockActionType
