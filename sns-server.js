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

// API:ユーザーの追加
app.get('/api/adduser', (req, res) => {
    const userid = req.query.userid
    const passwd = req.query.passwd

    if (userid === '' || passwd ===  '') {
        return res.json({status: false, msg: 'パラメータが空です。'})
    }
    // 既存ユーザーであるか
    db.getUser(userid, (user) => {
        if (user) {
            return res.json({status: false, msg: '既にユーザーがいます'})
        }
        // 新規追加
        db.addUser(userid, passwd, (token) => {
            if(!token) {
                res.json({status: false, msg:'DBエラー'})
            }
            res.json({status: true, token})
        })
    })
})

// API:ログイン
app.get('/api/login', (req, res) => {
    const userid = req.query.userid
    const passwd = req.query.passwd
    db.login(userid, passwd, (err, token) => {
        if (err) {
            res.json({status: false, msg: '認証エラー'})
            return
        }
        // ログイン成功したらトークンを返す
        res.json({status: true, token})
    })
})