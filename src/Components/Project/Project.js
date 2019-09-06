import React from "react";
import Popup from "reactjs-popup";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Project.css";
import Logout from "../Logout/Logout";

export default class Project extends React.Component {
  state = {
    project: {},
    title: "",
    id: 0,
    goals: [],
    notes: [],
    tasks: [],
    creator: 0
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
      .then(
        axios
          .get(`/api/projects/projectpage/${this.props.match.params.id}`)
          .then(res => {
            console.log(res.data);

            this.setState({
              project: res.data.foundProject,
              title: res.data.foundProject[0].title,
              id: res.data.foundProject[0].id,
              goals: res.data.foundGoals,
              notes: res.data.foundNotes,
              tasks: res.data.foundTasks,
              users: res.data.foundUsers,
              assignedUsers: res.data.assignedUsers,
              creator: res.data.foundProject[0].creator
            });
          })
      )
      .catch(() => console.error);
  }
  handleLogout = () => {
    axios
      .get("/api/logout")
      .then(() => {
        this.props.history.push("/login");
      })
      .catch(console.error);
  };

  assignUser = userId => {
    const body = {
      project_id: this.state.id,
      user_id: userId
    };

    axios
      .post("/api/projects/adduser", body)
      .then(() => {
        axios.get(`/api/projects/assigned/${this.state.id}`).then(res => {
          this.setState({ assignedUsers: res.data });
        });
      })
      .catch(console.error);
  };

  render() {
    if (!this.state.id) return <div>loading</div>;
    console.log("creator", this.state.creator);
    console.log("user", this.state.user.id);
    const users = this.state.users.map((user, i) => {
      return (
        <div key={i}>
          <button onClick={() => this.assignUser(user.id)}>
            {user.username}
          </button>
        </div>
      );
    });
    const assigned = this.state.assignedUsers.map((user, i) => {
      return <div key={i}>{user.username}</div>;
    });
    return (
      <main className="project-main">
        <section className="project-header-container">
          <header className="project-header">
            <section className='project-header-home-link-container'>
              <Link className='project-home-link' to="/">Home</Link>
            </section>
            <div className="project-header-title">{this.state.title}</div>
            <section className="project-header-button-container">
              <Popup
                trigger={
                  <button className="project-page-button">Assign</button>
                }
                position="left center"
              >
                <div>{users}</div>
              </Popup>
              <Logout handleLogout={this.handleLogout} />
            </section>
          </header>
        </section>

        <Goals
          goals={this.state.goals}
          createTask={this.createTask}
          createNote={this.createNote}
          projectId={this.state.id}
        />
        <section>
          assigned users
          {assigned}
        </section>
      </main>
    );
  }
}

class Goals extends React.Component {
  state = { goals: [] };

  componentDidMount() {
    axios
      .get(`/api/goals/${this.props.projectId}`)
      .then(res => {
        this.setState({ goals: res.data });
      })
      .catch(console.error);
  }

  createGoal = () => {
    const inputValue = window.prompt("new goal");
    const body = {
      title: inputValue,
      project_id: this.props.projectId
    };
    if (body.title === null) {
      return alert("please enter a goal");
    } else {
      axios
        .post("/api/goals/create", body)
        .then(() => {
          axios.get(`/api/goals/${this.props.projectId}`).then(res => {
            this.setState({ goals: res.data });
          });
        })
        .catch(console.error);
    }
  };

  deleteGoal = goalId => {
    axios
      .delete(`/api/goals/delete/${goalId}`)
      .then(() => {
        return axios.get(`/api/goals/${this.props.projectId}`).then(res => {
          this.setState({ goals: res.data });
        });
      })
      .catch(console.error);
  };

  render() {
    const displayGoals = this.state.goals.map((goal, i) => {
      return (
        <div key={i} className="project-goal-card">
          <section className="project-goal-card-first-section">
            <section className="project-goal-card-title">{goal.title}</section>
            <button
              className="project-page-button"
              onClick={() => this.deleteGoal(goal.id)}
            >
              X
            </button>
          </section>
          <Tasks goalId={goal.id} />
          <Notes goalId={goal.id} />
        </div>
      );
    });
    return (
      <div>
        <h1 className="project-new-goal-button-container">
          <button className="project-page-button" onClick={this.createGoal}>
            New Goal
          </button>
        </h1>
        <section className="project-goals-container">{displayGoals}</section>
      </div>
    );
  }
}

class Notes extends React.Component {
  state = { notes: [] };

  componentDidMount() {
    axios
      .get(`/api/notes/${this.props.goalId}`)
      .then(res => {
        this.setState({ notes: res.data });
      })
      .catch(console.error);
  }

  createNote = goalId => {
    const inputValue = window.prompt("New Note");
    const body = { body: inputValue, goal_id: goalId };
    if (body.body === null) {
      return alert("please enter a note");
    } else {
      return axios
        .post("/api/notes/create", body)
        .then(res => this.setState({ notes: res.data }));
    }
  };

  deleteNote = noteId => {
    axios
      .delete(`/api/notes/delete/${noteId}`)
      .then(() =>
        axios.get(`/api/notes/${this.props.goalId}`).then(res => {
          this.setState({ notes: res.data });
        })
      )
      .catch(console.error);
  };

  render() {
    const notes = this.state.notes.map((note, i) => {
      return (
        <div key={i} className="project-note">
          {note.body}
          <button
            className="project-card-delete-button"
            onClick={() => this.deleteNote(note.id)}
          >
            X
          </button>
        </div>
      );
    });
    return (
      <div className="project-notes-container">
        {notes}
        <button
          className="project-card-button"
          onClick={() => this.createNote(this.props.goalId)}
        >
          Add Note
        </button>
      </div>
    );
  }
}

class Tasks extends React.Component {
  state = { tasks: [] };

  componentDidMount() {
    axios
      .get(`/api/tasks/${this.props.goalId}`)
      .then(res => this.setState({ tasks: res.data }));
  }
  createTask = goalId => {
    const inputValue = window.prompt("New Task");
    const body = { title: inputValue, goal_id: goalId };
    if (body.title === null) {
      return alert("please enter a task");
    } else {
      return axios
        .post("/api/tasks/create", body)
        .then(res => this.setState({ tasks: res.data }));
    }
  };
  deleteTask = taskId => {
    axios.delete(`/api/tasks/delete/${taskId}`).then(() =>
      axios
        .get(`/api/tasks/${this.props.goalId}`)
        .then(res => this.setState({ tasks: res.data }))
        .catch(console.error)
    );
  };

  render() {
    const displayTasks = this.state.tasks.map((task, i) => {
      return (
        <section className="project-task" key={i}>
          <input type="checkbox" />
          {task.title}
          <button
            className="project-card-delete-button"
            onClick={() => this.deleteTask(task.id)}
          >
            X
          </button>
        </section>
      );
    });
    return (
      <div className="project-tasks-container">
        {displayTasks}
        <button
          className="project-card-button"
          onClick={() => this.createTask(this.props.goalId)}
        >
          Add Task
        </button>
      </div>
    );
  }
}
