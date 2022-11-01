import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { HomeCommon } from './components/Common/HomeCommon';
import { HomeInteractive } from './components/Interactive/HomeInteractive';
import { TheProblem } from './components/TheProblem';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={HomeCommon} />
            <Route path='/the-problem' component={TheProblem} />
            <Route path='/interactive' component={HomeInteractive} />
      </Layout>
    );
  }
}
