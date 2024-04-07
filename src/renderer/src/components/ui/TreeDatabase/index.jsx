import { Modal, Form, Input, ConfigProvider, Tree, Row, Col, Alert } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { Divider } from "antd";
import { Descriptions } from "antd";
import { LoginToDB } from "../../../services/login-to-db.ipc";

const updateTreeData = (list, key, children) =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      };
    }
    return node;
  });
const TreeDatabase = ({ expanded, setExpanded, treeDb, setTreeDb }) => {
  const currentDatabase = useSelector((state) => state.updateCurrentDatabase);
  const [loginModal, setLoginModal] = useState(false);
  const [databaseInfo, setDatabaseInfo] = useState({ info: [] });
  const [dbInfoForLogin, setDbInfoForLogin] = useState({});
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");

  const delay = (expandedKeys) =>
    new Promise((resolve) => {
      setTimeout(() => {
        setTreeDb((origin) =>
          updateTreeData(origin, expandedKeys, [
            {
              title: "Child Node",
              key: `${expandedKeys}-0`
            },
            {
              title: "Child Node",
              key: `${expandedKeys}-1`
            }
          ])
        );
        resolve();
      }, 1000);
    });

  const onExpand = async (expandedKeys, { node }) => {
    const [type, _id, host, port, username, password, database] = expandedKeys[0].split(":");
    setDatabaseInfo({
      info: [type, host, port, database],
      key: Object.keys({ type, host, port, database })
    });
    setDbInfoForLogin({
      type: type,
      _id: _id,
      host: host,
      port: port,
      username: username,
      password: password,
      database: database
    });
    if (currentDatabase === null || database !== currentDatabase.name) {
      setLoginModal(true);
      setExpanded([]);
    } else {
      if (!node.children) {
        await delay(node.key);
      }
      setExpanded(expandedKeys);
    }
  };

  const onFinish = async (value) => {
    const tmp = await LoginToDB({ db: dbInfoForLogin, auth: value });
    setErrorMessage(tmp)
  };

  return (
    <>
      <div style={{ padding: 10 }}>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: "#252526"
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
        width={"50vw"}
        onOk={() => form.submit()}
        onCancel={() => setLoginModal(false)}
        maskClosable={false}
        open={loginModal}
        centered
        okText={"Submit"}
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
                };
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
                    message: "Please input your Username!"
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
                    message: "Please input your Password!"
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
            {errorMessage && <Alert
              message="Error"
              description={errorMessage}
              type="error"
              showIcon
            />}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TreeDatabase;
