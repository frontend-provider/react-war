import React, { memo, useContext, useRef } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { useAppDispatch } from '../../utils/useAppDispatch'

import logo from '../../../assets/logo/logo.svg'
import useClickOutside from '../../utils/useClickOutside'
import { I18nContext } from '../../i18n/I18nContext'
import useKeyDown from '../../utils/useKeyDown'
import { GameSizeContext } from '../../utils/GameSizeContext'
import {
  SCREEN_PREF,
  SCREEN_LANG_PREF,
  SCREEN_VOLUME_PREF,
  SCREEN_HELP,
  SCREEN_LANDSCAPE,
} from '../../constants/ActionTypes'

const useStyles = createUseStyles({
  logo: {
    'background-image': `url(${logo})`,
    width: '134.5px',
    height: '46.5px',
  },
})

type PropType = {
  ScreenActionType:
    | typeof SCREEN_PREF
    | typeof SCREEN_LANG_PREF
    | typeof SCREEN_VOLUME_PREF
    | typeof SCREEN_HELP
    | typeof SCREEN_LANDSCAPE
  children: React.ReactNode
}
const Window = ({ ScreenActionType, children }: PropType) => {
  const dispatch = useAppDispatch()
  const _ = useContext(I18nContext)

  const exitFunc = () => {
    dispatch({
      type: ScreenActionType,
      show: false,
    })
  }

  const prefRef = useRef(null)
  useClickOutside(prefRef, exitFunc)
  useKeyDown('Escape', exitFunc)

  const size = useContext(GameSizeContext)

  const classes = useStyles()
  return (
    <div className={cx('window-bg')}>
      <div className={cx('window-outerwrapper')}>
        <div ref={prefRef} className={cx('window-wrapper')}>
          <div
            title={_.i18n('ArcoMage HD')}
            className={cx(
              classes.logo,
              { hidden: size.narrowMobile && ScreenActionType === SCREEN_PREF },
              'm-auto bg-no-repeat bg-center bg-contain',
            )}
          ></div>

          {children}

          <button
            className="cancel"
            title={_.i18n('Cancel')}
            onClick={exitFunc}
          ></button>
        </div>
      </div>
    </div>
  )
}

export default memo(Window)
