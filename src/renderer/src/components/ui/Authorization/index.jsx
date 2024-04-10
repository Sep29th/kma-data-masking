import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button, Col, Divider, Form, Input, Row, Select, Avatar } from 'antd'
import { useSelector } from 'react-redux'
import { AiOutlineUser } from 'react-icons/ai'

const Authorization = () => {
  const [items, setItems] = useState({})
  const [reset, setReset] = useState(false)
  const currentUser = useSelector((state) => state.updateCurrentUser)
  const [formCreateUser] = Form.useForm()
  const [formCreateGroup] = Form.useForm()
  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceList = [...items[source.droppableId]]
      const destList = [...items[destination.droppableId]]
      const [removed] = sourceList.splice(source.index, 1)
      destList.splice(destination.index, 0, removed)
      setItems({
        ...items,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList
      })
    } else {
      const list = [...items[source.droppableId]]
      const [removed] = list.splice(source.index, 1)
      list.splice(destination.index, 0, removed)
      setItems({ ...items, [source.droppableId]: list })
    }
  }

  const handleCreateUser = async (values) => {
    values._databases = currentUser._databases
    values.role = 'user'
    await window.electron.ipcRenderer.invoke('main:create-user', values)
    formCreateUser.resetFields()
    setReset(!reset)
  }

  const handleCreateGroup = async (values) => {
    values._databases = currentUser._databases
    values._users = []
    await window.electron.ipcRenderer.invoke('main:create-group', values)
    formCreateGroup.resetFields()
    setReset(!reset)
  }

  useEffect(() => {
    console.log(items)
  }, [items])

  useEffect(() => {
    ;(async () => {
      setItems(
        await window.electron.ipcRenderer.invoke(
          'main:handle-manager-authorization',
          currentUser._databases
        )
      )
    })()
  }, [reset])

  return (
    <>
      <Divider orientation={'left'}>Create User</Divider>
      <Form layout={'vertical'} onFinish={handleCreateUser} form={formCreateUser}>
        <Row gutter={[15, 0]}>
          <Col span={6}>
            <Form.Item name={'username'} label={'Username'} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'password'} label={'Password'} rules={[{ required: true }]}>
              <Input type={'password'} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={'personal_permission'}
              label={'Permission'}
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: '100%'
                }}
                options={[
                  { label: 'read', value: 'read' },
                  { label: 'create', value: 'create' },
                  {
                    label: 'update',
                    value: 'update'
                  },
                  { label: 'delete', value: 'delete' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={' '}>
              <Button type={'primary'} htmlType={'submit'}>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider orientation={'left'}>Create Group</Divider>
      <Form layout={'vertical'} form={formCreateGroup} onFinish={handleCreateGroup}>
        <Row gutter={[15, 0]}>
          <Col span={6}>
            <Form.Item name={'name'} label={'Name'} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={'permission'} label={'Permission'} rules={[{ required: true }]}>
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: '100%'
                }}
                options={[
                  { label: 'read', value: 'read' },
                  { label: 'create', value: 'create' },
                  {
                    label: 'update',
                    value: 'update'
                  },
                  { label: 'delete', value: 'delete' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={' '}>
              <Button type={'primary'} htmlType={'submit'}>
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider orientation={'left'}>Manager</Divider>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Row>
          {Object.entries(items).map(([listId, listItems]) => (
            <>
              <Col span={6} style={{ border: '1px solid #ffffff' }}>
                <h3 style={{ margin: '10px 10px 0 10px', backgroundColor: '#686868' }}>{listId}</h3>
                <hr />
                <Droppable droppableId={listId} key={listId}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {listItems.map((item, index) => (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div
                                style={{
                                  backgroundColor: '#2d2d2d',
                                  marginBottom: 8,
                                  padding: 5,
                                  borderRadius: 5
                                }}
                              >
                                <Avatar icon={<AiOutlineUser />} />
                                <span
                                  style={{ display: 'inline-block', marginLeft: 10, fontSize: 16 }}
                                >
                                  {item}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
            </>
          ))}
        </Row>
      </DragDropContext>
    </>
  )
}

export default Authorization
