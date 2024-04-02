import { ConfigProvider, Table } from 'antd'
import { useContext } from 'react'
import { HeightContext } from '../../layouts/PublicLayout'

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street'
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street'
  },
  {
    key: '3',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street'
  },
  {
    key: '4',
    name: 'John',
    age: 42,
    address: '10 Downing Street'
  },
  {
    key: '5',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street'
  },
  {
    key: '6',
    name: 'John',
    age: 42,
    address: '10 Downing Street'
  },
  {
    key: '7',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street'
  },
  {
    key: '8',
    name: 'John',
    age: 42,
    address: '10 Downing Street'
  },
  {
    key: '9',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street'
  },
  {
    key: '10',
    name: 'John',
    age: 42,
    address: '10 Downing Street'
  },
  {
    key: '11',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street'
  },
  {
    key: '12',
    name: 'John',
    age: 42,
    address: '10 Downing Street'
  }
]

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  }
]
const TableResult = () => {
  const heightContext = useContext(HeightContext)
  return (
    <ConfigProvider theme={{ token: { padding: 5 } }}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        scroll={{ y: parseInt(heightContext?.current?.state?.height, 10) - 76 }}
      />
    </ConfigProvider>
  )
}

export default TableResult
