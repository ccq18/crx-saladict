import AppConfig from 'src/app-config'

/**
 * @param {object} config - old config befroe extension update
 * @return {object} old config merged into default config
 */
export default function mergeConfig (config) {
  var base = new AppConfig()
  if (config.active !== undefined) { base.active = Boolean(config.active) }
  if (config.searhHistory !== undefined) { base.searhHistory = Boolean(config.searhHistory) }
  if (config.newWordSound !== undefined) { base.newWordSound = Boolean(config.newWordSound) }

  if (typeof config.mode === 'string' && /^(icon|direct|double|ctrl)$/.test(config.mode)) {
    base.mode = {
      icon: false,
      direct: false,
      double: false,
      ctrl: false
    }
    base.mode[config.mode] = true
  } else if (config.mode) {
    ['icon', 'direct', 'double', 'ctrl'].forEach(k => {
      if (typeof config.mode[k] === 'boolean') {
        base.mode[k] = config.mode[k]
      }
    })
  }

  if (typeof config.pinMode === 'string' && /^(direct|double|ctrl)$/.test(config.pinMode)) {
    base.pinMode = {
      direct: false,
      double: false,
      ctrl: false
    }
    base.pinMode[config.pinMode] = true
  } else if (config.pinMode) {
    ['direct', 'double', 'ctrl'].forEach(k => {
      if (typeof config.pinMode[k] === 'boolean') {
        base.pinMode[k] = config.pinMode[k]
      }
    })
  }

  if (typeof config.doubleClickDelay === 'number' && !isNaN(config.doubleClickDelay)) {
    base.doubleClickDelay = config.doubleClickDelay
  }
  if (config.tripleCtrl !== undefined) { base.tripleCtrl = Boolean(config.tripleCtrl) }
  if (typeof config.tripleCtrlPreload === 'string') {
    if (/^clipboard|selection$/.test(config.tripleCtrlPreload)) {
      base.tripleCtrlPreload = config.tripleCtrlPreload
    } else {
      base.tripleCtrlPreload = ''
    }
  }
  if (config.tripleCtrlAuto !== undefined) { base.tripleCtrlAuto = Boolean(config.tripleCtrlAuto) }
  if (config.tripleCtrlLocation >= 0 && config.tripleCtrlLocation <= 8) {
    base.tripleCtrlLocation = config.tripleCtrlLocation
  }

  if (typeof config.baPreload === 'string') {
    if (/^clipboard|selection$/.test(config.baPreload)) {
      base.baPreload = config.baPreload
    } else {
      base.baPreload = ''
    }
  }
  if (config.baAuto !== undefined) { base.baAuto = Boolean(config.baAuto) }

  if (config.language) {
    Object.keys(base.language).forEach(k => {
      if (config.language[k] !== undefined) { base.language[k] = Boolean(config.language[k]) }
    })
  }

  if (config.autopron) {
    if (config.autopron.cn) {
      const id = config.autopron.cn.dict
      if (base.dicts.all[id]) {
        base.autopron.cn.dict = id
      }
    }
    if (config.autopron.en) {
      const id = config.autopron.en.dict
      if (base.dicts.all[id]) {
        base.autopron.en.dict = id
      }
      if (/^(uk|us)$/i.test(config.autopron.en.accent)) {
        base.autopron.en.accent = config.autopron.en.accent.toLowerCase()
      }
    }
  }

  if (config.dicts) {
    if (Array.isArray(config.dicts.selected)) {
      let selected = config.dicts.selected.filter(id => base.dicts.all[id])
      if (selected.length > 0) { base.dicts.selected = selected }
    }
    if (config.dicts.all) {
      Object.keys(base.dicts.all).forEach(id => {
        let dict = config.dicts.all[id]
        if (!dict) { return }
        let baseDict = base.dicts.all[id]
        if (!String(dict.page)) { baseDict.page = String(dict.page) }
        if (dict.defaultUnfold !== undefined) { baseDict.defaultUnfold = Boolean(dict.defaultUnfold) }
        if (!isNaN(Number(dict.preferredHeight))) { baseDict.preferredHeight = Number(dict.preferredHeight) }
        if (dict.showWhenLang) {
          Object.keys(baseDict.showWhenLang).forEach(opt => {
            if (typeof dict.showWhenLang[opt] === 'boolean') {
              baseDict.showWhenLang[opt] = dict.showWhenLang[opt]
            }
          })
        }
        if (dict.options) {
          Object.keys(baseDict.options).forEach(opt => {
            if (typeof dict.options[opt] === 'boolean') {
              baseDict.options[opt] = dict.options[opt]
            } else if (!isNaN(dict.options[opt])) {
              baseDict.options[opt] = Number(dict.options[opt])
            }
          })
        }
      })
    }
  }

  if (config.contextMenu) {
    if (Array.isArray(config.contextMenu.selected)) {
      if (config.contextMenu.selected.length <= 0) {
        base.contextMenu.selected = []
      } else {
        let selected = config.contextMenu.selected.filter(id => base.contextMenu.all[id])
        if (selected.length > 0) { base.contextMenu.selected = selected }
      }
    }

    // added at v5.20.0, enable by default
    if (!config.contextMenu.all['youdao_page_translate']) {
      base.contextMenu.selected.push('youdao_page_translate')
    }
  }

  return base
}
