import { Checkbox, Switch } from 'antd'
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { switchThemeMode } from '../../../redux/actions/switch-theme-mode'
import { SwitchThemeMode } from '../../../services/switch-theme-mode.ipc'

const ThemeModeSwitch = () => {
  const dispatch = useDispatch()
  const themeMode = useSelector((state) => state.switchThemeMode)
  const [systemState, setSystemState] = useState(themeMode.choosed === 'system')
  const [switchState, setSwitchState] = useState(themeMode.render === 'light')
  const handleChangeSystemTheme = async (e) => {
    if (e.target.checked) {
      const tmp = await SwitchThemeMode('system')
      dispatch(switchThemeMode(tmp))
      setSwitchState(tmp.render === 'light')
    }
    setSystemState((systemState) => !systemState)
  }
  const handleSwitchChange = async (checked) => {
    setSwitchState(!switchState)
    dispatch(switchThemeMode(await SwitchThemeMode(checked ? 'light' : 'dark')))
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Switch
        checkedChildren={<BsFillSunFill />}
        unCheckedChildren={<BsFillMoonFill />}
        disabled={systemState}
        checked={switchState}
        defaultChecked={themeMode.render === 'light'}
        onChange={handleSwitchChange}
      />
      <Checkbox checked={systemState} onChange={handleChangeSystemTheme}>
        Use system's theme
      </Checkbox>
    </div>
  )
}

export default ThemeModeSwitch
