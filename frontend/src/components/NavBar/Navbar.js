import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
//import { Redirect } from 'react-router';
//import './Navbar.css';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown,Button } from 'react-bootstrap';
import AddModal from './Add_Q_Modal';

//create the Navbar Component
class navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_add: false          
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.afterAdd = this.afterAdd.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        this.props.dispatch(userActions.logout());
        cookie.remove('JWT', { path: '/' });
    }

    handleAdd = (e) => {
        e.preventDefault();
        this.setState({
            show_add: true,
            user_name: this.props.authentication.first_name + ' ' + this.props.authentication.last_name,
        })
    }

    afterAdd = () => {
        this.setState({
            show_add: false
        })
    }

    render() {
        //if Cookie is set render Logout Button

        const { authentication } = this.props;

        let navLogin = null;
        if (authentication.loggedIn === true) {
            //           let userId = cookie.load('userId');
            //           console.log("Able to read cookie");
            navLogin = (
                <NavDropdown title={authentication.first_name} id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={this.handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
            );
        }
        else {
            //  Else display login button
            //          console.log("Not Able to read cookie");
            navLogin = (
                <Nav className="ml-auto">
                    <Nav.Link as={NavLink} to="/login"><span className="fa fa-sign-in"></span> Login</Nav.Link>
                    <Nav.Link as={NavLink} to="/signup"><span className="fa fa-user-plus"></span> SignUp</Nav.Link>
                </Nav>
            )
        }

        let modalClose = () => this.setState({show_add : false});

        let addmodal = null;
        if (this.state.show_add === true) {
            addmodal = (
            <AddModal
                show={this.state.show_add}
                user_name={this.state.user_name}
                onHide={modalClose}
                afteradd={this.afterAdd}
            />
        )
        }
        return (

            <Navbar bg="light" expand="md">
                <Navbar.Brand>
                    <Link to='/' style={{color: 'red', 'textDecoration': 'none'}}>CWORA</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} to="/"><span className="fa fa-home"></span> Home</Nav.Link>
                    </Nav>
                    {navLogin}

                    <Button variant="danger"
                        disabled={!authentication.loggedIn}
                        onClick= {this.handleAdd} 
                        /*{authentication.loggedIn ? this.handleAdd : null}*/>Add Question</Button>
                </Navbar.Collapse>

            {addmodal}

            </Navbar>
        )
    }
}

//export default Navbar;
const mapStateToProps = ({ authentication }) => ({ authentication });
// apply above mapping to Login class
export default connect(mapStateToProps)(navbar);