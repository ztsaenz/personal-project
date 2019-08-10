import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";
import Logout from "../Logout/Logout";

export default class Home extends React.Component {
  state = {
    user: {},
    projects: [],
    newProject: ""
  };

  componentDidMount() {
    axios
      .get("/api/user")
      .then(res => {
        this.setState({ user: res.data });
        if (!res.data.loggedIn) {
          this.props.history.push("/login");
        }
      })
      .then(() =>
        axios
          .get(`/api/projects/list/${this.state.user.id}`)
          .then(res => {
            this.setState({ projects: res.data });
          })
          .catch(err => alert(err))
      )
      .catch(err => alert(err))

      .catch(err => alert(err));
  }

  handleLogout = () => {
    axios
      .get("/api/logout")
      .then(() => {
        this.props.history.push("/login");
      })
      .catch(console.error);
  };

  createProject = body => {
    return axios
      .post("/api/projects/create", body)
      .then(response => this.setState({ projects: response.data }))

      .catch(console.error);
  };

  promptNewProject = async () => {
    const inputValue = window.prompt("title please");
    const body = { title: inputValue, user_id: this.state.user.id };
    if (body.title === null) {
      return alert("please enter a project");
    } else {
      this.createProject(body);
    }
  };

  deleteProject = param => {    

    return axios
      .delete(`/api/projects/delete/${param}`)
      .then(() =>
        axios.get(`/api/projects/list/${this.state.user.id}`).then(res => {
          this.setState({ projects: res.data });
        })
      )
      .catch(console.error);
  };

  render() {
    return (
      <main className="main">
        <header className="header">
          <section className="welcome">
            Welcome {this.state.user.full_name}
          </section>
          <button onClick={this.promptNewProject}>New Project</button>
          <section className="logout-button">
            <Logout handleLogout={this.handleLogout} />
          </section>
        </header>
        <section className="project-list">
          <ProjectList
            projects={this.state.projects}
            deleteProject={this.deleteProject}
          />
        </section>
      </main>
    );
  }
}

class ProjectList extends React.Component {
  render() {
    const projectList = this.props.projects.map((project, i) => {
      return (
        <div className="project-container" key={i}>
          <Link to={`/projects/${project.project_id}`}>
            <header>{project.title}</header>
          </Link>
          <section className="project-desc">{project.project_id}</section>
          <button onClick={() => this.props.deleteProject(project.project_id)}>
            Delete
          </button>
        </div>
      );
    });
    return <div>{projectList}</div>;
  }
}
