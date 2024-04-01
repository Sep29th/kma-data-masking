import { Button, ConfigProvider, Layout, Modal, Tree } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const { Sider } = Layout;
import { BsDatabaseAdd, BsDatabase } from "react-icons/bs";
import { AiOutlineMinus } from "react-icons/ai";

const treeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        children: [
          {
            title: "leaf",
            key: "0-0-0-0"
          },
          {
            title: "leaf",
            key: "0-0-0-1"
          },
          {
            title: "leaf",
            key: "0-0-0-2"
          }
        ]
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: "leaf",
            key: "0-0-1-0"
          }
        ]
      },
      {
        title: "parent 1-2",
        key: "0-0-2",
        children: [
          {
            title: "leaf",
            key: "0-0-2-0"
          },
          {
            title: "leaf",
            key: "0-0-2-1"
          }
        ]
      }
    ]
  }
];
const SideBar = ({ width }) => {
  const themeMode = useSelector(state => state.switchThemeMode);
  const [collapsed, setCollapsed] = useState(false);
  const [addDatabaseModal, setAddDatabaseModal] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const onExpand = (expandedKeys) => {
    setExpanded(expandedKeys);
  };

  return (
    <>
      <Sider trigger={null} collapsible collapsed={collapsed} width={width} collapsedWidth={"25px"}
             theme={themeMode.render}>
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: themeMode.render === "dark" ? "#4C5052" : "#cccccc",
          transform: collapsed ? "rotate(90deg)" : "none",
          transition: collapsed ? "transform 400ms" : "none"
        }}>
          {!collapsed ?
            <>
              <Button onClick={() => setAddDatabaseModal(true)} icon={<BsDatabaseAdd />} size={"small"}
                      shape={"default"} type={"text"} />
              <Button icon={<AiOutlineMinus />} size={"small"} shape={"default"} type={"text"}
                      onClick={() => setCollapsed(true)} />
            </> :
            <Button icon={<BsDatabase />} size={"small"} shape={"default"} type={"text"}
                    onClick={() => setCollapsed(false)}>Database</Button>
          }
        </div>
        {!collapsed && <div style={{ padding: 10 }}>
          <ConfigProvider theme={{
            token: {
              colorBgContainer: "#252526"
            }
          }}>
            <Tree
              showLine
              treeData={treeData}
              onExpand={onExpand}
              defaultExpandedKeys={expanded}
            />
          </ConfigProvider>
        </div>}
      </Sider>
      <Modal title="Vertically centered modal dialog"
             centered open={addDatabaseModal} onOk={() => setAddDatabaseModal(false)}
             onCancel={() => setAddDatabaseModal(false)}>
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </>
  );
};

export default SideBar;