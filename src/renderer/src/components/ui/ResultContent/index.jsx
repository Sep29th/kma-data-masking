import { ConfigProvider } from 'antd'
import { Tabs } from 'antd'
import StickyBox from 'react-sticky-box'
import TableResult from '../TableResult'
import { useSelector } from 'react-redux'

const ResultText = () => {
  const data = useSelector((state) => state.queryResult)
  return (
    <div style={{ paddingLeft: 25 }}>
      {data.tabOneContent.map((i) => (
        <h4>{i}</h4>
      ))}
    </div>
  )
}

const ResultContent = () => {
  const activeTab = useSelector((state) => state.queryResult)
  const items = [
    {
      key: '1',
      label: 'Result',
      children: <ResultText />
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
        activeKey={activeTab.activeTab}
        size={'middle'}
        renderTabBar={renderTabBar}
        items={items}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
      />
    </ConfigProvider>
  )
}

export default ResultContent
