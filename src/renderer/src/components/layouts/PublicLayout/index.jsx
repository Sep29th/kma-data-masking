import { Layout } from "antd";
import SideBar from "../../ui/SideBar";

const PublicLayout = () => {
  return (
    <Layout style={{ height: "calc(100vh - 35px)", width: "100vw" }}>
      <SideBar/>
    </Layout>
  )
}
export default PublicLayout