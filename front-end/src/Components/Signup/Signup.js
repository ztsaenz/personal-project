import React from "react";
import axios from "axios";
import "./Signup.css";

class Signup extends React.Component {
  state = {
    full_name: "",
    username: "",
    password: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const body = {
      full_name: this.state.full_name,
      username: this.state.username,
      password: this.state.password
    };
    axios
      .post("/api/signup", body)
      .then(() => alert("successfully created new user"))
      .then(() => this.setState({ full_name: "", username: "", password: "" }))
      .catch(console.error);
  };

  render() {
    let { full_name, username, password } = this.state;
    return (
      <body className="body">
        <header className="header" />
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
          </section>
          <button className="submit-button" onClick={this.handleSubmit}>
            Submit
          </button>
        </section>
      </body>
    );
  }
}

export default Signup;
