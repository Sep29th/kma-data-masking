import { ConfigProvider } from 'antd'
import { Tabs, theme } from 'antd'
import StickyBox from 'react-sticky-box'
import TableResult from '../TableResult'

const ResultContent = () => {
  const items = [
    {
      key: '1',
      label: 'Result',
      children: <h2 style={{ margin: 0 }}>result</h2>
    },
    {
      key: '2',
      label: 'Table',
      children: <TableResult />
    }
  ]
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
          background: '#1E1E1E'
        }}
      />
    </StickyBox>
  )
  return (
    <ConfigProvider theme={{ token: { colorBorderSecondary: '#1E1E1E' } }}>
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={{
          left: <span style={{ width: '25px', display: 'inline-block' }}></span>
        }}
        size={'middle'}
        renderTabBar={renderTabBar}
        items={items}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
      />
    </ConfigProvider>
  )
}

export default ResultContent
