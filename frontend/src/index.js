import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import rootReducer from './_reducers';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer,
                          composeEnhancer(applyMiddleware(thunk)));


//render App component on the root element
ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>,

document.getElementById('root'));

registerServiceWorker();
