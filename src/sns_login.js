import React, {Component} from 'react'
import request from 'superagent'
import {Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styles from './styles'

export default class SNSLogin extends Component {
    constructor(props) {
        super(props)
        this.state = { userid: '', passwd: '', jump: '', msg: '' }
    }

    // APIを呼びだし、トークンを得てlocalStorageに保存する
    api(command) {
        request
        .get('/api/' + command)
        .query({
            userid: this.state.userid,
            passwd: this.state.passwd
        })
        .end((err, res) => {
            if (err) return
            const r = res.body
            console.log(r)
            if (r.status && r.token) {
            // 認証トークンをlocalStorageに保存
            window.localStorage['sns_id'] = this.state.userid
            window.localStorage['sns_auth_token'] = r.token
            this.setState({jump: '/timeline'})
            return
            }
            this.setState({msg: r.msg})
        })
    }

    render() {
        if (this.state.jump) {
            return <Redirect to={this.state.jump} />
        }
        
        const changed = (name, e) => this.setState({[name]: e.target.value})
        return (
            <div style={styles.scene}>
                <div style={styles.modal}>
                    <h1 style={styles.title}>MEMBER</h1>
                    <form style={styles.login} noValidate autoComplete="off">

                        <TextField
                            id="name"
                            label="Name"
                            className={styles.textField}
                            style={styles.textField}
                            value={this.state.userid}
                            onChange={e => changed('userid', e)}
                            margin="normal"
                        />
                        <br />
                        <TextField
                            id="password-input"
                            label="Password"
                            type="password"
                            className={styles.textField}
                            style={styles.textField}
                            value={this.state.passwd}
                            onChange={e => changed('passwd', e)}
                            autoComplete="current-password"
                            margin="normal"
                        />
                    </form>

                    <div style={styles.buttonContainer}>
                        <Button variant="raised" color="primary" onClick={e => this.api('login')} style={styles.button}>
                            LOGIN
                        </Button>

                        <p style={styles.error}>{this.state.msg}</p>

                        <Button variant="raised" color="primary" onClick={e => this.api('adduser')} style={styles.button}>
                            SIGN IN
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
