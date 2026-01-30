---
name: features-spellchecker
description: Built-in spellchecker in Electron — enable, set languages, context menu suggestions, and dictionary URL.
---

# Spellchecker

Electron uses Chromium’s spellchecker (Hunspell on Windows/Linux, native APIs on macOS). It is enabled by default in Electron 9+; for Electron 8 set `webPreferences.spellcheck: true`.

## Enable

```js
const win = new BrowserWindow({
  webPreferences: {
    spellcheck: true  // default true in Electron 9+
  }
})
```

## Set languages (Windows/Linux)

On macOS the system spellchecker and language are used; you cannot set the language from Electron. On Windows and Linux use the session API:

```js
win.webContents.session.setSpellCheckerLanguages(['en-US', 'fr'])
const languages = win.webContents.session.availableSpellCheckerLanguages
```

Default is the OS locale. Pass an array of locale codes (e.g. `en-US`, `fr`).

## Context menu with suggestions

On the `context-menu` event, `params` includes `misspelledWord` and `dictionarySuggestions`. Build a menu with suggestions and “Add to dictionary” when applicable:

```js
win.webContents.on('context-menu', (event, params) => {
  const menu = Menu.buildFromTemplate(
    params.dictionarySuggestions.map(suggestion => ({
      label: suggestion,
      click: () => win.webContents.replaceMisspelling(suggestion)
    }))
  )
  if (params.misspelledWord) {
    menu.append(new MenuItem({
      label: 'Add to dictionary',
      click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
    }))
  }
  menu.popup({ window: win, x: params.x, y: params.y })
})
```

Use `webContents.replaceMisspelling(word)` to replace the current misspelling and `session.addWordToSpellCheckerDictionary(word)` to add a word to the dictionary.

## Dictionary download URL (Windows/Linux)

Hunspell dictionaries are downloaded from a URL. By default Electron uses a Google CDN. To use your own or avoid that URL:

```js
win.webContents.session.setSpellCheckerDictionaryDownloadURL('https://example.com/dictionaries/')
```

See the [session API](https://www.electronjs.org/docs/latest/api/session#sessetspellcheckerdictionarydownloadurlurl) for the expected directory layout and file naming.

## Key points

- Spellcheck is on by default (Electron 9+). Set languages with `session.setSpellCheckerLanguages(['en-US', ...])` on Windows/Linux.
- Use `context-menu` params (`misspelledWord`, `dictionarySuggestions`) to build a suggestion menu; use `replaceMisspelling` and `addWordToSpellCheckerDictionary` for actions.
- Optionally set `setSpellCheckerDictionaryDownloadURL` for custom dictionary hosting.

<!--
Source references:
- https://github.com/electron/electron/blob/main/docs/tutorial/spellchecker.md
- https://www.electronjs.org/docs/latest/tutorial/spellchecker
- https://www.electronjs.org/docs/latest/api/session
-->
