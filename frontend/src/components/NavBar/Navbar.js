import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
//import { Redirect } from 'react-router';
//import './Navbar.css';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown, Button, Form, FormControl } from 'react-bootstrap';
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
                <Nav>
                    <Nav.Link as={NavLink} to="/login"><span className="fa fa-sign-in"></span> Login</Nav.Link>
                    <Nav.Link as={NavLink} to="/signup"><span className="fa fa-user-plus"></span> SignUp</Nav.Link>
                </Nav>
            )
        }

        let modalClose = () => this.setState({ show_add: false });

        return (

            <Navbar bg="light" expand="md">
                <Navbar.Brand>
                    <Link to='/' style={{ color: 'red', 'text-decoration': 'none' }}>CWORA</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} to="/"><span className="fa fa-home"></span> Home</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Nav>
                    {navLogin}

                    <Button variant="danger"
                        disabled={!authentication.loggedIn}
                        onClick={this.handleAdd}
                        /*{authentication.loggedIn ? this.handleAdd : null}*/>Add Question</Button>
                </Navbar.Collapse>


                <AddModal
                    show={this.state.show_add}
                    onHide={modalClose}
                    afterAdd={this.afterAdd}
                    user_name={authentication.first_name + ' ' + authentication.last_name}
                />
            </Navbar>
        )
    }
}

//export default Navbar;
const mapStateToProps = ({ authentication }) => ({ authentication });
// apply above mapping to Login class
export default connect(mapStateToProps)(navbar);