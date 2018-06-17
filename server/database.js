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

