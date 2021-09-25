export type AiInstructionType = { index: number; use: boolean }

export type AiCardListItemType = {
  index: number
  n: number
  score: number
  canuse: boolean
  candiscard: boolean
}

export type ScoreObjType = {
  card: AiCardListItemType
  use: boolean
  scoreAll: number
}
