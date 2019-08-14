import React from "react";
import axios from "axios";
import "./Project.css";
import Logout from "../Logout/Logout";

export default class Project extends React.Component {
  state = { project: {}, title: "", id: 0, goals: [], notes: [], tasks: [] };

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
          .then(res =>
           { console.log(res.data.foundProject[0].id)

            this.setState({
              project: res.data.foundProject,
              title: res.data.foundProject[0].title,
              id: res.data.foundProject[0].id,
              goals: res.data.foundGoals,
              notes: res.data.foundNotes,
              tasks: res.data.foundTasks
            })}
          )
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

  render() {
    if(!this.state.id) return <div>loading</div>
    return (
      <main className="main">
        <header className="header">
          <section>potential image</section>
          <div className="header-title">{this.state.title}</div>
          <section className="header-button-container">
            <Logout handleLogout={this.handleLogout} />
          </section>
        </header>

        <Goals
          goals={this.state.goals}
          createTask={this.createTask}
          createNote={this.createNote}
          projectId={this.state.id}
        />
      </main>
    );
  }
}

class Goals extends React.Component {

  state = {goals:[]}

  componentDidMount(){
    axios
    .get(`/api/goals/${this.props.projectId}`)
    .then((res)=>{
      this.setState({goals: res.data})
    })
    .catch(console.error)
  }

  deleteGoal = goalId => {
    axios
    .delete(`/api/`)
  }

  render() {
    const displayGoals = this.state.goals.map((goal, i) => {
      return (
        <div key={i} className="goal-card">
          <section className='goal-card-first-section'>
          <section className="goal-card-title">{goal.title}</section>
          <button>X</button>
          </section>
          <section className="tasks-container">
            <Tasks goalId={goal.id} />
          </section>

          <section className="notes-container">
            <Notes goalId={goal.id} />
          </section>
        </div>
      );
    });
    return <section className="goals-container">{displayGoals}</section>;
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

  deleteNote = (noteId)=> {
    axios
    .delete(`/api/notes/delete/${noteId}`)
    .then(  ()=> axios
      .get(`/api/notes/${this.props.goalId}`)
      .then(res => {
        this.setState({ notes: res.data });
      }))
    .catch(console.error)  
  }

  render() {
    const notes = this.state.notes.map((note, i) => {
      return (
        <section key={i} className='note-map'>
        <div className="note" >
          {note.body}
        </div>
        <button className='note-button' onClick={()=>this.deleteNote(note.id)}>X</button>
        </section>
      );
    });
    return (
      <div>
        {notes}
        <button onClick={() => this.createNote(this.props.goalId)}>Add Note</button>
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
    axios.delete(`/api/tasks/delete/${taskId}`).then(()=> 
       axios
      .get(`/api/tasks/${this.props.goalId}`)
      .then(res => this.setState({ tasks: res.data }))
      .catch(console.error)
)}
  
  render() {
    const displayTasks = this.state.tasks.map((task, i) => {
      return (
        <section key={i}>
          <div className="task">
            {task.title}
            <input type="checkbox" />
            <button onClick={()=>this.deleteTask(task.id)}>X</button>
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
