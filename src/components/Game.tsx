import React, { memo } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { useAppSelector } from '../utils/useAppDispatch'
import { minWidth, minHeight } from '../utils/GameSizeContext'
import TableCommon from './TableCommon'
import TableP from './TableP'
import ButtonBar from './buttons/ButtonBar'

import EndScreen from './screens/EndScreen'
import Pref from './screens/Pref'
import LangPref from './screens/LangPref'
import VolumePref from './screens/VolumePref'
import Help from './screens/Help'
import { isEndScreenNoCloseState } from '../types/state'

const useStyles = createUseStyles({
  main: {
    'min-width': `${minWidth}px`,
    'min-height': `${minHeight}px`,
  },
})

const Game = () => {
  const classes = useStyles()

  const pref = useAppSelector((state) => state.screen.pref)
  const langPref = useAppSelector((state) => state.screen.langPref)
  const volumePref = useAppSelector((state) => state.screen.volumePref)
  const end = useAppSelector((state) => state.screen.end)
  const help = useAppSelector((state) => state.screen.help)

  const erathian: boolean = useAppSelector((state) => state.lang.erathian)

  return (
    <div
      className={cx(
        'w-screen h-screen flex flex-col bg-black overflow-x-hidden select-none',
        { erathian },
        classes.main,
      )}
      tabIndex={-1}
    >
      <TableCommon />
      <TableP />
      {isEndScreenNoCloseState(end) && <EndScreen {...end} />}
      {pref && <Pref />}
      {langPref && <LangPref />}
      {volumePref && <VolumePref />}
      {help && <Help />}
      <ButtonBar />
    </div>
  )
}

export default memo(Game)
