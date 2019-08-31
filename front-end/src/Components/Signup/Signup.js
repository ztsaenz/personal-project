import React from "react";
import axios from "axios";
import "./Signup.css";
import { Link } from "react-router-dom";
import Login from "../Login/Login";

class Signup extends React.Component {
  state = {
    full_name: "",
    username: "",
    password: ""
  };

  componentDidMount() {
    axios.get("/api/user").then(res => {
      this.setState({ user: res.data });
      if (res.data.loggedIn) {
        this.props.history.push("/");
      }
    });
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const body = {
      full_name: this.state.full_name,
      username: this.state.username,
      password: this.state.password,
      user: {}
    };
    axios
      .post("/api/signup", body)
      .then(() => alert("successfully created new user"))
      .then(() => {
        axios
          .post("/api/login", {
            username: this.state.username,
            password: this.state.password
          })
          .then(res => {
            this.setState({ user: res.data });
          })
          .then(() => this.props.history.push("/"))
          .catch(err => alert(err));
      })
      .then(() => this.setState({ full_name: "", username: "", password: "" }))
      .catch(console.error);
  };

  render() {
    let { full_name, username, password } = this.state;
    return (
      <body className="body">
        <header className="signup-header" />
        <section className="box">
          <section className="box-message">Sign Up Plz</section>
          <section className="input-container">
            <input
              name="full_name"
              className="box-input"
              placeholder="full_name"
              value={full_name}
              onChange={this.handleChange}
            />
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
            <section className="link-wrapper">
              <button className="submit-button" onClick={this.handleSubmit}>
                Submit
              </button>
              </section>
              <section className="link-wrapper">
                <Link to="/login" component={Login}>
                  <button className="submit-button">Return to Login</button>
                </Link>
            </section>
          </section>
        </section>
      </body>
    );
  }
}

export default Signup;
