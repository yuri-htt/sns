// *------------
// Webサーバー
// ------------*

// DBに接続
const db = require('./server/database')

// Webサーバー起動
const express = require('express')
const app = express()
const portNo = 3001
app.listen(portNo, () => {
  console.log('起動しました', `http://localhost:${portNo}`)
})

