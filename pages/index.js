// ./pages/index.js

// Import React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';


import IndexInner from '../components/IndexInner';
import storeCreator from '../redux/storeCreator';



// Import the Head Component
import Head from 'next/head'
import Link from 'next/link'

import axios from 'axios';



// Export an anonymous arrow function
// which returns the template
export default class Index extends Component {

  static async getInitialProps({ req, res, pathname, query, store }) {

    /*
    if (!process.browser) {
      const res = await axios.get('http://api.football-data.org/v1/competitions/426/leagueTable')

      return {
        data: res.data,
      };
    } else {
      return {
        data: JSON.parse(sessionStorage.getItem('bpl')),
      };
    }*/
    console.log('store', store);

    const isServer = !!req;
    const store = storeCreator('', isServer);

    if (req) {
      console.log('pathname', pathname);
      console.log('query', query);
      console.log('req', req.headers);
      console.log('store.getState()', store.getState());
    }

    return {
      data: {
        standing: [],
      },
      initialState: store.getState(),
      isServer,
    };
  }

  static propTypes = {
    userAgent: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.store = storeCreator(props.initialState, props.isServer);
  }

  componentDidMount () {
    if(!sessionStorage.getItem('bpl')) sessionStorage.setItem('bpl', JSON.stringify(this.props.data))
  }

  render() {

    const logoStyle = {
      width: '30px',
    };

    return (

      <Provider store={this.store}>
        <div>
          <Head>
            <title>League Table</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" href="https://unpkg.com/purecss@0.6.1/build/pure-min.css" />
          </Head>

          {/*
          <div className="pure-g">
              <div className="pure-u-1-3"></div>
              <div className="pure-u-1-3">
                <h1>Barclays Premier League</h1>
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Team</th>
                      <th>P</th>
                      <th>GL</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.props.data.standing.map((standing, i) => {
                    const oddOrNot = i % 2 == 1 ? "pure-table-odd" : "";
                    return (
                        <tr key={i} className={oddOrNot}>
                          <td>{standing.position}</td>
                          <td><img className="pure-img logo" src={standing.crestURI} style={logoStyle}/></td>
                          <td>{standing.points}</td>
                          <td>{standing.goals}</td>
                          <td>{standing.wins}</td>
                          <td>{standing.draws}</td>
                          <td>{standing.losses}</td>
                          <td><Link href={`/details?id=${standing.position}`}>More...</Link></td>
                        </tr>
                      );
                  })}
                  </tbody>
                </table>
              </div>
              <div className="pure-u-1-3"></div>
          </div>
          */}
          <IndexInner />
        </div>
      </Provider>
    );
  }
}
