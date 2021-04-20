import React, { memo, useContext } from 'react'
import Window from './Window'

import { SCREEN_OP_DISCONNECT } from '../../constants/ActionTypes'
import { I18nContext } from '../../i18n/I18nContext'

const OpDisconnectNotice = () => {
  const _ = useContext(I18nContext)

  return (
    <Window screenActionType={SCREEN_OP_DISCONNECT}>
      {_.i18n(
        'You and your opponent are disconnected. Please go to "Preferences" and start a new game.',
      )}
    </Window>
  )
}

export default memo(OpDisconnectNotice)
