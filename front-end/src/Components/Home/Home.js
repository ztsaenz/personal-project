import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";
import Logout from "../Logout/Logout";
import io from "socket.io-client";

// const messages = []
const socket = io("http://localhost:8080");

socket.on('news', function (data){
  console.log(data)
})

socket.on('chat', function (data){
  console.log(data)
})


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
    } 
    else if (!body.title){
      return alert('do something plz')
   }
    else {
      this.createProject(body);
    }
  };

  deleteProject = (projectId, creatorId) => {
    if (this.state.user.id === Number(creatorId)) {
      axios
        .delete(`/api/projects/delete/${projectId}`)
        .then(() =>
          axios.get(`/api/projects/list/${this.state.user.id}`).then(res => {
            this.setState({ projects: res.data });
          })
        )
        .catch(console.error);
    } else {
      alert("not creator cannot delete project");
    }
  };

  updateProject = async (projectId, body)=>{
    axios
    .put(`/api/projects/edit/${projectId}`, body)
    .then((res)=>this.setState({projects: res.data}))
    .catch(console.error)
  }

  promptUpdateProject = async (projectId, userId)=>{
   const inputValue = window.prompt('edit project title')
   const body = {title: inputValue, user_id: userId}
   if(body.title === null){
     return alert('do something plz')
   } else if (!body.title){
      return alert('do something plz')
   }else {
     this.updateProject(projectId, body)
   }
  }

  render() {
    return (
      <main className="main">
        <header className="header">
          <section className="welcome">
            Welcome {this.state.user.full_name}
          </section>
          <button className='homepage-button' onClick={this.promptNewProject}>New Project</button>
          <section className="logout">
            <Logout handleLogout={this.handleLogout} />
          </section>
        </header>
          <ProjectList
            projects={this.state.projects}
            deleteProject={this.deleteProject}
            userId={this.state.user.id}
            promptUpdateProject={this.promptUpdateProject}
          />
      </main>
    );
  }
}

class ProjectList extends React.Component {
  render() {
    const projectList = this.props.projects.map((project, i) => {
      return (
        <div className="project-container" key={i}>
          <Link className='project-link' to={`/projects/${project.project_id}`}>
            <section className='project-card-title'>{project.title}
            </section>
          </Link> 
            <button className="homepage-button" onClick={()=>this.props.promptUpdateProject(project.project_id, this.props.userId)}>
              edit
              </button>
          <section className='delete-button-container'>
             <button
          className='homepage-button'
            onClick={() =>
              this.props.deleteProject(project.project_id, project.creator)
            }
          >
            Delete
          </button>
          </section>
         
        </div>
      );
    });
    return (
        <div className='project-list'>{projectList}</div>

    );
  }
}

// class Chat extends React.Component {
//   state = {
//     newMessage: "",
//     messages: []
//   };

//   handleChange = (e) => {

//     this.setState({
//       [e.target.name]: e.target.value
//     })
//   }

//   handleSubmit = () => {
//     console.log(this.state.newMessage)
    
//     const body = {message: this.state.newMessage}
//     socket.to('some room').emit('chat', body)
//     // axios
//     // .post('/api/chat/send', body)
//     // .catch(console.error)
//   }
//   render() {
//     const displayMessages = messages.map((message, i) => {
//      return <div key={i}>
//         <div>{message.body}</div>
//         <div>{message.sender}</div>
//       </div>;
//     });
//     return (
//       <div>
//         <section className='chat'>{displayMessages}</section>
//         <form onSubmit={this.handleSubmit}>
//             <input type='text' name='newMessage' value={this.state.newMessage} onChange={this.handleChange} placeholder='new message'/>
//             <input type='submit'/>

//         </form>
//       </div>
//     );
//   }
// }
