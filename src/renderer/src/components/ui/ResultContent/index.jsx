import { ConfigProvider, Spin } from 'antd'
import { Tabs } from 'antd'
import StickyBox from 'react-sticky-box'
import TableResult from '../TableResult'
import { useSelector } from 'react-redux'
import { ImSpinner10 } from 'react-icons/im'

const ResultText = () => {
  const data = useSelector((state) => state.queryResult)
  return (
    <div style={{ paddingLeft: 25 }}>
      {data.tabOneContent.map((i) => (
        <p>{i}</p>
      ))}
    </div>
  )
}

const ResultContent = () => {
  const activeTab = useSelector((state) => state.queryResult)
  const loading = useSelector((state) => state.resultLoading)
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
          left: <span style={{ width: '25px', display: 'inline-block' }}></span>,
          right: loading && (
            <Spin
              indicator={<ImSpinner10 />}
              size="large"
              style={{ marginRight: 20, marginTop: 20 }}
            />
          )
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
