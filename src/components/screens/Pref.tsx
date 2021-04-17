import React, {
  ChangeEvent,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import produce from 'immer'
import copy from 'copy-to-clipboard'
import { useAppSelector, useAppDispatch } from '../../utils/useAppDispatch'
import Window from './Window'

import {
  UPDATE_SETTINGS_INIT,
  SCREEN_PREF,
  SWITCH_MULTIPLAYER_MODE,
  CONNECT_TO_ID,
  SEND_FORM_FIELDS,
} from '../../constants/ActionTypes'
import { I18nContext, upper1st } from '../../i18n/I18nContext'
import { preSettings } from '../../constants/preSettings'
import {
  defaultOpponentName,
  defaultPlayerName,
  defaultSettings,
} from '../../constants/defaultSettings'
import { hasOwnProperty } from '../../utils/typeHelpers'
import {
  copiedDuration,
  shorterIdStartEndLength,
} from '../../constants/visuals'
import {
  allStatusNames,
  otherSettingNames,
  poNames,
} from '../../constants/resourceNames'
import {
  FormFieldsType,
  FormFieldsAllPartialType,
} from '../../types/formFields'
import {
  allCondAndOtherSettingsEqual,
  getAllCondAndOtherSettingsArray,
} from '../../utils/startWinState'

const Pref = () => {
  const _ = useContext(I18nContext)
  const dispatch = useAppDispatch()

  const copied = useRef<HTMLDivElement | null>(null)
  const copiedTimer = useRef<NodeJS.Timeout | null>(null)

  const isMultiplayer = useAppSelector((state) => state.multiplayer.on)
  const yourId = useAppSelector((state) => state.multiplayer.yourId)
  const multiplayerStatus = useAppSelector((state) => state.multiplayer.status)

  const tempFormFieldStore = useAppSelector(
    (state) => state.multiplayer.tempFormFields,
  )

  const multiGameStarted = useAppSelector(
    (state) => state.multiplayer.gameStarted,
  )

  const settingStore = {
    playerName: useAppSelector((state) => state.settings.playerName),
    opponentName: useAppSelector((state) => state.settings.opponentName),

    tower: useAppSelector((state) => state.settings.tower),
    wall: useAppSelector((state) => state.settings.wall),
    bricks: useAppSelector((state) => state.settings.bricks),
    gems: useAppSelector((state) => state.settings.gems),
    recruits: useAppSelector((state) => state.settings.recruits),
    brickProd: useAppSelector((state) => state.settings.brickProd),
    gemProd: useAppSelector((state) => state.settings.gemProd),
    recruitProd: useAppSelector((state) => state.settings.recruitProd),

    winTower: useAppSelector((state) => state.settings.winTower),
    winResource: useAppSelector((state) => state.settings.winResource),

    cardsInHand: useAppSelector((state) => state.settings.cardsInHand),

    opponentId: useAppSelector((state) => state.multiplayer.opponentId),
  }

  const [formFields, setFormFields] = useState<FormFieldsType>(settingStore)

  const checkPreset = (o: FormFieldsType | FormFieldsAllPartialType) => {
    const indexMatched = preSettings
      .concat(defaultSettings)
      .findIndex((settings) => allCondAndOtherSettingsEqual(o, settings))
    if (indexMatched === preSettings.length) {
      return -2
    } else {
      return indexMatched
    }
  }

  const applyAndNewGame = () => {
    dispatch({
      type: SCREEN_PREF,
      show: false,
    })

    const { opponentId, ...rest } = formFields

    dispatch({
      type: UPDATE_SETTINGS_INIT,
      payload: rest,
    })
  }

  const [preset, setPreset] = useState<number>(-10)

  const [notification, setNotification] = useState<string>('')
  const [isGuest, setIsGuest] = useState<boolean>(false)
  const [isHost, setIsHost] = useState<boolean>(false)

  useEffect(() => {
    const winTowerMin = formFields.tower + 1
    // resource victory condition must be 1 higher than any (res + resProd)
    const winResourceMin =
      Math.max(
        formFields.bricks + formFields.brickProd,
        formFields.gems + formFields.gemProd,
        formFields.recruits + formFields.recruitProd,
      ) + 1

    if (formFields.winTower < winTowerMin) {
      setFormFields((prev) =>
        produce(prev, (draft) => {
          draft.winTower = winTowerMin
        }),
      )
    } else if (formFields.winResource < winResourceMin) {
      setFormFields((prev) =>
        produce(prev, (draft) => {
          draft.winResource = winResourceMin
        }),
      )
    }

    setPreset(checkPreset(formFields))

    if (isHost) {
      const { playerName, opponentName, opponentId, ...rest } = formFields
      dispatch({
        type: SEND_FORM_FIELDS,
        payload: rest,
      })
    }
  }, getAllCondAndOtherSettingsArray(formFields))

  const [tempPreset, setTempPreset] = useState<number>(-10)

  useEffect(() => {
    setTempPreset(checkPreset(tempFormFieldStore))
  }, getAllCondAndOtherSettingsArray(tempFormFieldStore))

  useEffect(() => {
    if (isHost || isGuest) {
      const { playerName } = formFields
      dispatch({
        type: SEND_FORM_FIELDS,
        payload: { playerName },
      })
    }
  }, [formFields.playerName])

  const prevMultiplayerStatus = useRef('')
  useEffect(() => {
    if (
      (prevMultiplayerStatus.current === 'connecting_to_id' ||
        prevMultiplayerStatus.current === 'connected_net') &&
      multiplayerStatus === 'connected_to_id'
    ) {
      // just becomes host
      const { opponentName, opponentId, ...rest } = formFields
      dispatch({
        type: SEND_FORM_FIELDS,
        payload: rest,
      })
    } else if (
      prevMultiplayerStatus.current !== '' &&
      multiplayerStatus === 'connected_by_id'
    ) {
      // just becomes guest
      const { playerName } = formFields
      dispatch({
        type: SEND_FORM_FIELDS,
        payload: { playerName },
      })
    }
    prevMultiplayerStatus.current = multiplayerStatus
  }, [multiplayerStatus, settingStore.opponentId])

  useEffect(() => {
    setFormFields((prev) =>
      produce(prev, (draft) => {
        draft.opponentId = settingStore.opponentId
      }),
    )
  }, [settingStore.opponentId])

  // only `formFields`-controlled fields use `handleChange`
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, min, max } = e.target
    let { value } = e.target
    if (type === 'number') {
      if (value === '') {
        value = '0'
      }

      if (parseInt(value, 10) < parseInt(min, 10)) {
        value = min
      }

      if (parseInt(e.target.value, 10) > parseInt(max, 10)) {
        value = max
      }
    }

    setFormFields((prev) =>
      produce(prev, (draft) => {
        if (hasOwnProperty(draft, name)) {
          switch (type) {
            case 'text':
              draft[name] = value
              break
            case 'number':
              draft[name] = parseInt(value, 10)
              break
            default:
              break
          }
        }
      }),
    )
  }

  const usePreset = (index: number) => {
    const _index = index === -2 ? preSettings.length : index
    if (_index >= 0) {
      const targetSettings = preSettings.concat(defaultSettings)[_index]

      setFormFields((prev) => ({ ...prev, ...targetSettings }))
    }
  }

  useEffect(() => {
    switch (multiplayerStatus) {
      case 'connecting_net':
        setNotification(_.i18n('Connecting to the network ⌛'))
        break

      case 'connected_net':
        setNotification(
          _.i18n('Connected to the network (but not to anyone) ✔️'),
        )
        break

      case 'connecting_to_id': {
        const id = formFields.opponentId
        const shorterId = `${id.substring(
          0,
          shorterIdStartEndLength,
        )}...${id.substring(id.length - shorterIdStartEndLength)}`
        setNotification(
          _.i18n('Connecting to ID %s ⌛').replace('%s', shorterId),
        )
        break
      }

      case 'connected_to_id': {
        const id = formFields.opponentId
        const shorterId = `${id.substring(
          0,
          shorterIdStartEndLength,
        )}...${id.substring(id.length - shorterIdStartEndLength)}`
        setNotification(
          _.i18n("Connected to ID %s ✔️ You're the host 🏠").replace(
            '%s',
            shorterId,
          ),
        )
        break
      }

      case 'connected_by_id': {
        const id = settingStore.opponentId
        const shorterId = `${id.substring(
          0,
          shorterIdStartEndLength,
        )}...${id.substring(id.length - shorterIdStartEndLength)}`
        setNotification(
          _.i18n("Connected by ID %s ✔️ You're the guest 💼").replace(
            '%s',
            shorterId,
          ),
        )
        break
      }

      case 'failed':
        setNotification(_.i18n('Connection failed ❌'))
        break

      case 'disconnected':
        setNotification(_.i18n('Disconnected 🔌'))
        break

      default:
        break
    }

    setIsGuest(isMultiplayer && multiplayerStatus === 'connected_by_id')
    setIsHost(isMultiplayer && multiplayerStatus === 'connected_to_id')
  }, [multiplayerStatus, _])

  return (
    <Window
      screenActionType={SCREEN_PREF}
      onCancel={() => {
        if (isHost) {
          const { opponentName, opponentId, ...rest } = settingStore
          dispatch({
            type: SEND_FORM_FIELDS,
            payload: rest,
          })
        }
        if (isGuest) {
          const { playerName } = settingStore
          dispatch({
            type: SEND_FORM_FIELDS,
            payload: { playerName },
          })
        }
      }}
    >
      <h3 className="preferences">
        {_.i18n('Preferences')}
        {_.i18n(': ')}
        <span id="opponentNotification">
          {multiGameStarted
            ? _.i18n('You are playing against human')
            : _.i18n('You are playing against computer AI')}
        </span>
      </h3>

      <div className="two-column half">
        <label>
          <span>
            {_.i18n('Your Name')}
            {_.i18n(': ')}
          </span>
          <input
            type="text"
            name={poNames[0]}
            id={poNames[0]}
            value={formFields.playerName}
            onChange={handleChange}
            onFocus={(e) => {
              if (e.target.value === defaultPlayerName) {
                e.target.select()
              }
            }}
          />
        </label>
        <label>
          <span>
            {_.i18n("Opponent's Name")}
            {_.i18n(': ')}
          </span>
          <input
            type="text"
            name={poNames[1]}
            id={poNames[1]}
            disabled={isGuest || isHost}
            value={
              (isGuest || isHost) && tempFormFieldStore !== null
                ? tempFormFieldStore.opponentName
                : formFields.opponentName
            }
            onChange={handleChange}
            onFocus={(e) => {
              if (e.target.value === defaultOpponentName) {
                e.target.select()
              }
            }}
          />
        </label>
      </div>

      <label className="one-colume">
        <span>
          {_.i18n('Choose a Tavern (Preset Preferences)')}
          {_.i18n(': ')}
        </span>
        <select
          name="tavern"
          id="tavern"
          value={isGuest ? tempPreset : preset}
          disabled={isGuest}
          onChange={(e) => {
            usePreset(parseInt(e.target.value, 10))
          }}
        >
          <option value={-2}>{_.i18n('Default')}</option>
          {preSettings.map((s, i) => (
            <option value={i} key={i}>
              {_.taverns(i, 'name')} - {_.taverns(i, 'location')}
            </option>
          ))}
          {(preset === -1 || isGuest) && (
            <option value={-1}>{_.i18n('Customized')}</option>
          )}
        </select>
      </label>

      <h4>
        {_.i18n('Starting Conditions')}
        {_.i18n(': ')}
      </h4>

      <div className="four-column">
        <label>
          <span>{upper1st(_.i18n('tower'))}</span>
          <input
            type="number"
            name={allStatusNames[0]}
            id={allStatusNames[0]}
            min="1"
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.tower
                : formFields.tower
            }
            onChange={handleChange}
          />
        </label>
        <label>
          <span>{upper1st(_.i18n('bricks'))}</span>
          <input
            type="number"
            name={allStatusNames[2]}
            id={allStatusNames[2]}
            min="0"
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.bricks
                : formFields.bricks
            }
            onChange={handleChange}
          />
        </label>
        <label>
          <span>{upper1st(_.i18n('gems'))}</span>
          <input
            type="number"
            name={allStatusNames[3]}
            id={allStatusNames[3]}
            min="0"
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.gems
                : formFields.gems
            }
            onChange={handleChange}
          />
        </label>
        <label>
          <span>{upper1st(_.i18n('recruits'))}</span>
          <input
            type="number"
            name={allStatusNames[4]}
            id={allStatusNames[4]}
            min="0"
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.recruits
                : formFields.recruits
            }
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="four-column">
        <label>
          <span>{upper1st(_.i18n('wall'))}</span>
          <input
            type="number"
            name={allStatusNames[1]}
            id={allStatusNames[1]}
            min="0"
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.wall
                : formFields.wall
            }
            onChange={handleChange}
          />
        </label>
        <label>
          <span>{upper1st(_.i18n('quarry'))}</span>
          <input
            type="number"
            name={allStatusNames[5]}
            id={allStatusNames[5]}
            min="1"
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.brickProd
                : formFields.brickProd
            }
            onChange={handleChange}
          />
        </label>
        <label>
          <span>{upper1st(_.i18n('magic'))}</span>
          <input
            type="number"
            name={allStatusNames[6]}
            id={allStatusNames[6]}
            min="1"
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.gemProd
                : formFields.gemProd
            }
            onChange={handleChange}
          />
        </label>
        <label>
          <span>{upper1st(_.i18n('dungeon'))}</span>
          <input
            type="number"
            name={allStatusNames[7]}
            id={allStatusNames[7]}
            min="1"
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.recruitProd
                : formFields.recruitProd
            }
            onChange={handleChange}
          />
        </label>
      </div>

      <h4>
        {_.i18n('Victory Conditions')}
        {_.i18n(': ')}
      </h4>
      <div className="two-column">
        <label>
          <span>{upper1st(_.i18n('tower'))}</span>
          <input
            type="number"
            name={otherSettingNames[0]}
            id={otherSettingNames[0]}
            min={(formFields.tower + 1).toString(10)}
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.winTower
                : formFields.winTower
            }
            onChange={handleChange}
          />
        </label>
        <label>
          <span>{upper1st(_.i18n('resource'))}</span>
          <input
            type="number"
            name={otherSettingNames[1]}
            id={otherSettingNames[1]}
            min={(
              Math.max(
                formFields.bricks + formFields.brickProd,
                formFields.gems + formFields.gemProd,
                formFields.recruits + formFields.recruitProd,
              ) + 1
            ).toString(10)}
            disabled={isGuest}
            value={
              isGuest && tempFormFieldStore !== null
                ? tempFormFieldStore.winResource
                : formFields.winResource
            }
            onChange={handleChange}
          />
        </label>
      </div>

      <h4>
        {_.i18n('Other Preferences')}
        {_.i18n(': ')}
      </h4>
      <label className="one-colume">
        <span>{_.i18n('Cards in Hand')}</span>
        <input
          type="number"
          name={otherSettingNames[2]}
          id={otherSettingNames[2]}
          min="0"
          max="15"
          disabled={isGuest}
          value={
            isGuest && tempFormFieldStore !== null
              ? tempFormFieldStore.cardsInHand
              : formFields.cardsInHand
          }
          onChange={handleChange}
        />
      </label>
      {/* <label className="one-colume">
          <span>{_.i18n('AI Type')}</span>
          <select name="aiType" id="aiType">
            <option value={0}>111</option>
            <option value={1}>222</option>
          </select>
          </label> */}

      <h4 className="multiplayer">
        <label>
          <input
            type="checkbox"
            name="isMultiplayer"
            id="isMultiplayer"
            checked={isMultiplayer}
            onChange={(e) => {
              dispatch({
                type: SWITCH_MULTIPLAYER_MODE,
                on: e.target.checked,
              })
            }}
          />
          <span>
            {_.i18n('Multiplayer')}
            {_.i18n(': ')}
            {(isMultiplayer ? _.i18n('on') : _.i18n('off')).toUpperCase()}
          </span>
        </label>
        <span id="multiplayerNotification">{notification}</span>
      </h4>
      <div className="multiplayer">
        <label>
          <span>
            {_.i18n('Your ID')}
            {_.i18n(': ')}
          </span>
          <input
            type="text"
            name="yourId"
            id="yourId"
            value={yourId}
            readOnly
            onClick={(e) => {
              const target = e.target as HTMLInputElement
              if (target.value !== '') {
                target.select()
                copy(target.value)
                if (copied.current !== null) {
                  copied.current.classList.add('copied-shown')
                  if (copiedTimer.current !== null) {
                    clearTimeout(copiedTimer.current)
                  }
                  copiedTimer.current = setTimeout(() => {
                    if (copied.current !== null) {
                      copied.current.classList.remove('copied-shown')
                    }
                  }, copiedDuration)
                }
              }
            }}
          />
          <span ref={copied} className="copied">
            {_.i18n('Copied 📋✔️')}
          </span>
        </label>
      </div>
      <div className="multiplayer">
        <label>
          <span>
            {_.i18n("Enter your opponent's ID")}
            {_.i18n(': ')}
          </span>
          <input
            disabled={
              !isMultiplayer ||
              multiplayerStatus === 'connecting_net' ||
              multiplayerStatus === 'connecting_to_id' ||
              multiplayerStatus === 'connected_to_id' ||
              multiplayerStatus === 'connected_by_id'
            }
            type="text"
            name="opponentId"
            id="opponentId"
            value={formFields.opponentId}
            onChange={handleChange}
          />
        </label>
        <button
          disabled={
            !isMultiplayer ||
            multiplayerStatus === 'connecting_net' ||
            multiplayerStatus === 'connecting_to_id' ||
            multiplayerStatus === 'connected_to_id' ||
            multiplayerStatus === 'connected_by_id'
          }
          className="highlight"
          onClick={(e) => {
            dispatch({
              type: CONNECT_TO_ID,
              id: formFields.opponentId,
            })
          }}
        >
          {_.i18n('Connect')}
        </button>
      </div>

      <div className="button-wrapper">
        <button
          disabled={isGuest}
          onClick={() => {
            setFormFields(({ opponentId }) => ({
              playerName: defaultPlayerName,
              opponentName: defaultOpponentName,
              ...defaultSettings,
              isMultiplayer, // unchanged
              yourId, // unchanged
              opponentId, // unchanged
            }))
          }}
        >
          {_.i18n('Reset')}
        </button>
        <button
          disabled={isGuest}
          className="warning"
          onClick={applyAndNewGame}
        >
          {_.i18n('Apply & New Game')}
        </button>
      </div>
    </Window>
  )
}

export default memo(Pref)
