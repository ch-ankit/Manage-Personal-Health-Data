import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import About from './About'
import Chose from './Chose'
import DocumentViewer from './DocumentViewer'
import HomeDrawer from './HomeDrawer'
import HomeNav from './HomeNav'
import HomePage from './HomePage'
import LandingPage from './LandingPage'
import LandingPageDoc from './LandingPageDoc'
import PageNotFound from './PageNotFound'
import PasswordSet from './PasswordSet'
import PatientDocuments from './PatientDocuments'
import Report from './Report'
import SignUp from './SignUp'
import SignUpDoc from './SignUpDoc'
function App() {
  return (
    <div className="app" >
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/about" component={About} />
          <Route path="/signUpPatient" component={SignUp} />
          <Route path="/signUp" component={Chose} />
          <Route path="/home">
            <HomeNav />
            <HomeDrawer doctor={false} />
            <Switch>
              <Route exact path='/home'>
                <HomePage />
              </Route>
              <Route path='/home/documents'>
                <PatientDocuments />
              </Route>
              <Route path="/home/documentViewer" component={DocumentViewer} />
              <Route path="/home/report" component={Report} />
            </Switch>
          </Route>
          <Route path="/passwordSet" render={(routeProps) => <PasswordSet {...routeProps} />} />
          <Route path="/doc/home">
            {/* <HomeNav /> */}
            <HomeDrawer doctor={true} />
            <LandingPageDoc />
          </Route>
          <Route path="/doc" component={SignUpDoc} />
          <Route path="/*" component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
