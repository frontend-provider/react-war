import {
  UPDATE_LANG,
  UPDATE_ERATHIAN,
  UPDATE_VOLUME,
  UPDATE_STATUS,
  UPDATE_STATUS_MAIN,
  EXEC_CARD,
  USE_CARD,
  MOVE_CARD_TO_CENTER,
  MOVE_CARD_TO_TOP,
  MOVE_CARD_TO_TOP_MAIN,
  CLEAR_CARD,
  DELETE_CARD,
  NEXT_ROUND,
  SWITCH_LOCK,
  REMOVE_CARD,
  DISCARD_CARD,
  ADD_DISCARDED_TAG,
  CHANGE_SETTINGS,
  INIT,
  CHANGE_SETTINGS_AND_INIT,
  INIT_CARD,
  INIT_GAME,
  INIT_STATUS,
  DRAW_CARD,
  SWITCH_TURN,
  DRAW_CARD_MAIN,
  DRAW_CARD_PRE,
  RESOURCE_PROD,
  SWITCH_DISCARD_MODE,
  MOVE_CARD_TO_STACK,
  SET_ZERO_OPACITY,
  CHECK_UNUSABLE,
  SET_UNUSABLE,
  SWITCH_NEW_TURN,
  SCREEN_PREF,
  SCREEN_LANG_PREF,
  SCREEN_VOLUME_PREF,
  SCREEN_END,
  SCREEN_END_MAIN,
  SCREEN_HELP,
  SCREEN_LANDSCAPE,
  CHECK_VICTORY,
  AI_USE_CARD,
  CHECK_SURRENDER,
  ABORT_ALL,
} from '../constants/ActionTypes'
import { AvailableLangType } from '../i18n/types'
import {
  CardStateType,
  EndScreenStateType,
  ownerType2,
  PersonStatusType,
  SettingsStateType,
} from '../types/state'

export type LangActionType = {
  type: typeof UPDATE_LANG
  lang: AvailableLangType
}

export type ErathianActionType = {
  type: typeof UPDATE_ERATHIAN
  erathian: boolean
}

export type VolumeActionType = {
  type: typeof UPDATE_VOLUME
  volume: number
}

