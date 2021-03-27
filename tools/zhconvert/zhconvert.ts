/// <reference path="./opencc.d.ts" />

import fs from 'fs'
import { Converter } from 'opencc-js'

import specialStrings from './specialStrings'

const convert = Converter({ from: 'cn', to: 'twp' })

const filePrefixes = ['cards.', '']

filePrefixes.forEach(async (filePrefix) => {
  const data = await fs.promises.readFile(
    `./src/i18n/${filePrefix}zh-Hans.ts`,
    'utf8',
  )
  await fs.promises.writeFile(
    `./src/i18n/${filePrefix}zh-Hant.ts`,
    (await convert)(
      Object.entries(specialStrings).reduce(
        (data, [from, to]) =>
          data.replace(
            new RegExp(from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'),
            to,
          ),
        data,
      ),
    ),
  )
  console.log(`File "${filePrefix}zh-Hant.json" has been saved!`)
})

specialStrings.forEach
