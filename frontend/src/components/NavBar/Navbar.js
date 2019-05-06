import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
//import { Redirect } from 'react-router';
//import './Navbar.css';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown, Button, InputGroup, Form } from 'react-bootstrap';
import AddModal from './Add_Q_Modal';

//create the Navbar Component
class navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_add: false,
            search: {
                input: "",
                catagory: ""
            }
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

    onChangeHandler = (e) => {
        let search = { ...this.state.search };
        search[e.target.id] = e.target.value;
        this.setState({ search });
      };

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
                    <NavDropdown.Item as={NavLink} to ={`/profile/${this.props.authentication.user_id}`}>Profile</NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to ={`/messages/${this.props.authentication.user_id}`}>Messages</NavDropdown.Item>
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

        let modalClose = () => this.setState({ show_add: false });

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
                    <Link to='/' style={{ color: 'red', 'textDecoration': 'none' }}>QUORA</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={NavLink} to="/"><span className="fa fa-home"></span> Home</Nav.Link>
                    </Nav>

                    <Nav className="ml-auto">
                        {/* <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form> */}
                        <InputGroup>
                            <Form.Control
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                value={this.state.search.input}
                                id="input"
                                onChange={this.onChangeHandler}
                            />
                            <InputGroup.Append>
                                <Form.Control as="select" value={this.state.search.catagory} id="catagory" onChange={this.onChangeHandler}>
                                    <option value="user">User</option>
                                    <option value="quesiton">Question</option>
                                    <option value="topic">Topic</option>
                                </Form.Control>
                                <Button variant="outline-secondary" onClick={this.onSearchHandler}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Nav>
                    {navLogin}

                    <Button variant="danger"
                        disabled={!authentication.loggedIn}
                        onClick={this.handleAdd}
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