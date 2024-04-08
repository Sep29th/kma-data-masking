import { Modal, Form, Input, ConfigProvider, Tree, Row, Col, Alert } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { AiOutlineUser, AiOutlineLock } from 'react-icons/ai'
import { Divider } from 'antd'
import { Descriptions } from 'antd'
import { LoginToDB } from '../../../services/login-to-db.ipc'
import { useDispatch } from 'react-redux'
import { updateCurrentUser } from '../../../redux/actions/update-current-user'
import { updateCurrentDatabase } from '../../../redux/actions/update-current-database'

const updateTreeData = (list, key, children) =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children
      }
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      }
    }
    return node
  })
const TreeDatabase = ({ expanded, setExpanded, treeDb, setTreeDb }) => {
  const currentDatabase = useSelector((state) => state.updateCurrentDatabase)
  const [loginModal, setLoginModal] = useState(false)
  const [databaseInfo, setDatabaseInfo] = useState({ info: [] })
  const [dbInfoForLogin, setDbInfoForLogin] = useState({})
  const [form] = Form.useForm()
  const [errorMessage, setErrorMessage] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [targetExpand, setTargetExpand] = useState('')
  const dispatch = useDispatch()
  const dbInfo = useSelector((state) => state.updateCurrentDatabase)

  const delay = (expandedKeys, _id) =>
    new Promise((resolve) => {
      setTimeout(() => {
        setTreeDb((origin) => {
          const tmp = expandedKeys.split(':')
          const option = tmp[tmp.length - 1]
          if (option === 'tables' && tmp[1] === _id) {
            const tbn = Object.keys(dbInfo.schema)
            return updateTreeData(
              origin,
              expandedKeys,
              tbn.map((tb) => {
                return {
                  title: tb,
                  key: expandedKeys + `:${tb}`,
                  children: dbInfo.schema[tb].map((col) => {
                    return {
                      title: col,
                      key: `${expandedKeys}:${tb}:${col}`
                    }
                  })
                }
              })
            )
          }
        })
        resolve()
      }, 0)
    })

  const onExpand = async (expandedKeys, { node }) => {
    const [type, _id, host, port, username, password, database] = node.key.split(':')
    setDatabaseInfo({
      info: [type, host, port, database],
      key: Object.keys({ type, host, port, database })
    })
    setDbInfoForLogin({
      type: type,
      _id: _id,
      host: host,
      port: port,
      username: username,
      password: password,
      database: database
    })
    if (currentDatabase === null || database !== currentDatabase.name) {
      setLoginModal(true)
      setTargetExpand(node.key)
      setExpanded([])
    } else {
      if (!node.children) {
        await delay(node.key, _id)
      }
      setExpanded(expandedKeys)
    }
  }

  const onFinish = async (value) => {
    setModalLoading(true)
    const tmp = await LoginToDB({ db: dbInfoForLogin, auth: value })
    if (tmp.user) {
      dispatch(updateCurrentUser(tmp.user))
      dispatch(updateCurrentDatabase(tmp.database))
      targetExpand && setExpanded([targetExpand])
      setLoginModal(false)
    } else {
      setErrorMessage(tmp)
    }
    setModalLoading(false)
  }

  return (
    <>
      <div style={{ padding: 10 }}>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: '#252526'
            }
          }}
        >
          <Tree
            showLine
            treeData={treeDb}
            onExpand={onExpand}
            defaultExpandedKeys={expanded}
            selectable={false}
            expandedKeys={expanded}
          />
        </ConfigProvider>
      </div>
      <Modal
        width={'50vw'}
        onOk={() => form.submit()}
        onCancel={() => {
          setLoginModal(false)
          form.resetFields()
          setErrorMessage('')
        }}
        maskClosable={false}
        open={loginModal}
        centered
        okText={'Submit'}
        okButtonProps={{ loading: modalLoading }}
      >
        <Row gutter={[15, 0]}>
          <Col span={12}>
            <Descriptions
              column={2}
              title="Database Info"
              items={databaseInfo.info.map((it, id) => {
                return {
                  key: id,
                  label: databaseInfo.key[id],
                  children: it
                }
              })}
            />
          </Col>
          <Col span={12}>
            <Divider orientation="center">Authentication for this database</Divider>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true
              }}
              onFinish={onFinish}
              form={form}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Username!'
                  }
                ]}
              >
                <Input
                  prefix={<AiOutlineUser className="site-form-item-icon" />}
                  placeholder="Username"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!'
                  }
                ]}
              >
                <Input
                  prefix={<AiOutlineLock className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>
            </Form>
            {errorMessage && (
              <Alert message="Error" description={errorMessage} type="error" showIcon />
            )}
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default TreeDatabase
