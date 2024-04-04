import { Breadcrumb, Button, Divider, Drawer } from 'antd'
import { AiFillSetting } from 'react-icons/ai'
import { useState } from 'react'
import ThemeModeSwitch from '../ThemeModeSwitch'
import { BsDatabase } from 'react-icons/bs'
import { useSelector } from 'react-redux'

const HeaderContent = () => {
  const [open, setOpen] = useState(false)
  const currentDatabase = useSelector((state) => state.updateCurrentDatabase)
  const currentUser = useSelector((state) => state.updateCurrentUser)
  let items = [{ title: <BsDatabase /> }]
  if (currentDatabase) items.push({ title: currentDatabase.name })
  if (currentUser) items.push({ title: currentUser.name })
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Breadcrumb items={items} />
      <Button
        onClick={showDrawer}
        size={'large'}
        shape={'circle'}
        type={'text'}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <AiFillSetting style={{ fontSize: 20 }} />
      </Button>
      <Drawer
        title="Setting"
        onClose={onClose}
        open={open}
        styles={{ header: { marginTop: '35px' } }}
      >
        <Divider orientation={'left'}>Theme mode</Divider>
        <ThemeModeSwitch />
      </Drawer>
    </div>
  )
}

export default HeaderContent
