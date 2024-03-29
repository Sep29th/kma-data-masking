import { Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { switchThemeMode } from '../../redux/actions/switch-theme-mode'
import { SwitchThemeMode } from '../../services/switch-theme-mode.ipc'

const Login = () => {
  const dispatch = useDispatch()
  const themeMode = useSelector((state) => state.switchThemeMode)
  const handleChange = async (value) => {
    dispatch(switchThemeMode(await SwitchThemeMode(value)))
  }
  return (
    // <div
    //   style={{
    //     height: '100vh',
    //     width: '100vw',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center'
    //   }}
    // >
    //   <Select
    //     defaultValue={themeMode ? themeMode.choosed : ''}
    //     style={{ width: 120 }}
    //     onChange={handleChange}
    //     options={[
    //       {
    //         value: 'dark',
    //         label: 'Dark'
    //       },
    //       {
    //         value: 'light',
    //         label: 'Light'
    //       },
    //       {
    //         value: 'system',
    //         label: 'System'
    //       }
    //     ]}
    //   />
    // </div>
    <h3>Login page</h3>
  )
}

export default Login
