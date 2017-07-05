// ./pages/index.js

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addCounter } from '../redux/modules/test';


@connect(
  (state) => {
    return {
      test: state.test,
    };
  }, {
    addCounter,
  },
)


export default class IndexInner extends Component {
  constructor(props) {
    super(props);

    this._handleBtnOnClick = this._handleBtnOnClick.bind(this);
  }


  _handleBtnOnClick() {
    this.props.addCounter();
  }

  render() {
    const { test } = this.props;

    return (
      <div className="pure-g">
        <div className="pure-u-1-3"></div>
        <div className="pure-u-1-3">
          <h1>Index Inner</h1>
          {test.get('counter')}
        </div>
        <div className="pure-u-1-3"></div>

        <button onClick={this._handleBtnOnClick}>add</button>
      </div>
    );
  }
}
