import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import cookie from 'react-cookies';
import { Route } from 'react-router';
//import './Home.css';
import { userActions } from '../../_actions';
import { connect } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
import { Container, Col, Row } from 'react-bootstrap';

const SidebarLayout = ({component: Component, ...rest}) => {

return(
            <Route {...rest} render={matchProps => (
            <div>
                <Container>
                    <Row style={{ "margin-top": 50 }}>
                        <Col md='auto'>
                            <Sidebar/>
                           {/* <Button style={{ 'text-decoration': 'none', "font-size": 14, "line-height": 10 }} variant="link" onClick={this.selectTopics}>Follow More</Button>*/}
                        </Col>
                        <Col>
                            <Component {...matchProps}></Component>
                        </Col>
                    </Row>
                </Container>
            </div> 
            )} 
            />

        )
            };


export default SidebarLayout;