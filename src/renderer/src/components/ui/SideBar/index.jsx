import { Button, Layout, Modal } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const { Sider } = Layout;
import { BsDatabaseAdd, BsDatabase } from "react-icons/bs";
import { AiOutlineMinus } from "react-icons/ai";
import TreeDatabase from "../TreeDatabase";
import { GetSavedDatabase } from "../../../services/get-saved-database.ipc";

const SideBar = ({ width }) => {
  const themeMode = useSelector((state) => state.switchThemeMode);
  const [collapsed, setCollapsed] = useState(false);
  const [addDatabaseModal, setAddDatabaseModal] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [treeDb, setTreeDb] = useState(false);
  useEffect(() => {
    (async () => {
      const tmp = await GetSavedDatabase();
      const tmp2 = tmp.map((item, index) => {
        return {
          title: `<${item.host}:${item.port}> - ${item.database}`,
          key: index + "",
          children: [
            {
              title: "Tables",
              key: index + "-tables",
              isLeaf: false
            }, {
              title: "Manager",
              key: index + "-manager",
              isLeaf: true
            }
          ]
        };
      });
      setTreeDb(tmp2);
    })();
  }, []);
  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={width}
        collapsedWidth={"25px"}
        theme={themeMode.render}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: themeMode.render === "dark" ? "#4C5052" : "#cccccc",
            transform: collapsed ? "rotate(90deg)" : "none",
            transition: collapsed ? "transform 400ms" : "none"
          }}
        >
          {!collapsed ? (
            <>
              <Button
                onClick={() => setAddDatabaseModal(true)}
                icon={<BsDatabaseAdd />}
                size={"small"}
                shape={"default"}
                type={"text"}
              />
              <Button
                icon={<AiOutlineMinus />}
                size={"small"}
                shape={"default"}
                type={"text"}
                onClick={() => setCollapsed(true)}
              />
            </>
          ) : (
            <Button
              icon={<BsDatabase />}
              size={"small"}
              shape={"default"}
              type={"text"}
              onClick={() => setCollapsed(false)}
            >
              Database
            </Button>
          )}
        </div>
        {!collapsed && (
          <TreeDatabase expanded={expanded} setExpanded={setExpanded} treeDb={treeDb} setTreeDb={setTreeDb}/>
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
  );
};

export default SideBar;
