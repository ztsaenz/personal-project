import React from "react";
import axios from "axios";
import "./Project.css";

export default class Project extends React.Component {
  state = { project: {}, title: "", id: 0, goals: [], notes: [], tasks: [] };

  componentDidMount() {
    axios
      .get(`/api/projects/projectpage/${this.props.match.params.id}`)
      .then(res =>
        this.setState({
          project: res.data.foundProject,
          title: res.data.foundProject[0].title,
          id: res.data.foundProject[0].id,
          goals: res.data.foundGoals,
          notes: res.data.foundNotes,
          tasks: res.data.foundTasks
        })
      )
      .catch(() => console.error);
  }



  render() {
    return (
      <main className="main">
        <header className="header">
          <section>potential image</section>
          <div className="header-title">{this.state.title}</div>
          <section className="header-button-container" />
        </header>
        <Goals
          goals={this.state.goals}
          createTask={this.createTask}
          createNote={this.createNote}
        />
      </main>
    );
  }
}

class Goals extends React.Component {
  render() {
    const displayGoals = this.props.goals.map((goal, i) => {
      return (
        <div key={i} className='goal-card'>
          <section className='goal-card-title'>{goal.title}</section>
          <section className='tasks-container'>
            <Tasks goalId={goal.id} />
          </section>
          
          <section className='notes-container'>
            <Notes goalId={goal.id} />
          </section>
        </div>
      );
    });
    return <div>{displayGoals}</div>;
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

  render() {
    const notes = this.state.notes.map((note, i) => {
      return <div key={i}>{note.body}</div>;
    });
    return (<div>
        {notes}
        <button onClick={() => this.createNote(this.props.goalId)}>
            Add Note
          </button>
        </div>)
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
  render() {
    const displayTasks = this.state.tasks.map((task, i) => {
      return (
        <section key={i}>
          <div className="task">
            {task.title}
            <input type="checkbox" />
          </div>
        </section>
      );
    });
    return (
      <div>
        {displayTasks}
        <button onClick={() => this.createTask(this.props.goalId)}>
          Add Task
        </button>
      </div>
    );
  }
}
