import { Button, Layout, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GrMysql } from 'react-icons/gr'

const { Sider } = Layout
import { BsDatabaseAdd, BsDatabase } from 'react-icons/bs'
import { AiOutlineMinus } from 'react-icons/ai'
import TreeDatabase from '../TreeDatabase'
import { GetSavedDatabase } from '../../../services/get-saved-database.ipc'
import { Tag } from 'antd'

const SideBar = ({ width }) => {
  const themeMode = useSelector((state) => state.switchThemeMode)
  const [collapsed, setCollapsed] = useState(false)
  const [addDatabaseModal, setAddDatabaseModal] = useState(false)
  const [expanded, setExpanded] = useState([])
  const [treeDb, setTreeDb] = useState([])
  useEffect(() => {
    ;(async () => {
      setTreeDb(
        (await GetSavedDatabase()).map((item, index) => {
          return {
            title: (
              <Tag icon={<GrMysql />}>{` mysql://${item.host}:${item.port}/${item.database}`}</Tag>
            ),
            key: `${item.type}:${item._id}:${item.host}:${item.port}:${item.username}:${item.password}:${item.database}`,
            children: [
              {
                title: 'Tables',
                key: `${item.type}:${item._id}:${item.host}:${item.port}:${item.username}:${item.password}:${item.database}:tables`,
                isLeaf: false
              },
              {
                title: 'Manager',
                key: `${item.type}:${item._id}:${item.host}:${item.port}:${item.username}:${item.password}:${item.database}:manager`,
                isLeaf: true
              }
            ]
          }
        })
      )
    })()
  }, [])
  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={width}
        collapsedWidth={'25px'}
        theme={themeMode.render}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: themeMode.render === 'dark' ? '#4C5052' : '#cccccc',
            transform: collapsed ? 'rotate(90deg)' : 'none',
            transition: collapsed ? 'transform 400ms' : 'none'
          }}
        >
          {!collapsed ? (
            <>
              <Button
                onClick={() => setAddDatabaseModal(true)}
                icon={<BsDatabaseAdd />}
                size={'small'}
                shape={'default'}
                type={'text'}
              />
              <Button
                icon={<AiOutlineMinus />}
                size={'small'}
                shape={'default'}
                type={'text'}
                onClick={() => setCollapsed(true)}
              />
            </>
          ) : (
            <Button
              icon={<BsDatabase />}
              size={'small'}
              shape={'default'}
              type={'text'}
              onClick={() => setCollapsed(false)}
            >
              Database
            </Button>
          )}
        </div>
        {!collapsed && (
          <TreeDatabase
            expanded={expanded}
            setExpanded={setExpanded}
            treeDb={treeDb}
            setTreeDb={setTreeDb}
          />
        )}
      </Sider>
      <Modal
        title="Vertically centered modal dialog"
        centered
        open={addDatabaseModal}
        onOk={() => setAddDatabaseModal(false)}
        onCancel={() => setAddDatabaseModal(false)}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </>
  )
}

export default SideBar
