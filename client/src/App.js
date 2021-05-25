import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import About from './About'
import HomePage from './HomePage'
import LandingPage from './LandingPage'
import PageNotFound from './PageNotFound'
import PasswordSet from './PasswordSet'
import Report from './Report'
import SignUp from './SignUp'
function App() {
  return (
    <div className="app" >
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/about" component={About} />
          <Route path="/home" component={HomePage} />
          <Route path="/signUp" component={SignUp} />
          <Route path="/report" render={(routeProps) => <Report {...routeProps} />} />
          <Route path="/passwordSet" render={(routeProps) => <PasswordSet {...routeProps} />} />
          <Route path="/*" component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
