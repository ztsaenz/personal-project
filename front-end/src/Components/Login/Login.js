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

  render() {
    let { username, password } = this.state;
    return (
      <main className="body">
        <header className="header" />
        <section className="box">
          <section className="box-message">Login Plz</section>
          <section className="input-container">
            <input
              name="username"
              className="box-input"
              placeholder="username"
              value={username}
              onChange={this.handleChange}
            />
            <input
              name="password"
              className="box-input"
              placeholder="password"
              value={password}
              onChange={this.handleChange}
            />
            <section className = 'link-wrapper'>
                <Link className= 'link' to = '/signup'>Signup</Link>
                </section>
          </section>
          <button className="submit-button" onClick={this.handleSubmit}>
            Submit
          </button>
        </section>
      </main>
    );
  }
}

export default Login;
