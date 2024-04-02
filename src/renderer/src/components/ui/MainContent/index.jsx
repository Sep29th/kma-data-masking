import { Button, Tabs, theme } from 'antd'
import CodeEditer from '../CodeEditer'
import StickyBox from 'react-sticky-box'
import { useState } from 'react'
import { VscRunAbove } from 'react-icons/vsc'
import { Tooltip } from 'antd'
import Authorization from '../Authorization'

const MainContent = () => {
  const [currentTab, setCurrentTab] = useState('1')
  const items = [
    {
      key: '1',
      label: 'Console',
      children: <CodeEditer />
    },
    {
      key: '2',
      label: 'Authorization',
      children: <Authorization />
    }
  ]
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
  return (
    <Tabs
      defaultActiveKey="1"
      type="card"
      size={'middle'}
      onChange={(key) => setCurrentTab(key)}
      renderTabBar={renderTabBar}
      items={items}
      tabBarExtraContent={{
        right: currentTab === '1' && (
          <Tooltip placement="left" title="Execute">
            <Button
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
