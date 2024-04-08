import CodeMirror from '@uiw/react-codemirror'
import { sql, MySQL } from '@codemirror/lang-sql'
import { useSelector } from 'react-redux'
import { forwardRef, useEffect } from 'react'
import ReactCodeMirror from '@uiw/react-codemirror'

const CodeEditer = forwardRef((_, ref) => {
  const db = useSelector((state) => state.updateCurrentDatabase)
  return (
    <ReactCodeMirror
      ref={ref}
      extensions={[
        sql({
          dialect: MySQL,
          schema: db.schema ?? {}
        })
      ]}
      theme={'dark'}
      height="725px"
      aria-multiselectable={false}
    />
  )
})

export default CodeEditer
