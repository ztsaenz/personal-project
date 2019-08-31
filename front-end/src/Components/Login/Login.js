import React from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import "./Login.css";

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    user: {}
  };

  componentDidMount(){
    axios.get('/api/user').then(res=>{
      this.setState({user:res.data})

      if(res.data.loggedIn) {
        this.props.history.push('/')
      }
    }).catch(err=> alert(err))
  }


  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const body = {
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post("/api/login", body)
      .then((res) => {
        this.setState({user: res.data})
      })
      .then(()=>this.props.history.push('/')).catch(err => alert(err));
  };

  handleEnter = (e) => {
    if (e.which === 13) {
        this.handleSubmit();
    }
}

  render() {
    let { username, password } = this.state;
    return (
      <main className="body">
        <section className="box">
          <section className="box-message">Login Plz</section>
          <section className="input-container">
            <input
              name="username"
              className="box-input"
              placeholder="username"
              value={username}
              onChange={this.handleChange}
              onKeyPress={this.handleEnter}
            />
            <input
              name="password"
              type='password'
              className="box-input"
              placeholder="password"
              value={password}
              onChange={this.handleChange}
              onKeyPress={this.handleEnter}
            />
             <section className = 'link-wrapper'>
          <button className="submit-button" onClick={this.handleSubmit}>
            Submit
          </button>
          </section>
            <section className = 'link-wrapper'>
                <Link className= 'link' to = '/signup'>
                  <button className ='submit-button'>Signup</button>
                  </Link>
                </section>
          </section>
        </section>
      </main>
    );
  }
}

export default Login;
