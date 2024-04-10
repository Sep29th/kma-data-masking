import { Button, Tabs, theme } from 'antd'
import CodeEditer from '../CodeEditer'
import StickyBox from 'react-sticky-box'
import { useRef, useState } from 'react'
import { VscRunAbove } from 'react-icons/vsc'
import { Tooltip } from 'antd'
import Authorization from '../Authorization'
import { useSelector } from 'react-redux'
import { RunQuery } from '../../../services/run-query'
import { useDispatch } from 'react-redux'
import { applyResult } from '../../../redux/actions/result-query'
import { resultLoading } from '../../../redux/actions/result-loading'

const MainContent = () => {
  const [currentTab, setCurrentTab] = useState('1')
  const currentUser = useSelector((state) => state.updateCurrentUser)
  const codeEditor = useRef(null)
  const dispatch = useDispatch()
  const items = [
    {
      key: '1',
      label: 'Console',
      children: <CodeEditer ref={codeEditor} />
    }
  ]
  if (currentUser.role === 'admin')
    items.push({
      key: '2',
      label: 'Authorization',
      children: <Authorization />
    })
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox
      offsetTop={0}
      style={{
        zIndex: 1
      }}
    >
      <DefaultTabBar
        {...props}
        style={{
          background: colorBgContainer
        }}
      />
    </StickyBox>
  )
  const handleRunConsole = async () => {
    dispatch(resultLoading(true))
    let selectionText = codeEditor.current.view.viewState.state.selection.ranges
      .map((i) => codeEditor.current.view.viewState.state.sliceDoc(i.from, i.to))
      .join('; ')
    if (!selectionText) selectionText = codeEditor.current.view.viewState.state.sliceDoc()
    const result = await RunQuery(selectionText, currentUser)
    dispatch(resultLoading(false))
    dispatch(applyResult(result))
  }
  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      size={'middle'}
      onChange={(key) => {
        setCurrentTab(key)
      }}
      renderTabBar={renderTabBar}
      items={items}
      tabBarExtraContent={{
        right: currentTab === '1' && (
          <Tooltip placement="left" title="Execute">
            <Button
              onClick={handleRunConsole}
              id={'BUTTON_RUN_QUERY'}
              size="small"
              shape="circle"
              type="primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20
              }}
            >
              <VscRunAbove />
            </Button>
          </Tooltip>
        )
      }}
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
    />
  )
}

export default MainContent
