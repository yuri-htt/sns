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

// API:友達追加
app.get('/api/add_friend', (req, res) => {
    const userid = req.query.userid
    const token = req.query.token
    const friendid = req.query.friendid

    db.checkToken(userid, token, (err, user) => {
        if (err) {
            res.json({status: false, msg:'認証エラー'})
            return
        }
        user.friends[friendid] = true
        db.updateUser(user, (err) => {
            if (err) {
                res.json({status: false, msg: 'DBエラー'})
                return
            }
            res.json({status: true})
        })
    })
})

// API:自分のタイムラインに発言

// API:ユーザの一覧を取得

// API:ユーザ情報を取得

// API:友達のタイムラインを取得

// 静的ファイルを自動的に返すようルーティング
app.use('/public', express.static('./public'))
app.use('/login', express.static('./public'))
app.use('/users', express.static('./public'))
app.use('/timeline', express.static('./public'))
app.use('/', express.static('./public'))