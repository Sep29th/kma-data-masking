import { Button, Layout, Modal, Form, Tag, Row, Col, Input, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GrMysql } from 'react-icons/gr'

const { Sider } = Layout
import { BsDatabaseAdd, BsDatabase } from 'react-icons/bs'
import { AiOutlineLogout, AiOutlineMinus } from 'react-icons/ai'
import TreeDatabase from '../TreeDatabase'
import { GetSavedDatabase } from '../../../services/get-saved-database.ipc'
import { updateCurrentUser } from '../../../redux/actions/update-current-user'
import { updateCurrentDatabase } from '../../../redux/actions/update-current-database'
import { resetResult } from '../../../redux/actions/result-query'

const SideBar = ({ width }) => {
  const themeMode = useSelector((state) => state.switchThemeMode)
  const [collapsed, setCollapsed] = useState(false)
  const [addDatabaseModal, setAddDatabaseModal] = useState(false)
  const [expanded, setExpanded] = useState([])
  const [treeDb, setTreeDb] = useState([])
  const [form] = Form.useForm()
  const [resetTreeDB, setResetTreeDB] = useState(false)
  const currentUser = useSelector((state) => state.updateCurrentUser)
  const dispatch = useDispatch()
  const handleSubmit = () => {
    form.submit()
    setAddDatabaseModal(false)
  }
  const handleSubmitForm = async (values) => {
    await window.electron.ipcRenderer.invoke('main:post-add-database', values)
    setResetTreeDB((resetTreeDB) => !resetTreeDB)
  }
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
              }
            ]
          }
        })
      )
    })()
  }, [resetTreeDB])
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
              <div>
                {currentUser && (
                  <Tooltip title={'Logout'}>
                    <Button
                      icon={<AiOutlineLogout />}
                      size={'small'}
                      shape={'default'}
                      type={'text'}
                      onClick={() => {
                        dispatch(updateCurrentUser(null))
                        dispatch(updateCurrentDatabase(null))
                        dispatch(resetResult())
                        setExpanded([])
                      }}
                    />
                  </Tooltip>
                )}
                <Button
                  icon={<AiOutlineMinus />}
                  size={'small'}
                  shape={'default'}
                  type={'text'}
                  onClick={() => setCollapsed(true)}
                />
              </div>
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
        title="Add database"
        centered
        width={'50vw'}
        open={addDatabaseModal}
        onOk={handleSubmit}
        onCancel={() => setAddDatabaseModal(false)}
      >
        <Form layout={'vertical'} form={form} onFinish={handleSubmitForm}>
          <Row gutter={[15, 0]}>
            <Col span={12}>
              <Form.Item label={'Host'} name={'host'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label={'Port'} name={'port'} rules={[{ required: true }]}>
                <Input type={'number'} />
              </Form.Item>
              <Form.Item label={'Database'} name={'database'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label={'Username'} name={'username'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label={'Password'} name={'password'} rules={[{ required: true }]}>
                <Input type={'password'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={'Login admin name'} name={'admin'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label={'Login admin password'}
                name={'adminPass'}
                rules={[{ required: true }]}
              >
                <Input type={'password'} />
              </Form.Item>
              <Form.Item label={'Key for masking'} name={'key'} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}

export default SideBar
