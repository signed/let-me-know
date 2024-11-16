import { expect, test } from 'vitest'
import { type CheerioAPI, load } from 'cheerio'

let page: string

test('taetigkeitsschluessel', async () => {
  page = 'https://www.arbeitsagentur.de/unternehmen/betriebsnummern-service/taetigkeitsschluessel'
  expect(
    await latestVersionAt(($) => $('h3:contains("Download aktuelle Version")').parent().children('p + p').text()),
  ).toEqual('Schlüsselverzeichnis 2010 – Stand 03/2024 (2,3 MB)')
})

test('fail', () => {
  expect(false).toEqual(true)
})

const latestVersionAt = async (extractor: ($: CheerioAPI) => string): Promise<string> => {
  let api = await fetchAndParsePage(page)
  if (api === 'failed') {
    return 'failed to load and parse '
  }
  try {
    return extractor(api)
  } catch (e) {
    return 'failed to extract version information'
  }
}

async function fetchAndParsePage(page: string): Promise<CheerioAPI | 'failed'> {
  try {
    const response = await fetch(page)
    const html = await response.text()
    return load(html)
  } catch (e) {
    return 'failed'
  }
}
