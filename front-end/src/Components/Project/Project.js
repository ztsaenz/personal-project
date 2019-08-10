import React from "react";
import axios from "axios";
import "./Project.css";

export default class Project extends React.Component {
  state = { project: {}, title: "", id: 0 };

  componentDidMount() {
    axios
      .get(`/api/projects/${this.props.match.params.id}`)
      .then(response => {
        this.setState({
          project: response.data[0],
          title: response.data[0].title,
          id: response.data[0].id
        });
      })
      
      .catch(() => console.error);
  }

  render() {
    return (
      <main>
        <div>{this.state.title} </div>
      </main>
    );
  }
}
