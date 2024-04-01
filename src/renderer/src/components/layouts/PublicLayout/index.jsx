import { Layout } from "antd";
import SideBar from "../../ui/SideBar";
import { Resizable } from "re-resizable";
import HeaderContent from "../../ui/HeaderContent";
import MainContent from "../../ui/MainContent";
import { useRef, useState } from "react";

const { Content, Header } = Layout;

const PublicLayout = () => {
  const [stateHeight, setStateHeight] = useState(200);
  const refa = useRef(null);
  return (
    <Layout style={{ height: "calc(100vh - 35px)", overflow: "auto", width: "100vw" }}>
      <SideBar width={"25%"} />
      <Layout>
        <Header>
          <HeaderContent />
        </Header>
        <Content>
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: `calc(100% - ${stateHeight}px)`,
                minHeight: "100px",
                padding: "5px",
                backgroundColor: "#141414"
              }}>
              <MainContent />
            </div>
            <Resizable ref={refa} enable={{
              bottom: false,
              right: false,
              left: false,
              bottomLeft: false,
              bottomRight: false,
              topRight: false,
              topLeft: false,
              top: true
            }} onResize={(a) => {
              setStateHeight(refa.current.state.height);
            }} style={{ backgroundColor: "#1e1e1e" }}
                       defaultSize={{ height: `200px`, width: "100%" }} minHeight={"50px"}>
              <div>kjasdljaslkd</div>
            </Resizable>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default PublicLayout;