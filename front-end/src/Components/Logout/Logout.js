import React from 'react';
// import axios from 'axios';
import './Logout.css';

class Logout extends React.Component {



    render(){
        return(
            <button className='button' onClick={()=>this.props.handleLogout()}>Logout</button>
        )
    }
}

export default Logout;