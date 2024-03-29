import { Button, ConfigProvider, Layout } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const { Sider } = Layout;
import { BsDatabaseAdd, BsDatabase } from "react-icons/bs";
import { AiOutlineMinus } from "react-icons/ai";

const SideBar = () => {
  const themeMode = useSelector(state => state.switchThemeMode);
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={"25%"} collapsedWidth={"25px"}
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
            <Button icon={<BsDatabaseAdd />} size={"small"} shape={"default"} type={"text"} />
            <Button icon={<AiOutlineMinus />} size={"small"} shape={"default"} type={"text"}
                    onClick={() => setCollapsed(true)} />
          </> :
          <ConfigProvider theme={{
            components: {
              Button: {

              }
            }
          }}>
          <Button icon={<BsDatabase />} size={"small"} shape={"default"} type={"text"}
                  onClick={() => setCollapsed(false)}>Database</Button>
          </ConfigProvider>
        }
      </div>
    </Sider>
  );
};

export default SideBar;