import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

const CodeEditer = () => {
  return (
    <CodeMirror
      extensions={[sql({})]}
      theme={"dark"}
    />
  );
};

export default CodeEditer;