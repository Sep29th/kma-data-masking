import { ConfigProvider, Tabs, theme } from "antd";
import CodeEditer from "../CodeEditer";
import StickyBox from "react-sticky-box";

const MainContent = () => {
  const items = [
    {
      key: "1",
      label: "Console",
      children: <CodeEditer />
    },
    {
      key: "2",
      label: "Authorization",
      children: <h2>hehe</h2>
    }
  ];
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox
      offsetTop={0}
      style={{
        zIndex: 1
      }}
    >
      <DefaultTabBar
        {...props}
        style={{
          background: colorBgContainer
        }}
      />
    </StickyBox>
  );
  return (
    <ConfigProvider theme={{ token: { borderRadius: 0 }, components: { Tabs: { cardPadding: "2px 20px", cardGutter: -1 } } }}>
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={"middle"}
        renderTabBar={renderTabBar}
        items={items}
        style={{ width: "100%", height: "100%", overflow: "auto" }}
      />
    </ConfigProvider>
  );
};

export default MainContent;