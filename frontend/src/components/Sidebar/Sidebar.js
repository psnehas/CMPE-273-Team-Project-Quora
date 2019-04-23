import React, { Component } from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

class Sidebar extends Component {
    render() {
        let sidebar_body = this.props.links.map(link => {
            return (
                <Nav.Link as={NavLink} to={link.url}>{link.name}</Nav.Link>
            )
        });

        return (
            <Nav style={{ "font-size": 14, "line-height": 10}} className="flex-column" >
                {sidebar_body}
            </Nav>
        );
    }
}

export default Sidebar;