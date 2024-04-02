import './App.css'

import { ConfigProvider, Layout, Spin, theme } from 'antd'
import { ConfigRoute } from './routes'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { SwitchThemeMode } from './services/switch-theme-mode.ipc'
import { switchThemeMode } from './redux/actions/switch-theme-mode'
import TitleBar from './components/ui/TitleBar'

const App = () => {
  const themeMode = useSelector((state) => state.switchThemeMode)
  const dispatch = useDispatch()
  useEffect(() => {
    ;(async () => {
      const data = await window.electron.ipcRenderer.invoke('main:post-switch-theme-mode')
      setTimeout(() => {
        dispatch(switchThemeMode(data))
      }, 1500)
    })()
  }, [])
  return (
    <>
      {themeMode ? (
        <div
          style={{
            backgroundColor: themeMode.render === 'dark' ? '#252526' : '#FFFFFF',
            height: '100vh',
            width: '100vw'
          }}
        >
          <ConfigProvider
            theme={{
              algorithm: themeMode.render === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
              token: {
                colorPrimary: '#26A6A3',
                borderRadius: 0
              },
              components: {
                Layout: {
                  siderBg: '#252526',
                  headerBg: '#1E1E1E'
                },
                Drawer: {
                  zIndexPopup: 998
                },
                Tabs: {
                  cardPadding: '2px 20px',
                  cardGutter: -1,
                  horizontalItemPadding: '2px',
                  horizontalItemGutter: 25
                },
                Table: {
                  headerBorderRadius: 0,
                  headerBg: '#474747',
                  rowHoverBg: '#474747'
                }
              }
            }}
          >
            <TitleBar />
            <ConfigRoute />
          </ConfigProvider>
        </div>
      ) : (
        <div
          style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#3C3C3C'
          }}
        >
          <div className="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
