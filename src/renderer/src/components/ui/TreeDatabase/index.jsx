import { ConfigProvider, Tree } from "antd";

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
  const onExpand = (expandedKeys) => {
    setExpanded(expandedKeys);
  };

  // const onLoadData = async ({ key, children }) => {
  //   if (children) return
  //   setTimeout(() => {
  //     setTreeDb((origin) =>
  //       updateTreeData(origin, key, [
  //         {
  //           title: "Child Node",
  //           key: `${key}-0`
  //         },
  //         {
  //           title: "Child Node",
  //           key: `${key}-1`
  //         }
  //       ])
  //     );
  //   }, 1000)
  // }
  const onLoadData = ({ key, children }) => (
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setTreeDb((origin) =>
          updateTreeData(origin, key, [
            {
              title: "Child Node",
              key: `${key}-0`
            },
            {
              title: "Child Node",
              key: `${key}-1`
            }
          ])
        );
        resolve();
      }, 1000);
    })
  );

  return (
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
          loadData={onLoadData}
        />
      </ConfigProvider>
    </div>
  );
};

export default TreeDatabase;