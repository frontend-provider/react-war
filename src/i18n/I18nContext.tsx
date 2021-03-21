import React, { createContext, useEffect, useState } from 'react'
import { i18n as defaultTrans } from './en'
import { cardsI18n } from '../../src/i18n/cards.en'
import { defaultLang } from './langs'
import {
  AvailableLangType,
  TranslationFullType,
  TranslationItemType,
  TranslationObjType,
  TranslationType,
} from './types'
import { useAppSelector } from '../utils/useAppDispatch'
import { RequiredBy } from '../utils/typeHelpers'

const allDefault = { i18n: defaultTrans, cards: cardsI18n }

export const I18nContext = createContext<TranslationObjType>(allDefault)

const translationDefault: TranslationFullType = {
  [defaultLang]: allDefault,
}

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [translation, setTranslation] = useState<TranslationFullType>(
    translationDefault,
  )
  const lang = useAppSelector((state): AvailableLangType => state.lang)
  useEffect(() => {
    if (!translation[lang]) {
      setTranslation({ ...translation, [lang]: null })
      ;(async () => {
        const [{ i18n }, { cardsI18n }] = await Promise.all([
          import(`./${lang}`),
          import(`./cards.${lang}`),
        ])
        setTranslation({ ...translation, [lang]: { i18n, cards: cardsI18n } })
      })()
    }
  }, [lang])

  return (
    <I18nContext.Provider value={translation[lang] ?? translation[defaultLang]}>
      {children}
    </I18nContext.Provider>
  )
}
