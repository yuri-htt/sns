const path = require('path')
const NeDB = require('nedb')

// DBに接続
const userDB = new NeDB({
    filename: path.join(__dirname, 'user.db'),
    autoload: true
})

const timelineDB = new NeDB({
    filename: path.join(__dirname, 'timeline.db'),
    autoload: true
})

function getHash(pw) {
    // salt:パスワードの前後に付加することで総当たり攻撃に対するパスワードの強度を高める
    const salt = '::RandomTextAsASalt'
    // crypto:ハッシュ生成を行う標準モジュール
    const crypto = require('crypto')
    const hashsum = crypto.createHash('sha512')
    hashsum.update(pw + salt)
    return hashsum.digest('hex')
}

function getAuthToken(userid) {
    const time = (new Date()).getTime()
    return getHash(`${userid}:${time}`)
}

function getUser(userid, callback) {
    userDB.findOne({userid}, (err, user) => {
        if (err || user === null) return callback(null)
        callback(user)
    })
}

function addUser(userid, passwd, callback) {
    const hash = getHash(passwd)
    const token = getAuthToken(userid)
    const regDoc = {userid, hash, token, friends: {}}
    userDB.insert(regDoc, (err, newdoc) => {
        if (err) return callback(null)
        callback(token)
    })
}

module.exports = {
    userDB, timelineDB, getUser, addUser
}
  