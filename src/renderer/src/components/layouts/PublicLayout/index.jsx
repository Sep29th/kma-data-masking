import { Layout } from 'antd'
import SideBar from '../../ui/SideBar'
import { Resizable } from 're-resizable'
import HeaderContent from '../../ui/HeaderContent'
import MainContent from '../../ui/MainContent'
import { createContext, useRef, useState } from 'react'
import ResultContent from '../../ui/ResultContent'

const { Content, Header } = Layout
export const HeightContext = createContext(null)

const PublicLayout = () => {
  const [stateHeight, setStateHeight] = useState(280)
  const refa = useRef(null)
  return (
    <Layout style={{ height: 'calc(100vh - 35px)', overflow: 'auto', width: '100vw' }}>
      <SideBar width={'25%'} />
      <Layout>
        <Header style={{ padding: '10px' }}>
          <HeaderContent />
        </Header>
        <Content>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: `calc(100% - ${stateHeight}px)`,
                minHeight: '100px',
                padding: '5px',
                backgroundColor: '#141414'
              }}
            >
              <MainContent />
            </div>
            <Resizable
              ref={refa}
              enable={{
                bottom: false,
                right: false,
                left: false,
                bottomLeft: false,
                bottomRight: false,
                topRight: false,
                topLeft: false,
                top: true
              }}
              onResize={() => {
                setStateHeight(refa.current.state.height)
              }}
              style={{ backgroundColor: '#1e1e1e' }}
              defaultSize={{ height: `${stateHeight}px`, width: '100%' }}
              minHeight={'50px'}
            >
              <HeightContext.Provider value={refa}>
                <ResultContent />
              </HeightContext.Provider>
            </Resizable>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
export default PublicLayout
