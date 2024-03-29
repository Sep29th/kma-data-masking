import { useSelector } from "react-redux";
import logo from "../../../../../resources/logo.svg";
import { Avatar, Button, ConfigProvider } from "antd";
import { VscChromeMinimize, VscChromeClose, VscChromeMaximize, VscChromeRestore } from "react-icons/vsc";
import { useEffect, useState } from "react";

const TitleBar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const themeMode = useSelector(state => state.switchThemeMode);
  useEffect(() => {
    (async () => {
      setIsMinimized(await window.electron.ipcRenderer.invoke("window-state"));
    })();
  }, []);
  return (
    <div style={{
      width: "100vw",
      height: "35px",
      backgroundColor: themeMode.render === "dark" ? "#323233" : "#dddddd",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: "999",
      position: "relative"
    }} className={"drag"}>
      <div style={{ paddingLeft: "10px" }}><Avatar src={<img src={logo} alt="avatar" />} size={"default"} /></div>
      <div className={"no-drag"} style={{ display: "flex", gap: "5px", marginRight: "5px" }}>
        <ConfigProvider theme={{
          components: {
            Button: {
              defaultHoverBorderColor: "#FAAD14",
              defaultHoverBg: "#FAAD14",
              defaultHoverColor: "#fff"
            }
          }
        }}>
          <Button onClick={() => {
            window.electron.ipcRenderer.send("minimize-btn");
          }} shape={"circle"} size={"small"} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}><VscChromeMinimize /></Button>
        </ConfigProvider>
        <ConfigProvider theme={{
          components: {
            Button: {
              defaultHoverBorderColor: "#52C41A",
              defaultHoverBg: "#52C41A",
              defaultHoverColor: "#fff"
            }
          }
        }}>
          {isMinimized ? <Button onClick={() => {
            window.electron.ipcRenderer.send("restore-down-btn")
            setIsMinimized((isMinimized) => !isMinimized)
          }} shape={"circle"} size={"small"} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}><VscChromeRestore /></Button> : <Button onClick={() => {
            window.electron.ipcRenderer.send("maximize-btn")
            setIsMinimized((isMinimized) => !isMinimized)
          }} shape={"circle"} size={"small"} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}><VscChromeMaximize /></Button>}</ConfigProvider>
        <ConfigProvider theme={{
          components: {
            Button: {
              defaultHoverBorderColor: "#FF4D4F",
              defaultHoverBg: "#FF4D4F",
              defaultHoverColor: "#fff"
            }
          }
        }}>
          <Button onClick={() => {
            window.electron.ipcRenderer.send("close-btn");
          }} shape={"circle"} size={"small"} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}><VscChromeClose /></Button>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default TitleBar;