export type UpdateStatusActionTypeSingle = {
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

export type UpdateStatusMainActionTypeSingle = {
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
  payload: UpdateStatusActionTypeSingle[]
}

export type UpdateStatusMainActionType = {
  type: typeof UPDATE_STATUS_MAIN
  payload: UpdateStatusMainActionTypeSingle[]
}

export type ExecCardActionType = {
  type: typeof EXEC_CARD
  n: number
  owner: ownerType2
}

export type UseCardActionType = {
  type: typeof USE_CARD
  n: number
  index: number
  position: number
  owner: ownerType2
}

export type DrawCardActionType = {
  type: typeof DRAW_CARD
}

export type DrawCardPreActionType = {
  type: typeof DRAW_CARD_PRE
  n: number
}

export type DrawCardMainActionType = {
  type: typeof DRAW_CARD_MAIN
  owner: ownerType2
}

export type ClearCardActionType = {
  type: typeof CLEAR_CARD
}

export type MoveCardToStackActionType = {
  type: typeof MOVE_CARD_TO_STACK
  index: number
}

export type SetZeroOpacityActionType = {
  type: typeof SET_ZERO_OPACITY
  index: number
}

export type MoveCardToCenterActionType = {
  type: typeof MOVE_CARD_TO_CENTER
  index: number
}

export type MoveCardToTopActionType = {
  type: typeof MOVE_CARD_TO_TOP
  index: number
}

export type MoveCardToTopMainActionType = {
  type: typeof MOVE_CARD_TO_TOP_MAIN
  index: number
  toPosition: number
}

export type DiscardCardActionType = {
  type: typeof DISCARD_CARD
  index: number
  position: number
  owner: ownerType2
}

export type AddDiscardedTagActionType = {
  type: typeof ADD_DISCARDED_TAG
  index: number
}

export type RemoveCardActionType = {
  type: typeof REMOVE_CARD
  index: number
  position: number
  owner: ownerType2
}

export type DeleteCardInStackActionType = {
  type: typeof DELETE_CARD
  index: number
}

export type NextRoundActionType = {
  type: typeof NEXT_ROUND
}

export type ResourceProdActionType = {
  type: typeof RESOURCE_PROD
  owner: ownerType2
}

export type SwitchTurnActionType = {
  type: typeof SWITCH_TURN
}

export type SwitchLockActionType = {
  type: typeof SWITCH_LOCK
  on: boolean
  locknumber?: 0 | 1
}

export type ChangeSettingsActionType = {
  type: typeof CHANGE_SETTINGS
  payload: SettingsStateType
}

export type InitActionType = {
  type: typeof INIT
}

export type InitCardActionType = {
  type: typeof INIT_CARD
  payload: CardStateType
}

export type InitGameActionType = {
  type: typeof INIT_GAME
  playersTurn: boolean
}

export type InitStatusActionType = {
  type: typeof INIT_STATUS
  payload: PersonStatusType
}

export type ChangeSettingsAndInitActionType = {
  type: typeof CHANGE_SETTINGS_AND_INIT
  payload: SettingsStateType
}

export type SwitchDiscardModeActionType = {
  type: typeof SWITCH_DISCARD_MODE
  on: boolean
}

export type CheckUnusableActionType = {
  type: typeof CHECK_UNUSABLE
  lastOnly?: boolean // if true then only check last card, if false or not present then check all card
}

export type SetUnusableActionType = {
  type: typeof SET_UNUSABLE
  unusables: number[]
  usables: number[]
}

export type SwitchNewTurnActionType = {
  type: typeof SWITCH_NEW_TURN
  on: boolean
}

export type CheckVictoryActionType = {
  type: typeof CHECK_VICTORY
}

export type ScreenPrefActionType = {
  type: typeof SCREEN_PREF
  show: boolean
}

export type ScreenLangPrefActionType = {
  type: typeof SCREEN_LANG_PREF
  show: boolean
}

export type ScreenVolumePrefActionType = {
  type: typeof SCREEN_VOLUME_PREF
  show: boolean
}

export type ScreenHelpActionType = {
  type: typeof SCREEN_HELP
  show: boolean
}

export type ScreenLandscapeActionType = {
  type: typeof SCREEN_LANDSCAPE
  show: boolean
}

export type ScreenEndActionType = {
  type: typeof SCREEN_END
  payload: EndScreenStateType
}

export type ScreenEndMainActionType = {
  type: typeof SCREEN_END_MAIN
  payload: EndScreenStateType
}

export type AiUseCardActionType = {
  type: typeof AI_USE_CARD
}

export type CheckSurrenderActionType = {
  type: typeof CHECK_SURRENDER
}

export type AbortAllActionType = {
  type: typeof ABORT_ALL
}

export type RootActionType =
  | LangActionType
  | ErathianActionType
  | VolumeActionType
  | UpdateStatusActionType
  | UpdateStatusMainActionType
  | ExecCardActionType
  | UseCardActionType
  | DrawCardActionType
  | DrawCardPreActionType
  | DrawCardMainActionType
  | ClearCardActionType
  | MoveCardToStackActionType
  | SetZeroOpacityActionType
  | MoveCardToCenterActionType
  | MoveCardToTopActionType
  | MoveCardToTopMainActionType
  | DiscardCardActionType
  | AddDiscardedTagActionType
  | RemoveCardActionType
  | DeleteCardInStackActionType
  | NextRoundActionType
  | ResourceProdActionType
  | SwitchTurnActionType
  | SwitchLockActionType
  | ChangeSettingsActionType
  | InitActionType
  | InitCardActionType
  | InitGameActionType
  | InitStatusActionType
  | ChangeSettingsAndInitActionType
  | SwitchDiscardModeActionType
  | CheckUnusableActionType
  | SetUnusableActionType
  | SwitchNewTurnActionType
  | CheckVictoryActionType
  | ScreenPrefActionType
  | ScreenLangPrefActionType
  | ScreenVolumePrefActionType
  | ScreenHelpActionType
  | ScreenLandscapeActionType
  | ScreenEndActionType
  | ScreenEndMainActionType
  | AiUseCardActionType
  | CheckSurrenderActionType
  | AbortAllActionType
