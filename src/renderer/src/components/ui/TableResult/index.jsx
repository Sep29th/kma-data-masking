import { ConfigProvider, Dropdown, Table } from 'antd'
import { useContext } from 'react'
import { HeightContext } from '../../layouts/PublicLayout'
import { useSelector } from 'react-redux'

const TableResult = () => {
  const heightContext = useContext(HeightContext)
  const dataTable = useSelector((state) => state.queryResult)
  const currentUser = useSelector((state) => state.updateCurrentUser)
  return (
    <ConfigProvider theme={{ token: { padding: 5 } }}>
      {dataTable.tabTwoContent.columns ? (
        <Table
          dataSource={dataTable.tabTwoContent.dataSource}
          columns={
            currentUser.role === 'admin'
              ? dataTable.tabTwoContent.columns.map((o) => {
                  return {
                    ...o,
                    title: (
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: 'Mask this column',
                              children: [
                                { key: 'email', label: 'Email' },
                                { key: 'phone', label: 'Phone number' },
                                {
                                  key: 'hide',
                                  label: 'Hide all'
                                },
                                { key: 'random', label: 'Random String' },
                                { key: 'static', label: 'Static string' }
                              ]
                            }
                          ],
                          onClick: async (a) => {
                            await window.electron.ipcRenderer.send(
                              'main:mask-column',
                              o.title,
                              a.key,
                              currentUser._databases
                            )
                          }
                        }}
                        trigger={['contextMenu']}
                      >
                        <p style={{ margin: 0 }}>{o.title}</p>
                      </Dropdown>
                    )
                  }
                })
              : dataTable.tabTwoContent.columns
          }
          pagination={false}
          bordered={true}
          scroll={{ y: parseInt(heightContext?.current?.state?.height, 10) - 76 }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p>Dont have result to show</p>
        </div>
      )}
    </ConfigProvider>
  )
}

export default TableResult
