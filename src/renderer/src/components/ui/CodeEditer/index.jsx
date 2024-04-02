import CodeMirror from '@uiw/react-codemirror'
import { sql, MySQL } from '@codemirror/lang-sql'

const CodeEditer = () => {
  return (
    <CodeMirror
      extensions={[
        sql({
          dialect: MySQL,
          schema: {
            testTable: ['testColumn1', 'testColumn2']
          }
        })
      ]}
      theme={'dark'}
      height="725px"
    />
  )
}

export default CodeEditer
