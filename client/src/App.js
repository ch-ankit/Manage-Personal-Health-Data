import React, { lazy } from 'react'
import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import DoctorLanding from './DoctorLanding';
import Notification from './Notification';
const About = lazy(() => import('./About'));
const Chose = lazy(() => import('./Chose'));
const DocumentViewer = lazy(() => import('./DocumentViewer'));
const HomeDrawer = lazy(() => import('./HomeDrawer'));
const HomeNav = lazy(() => import('./HomeNav'));
const HomePage = lazy(() => import('./HomePage'));
const LandingPage = lazy(() => import('./LandingPage'));
const LandingPageDoc = lazy(() => import('./LandingPageDoc'));
const PageNotFound = lazy(() => import('./PageNotFound'));
const PasswordSet = lazy(() => import('./PasswordSet'));
const PatientDocuments = lazy(() => import('./PatientDocuments'))
const Report = lazy(() => import('./Report'))
const SignUp = lazy(() => import('./SignUp'))
const SignUpDoc = lazy(() => import('./SignUpDoc'));
const ListPage = lazy(() => import('./ListPage'));
const ReportUpload = lazy(() => import('./ReportUpload'));
const ReportView = lazy(() => import('./ReportView'));
function App() {
  return (
    <div className="app" >
      <Router>
        <Suspense fallback={() => <p>Loading</p>}>
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
                <Route path="/home/lastVisited" component={ListPage} />
                <Route path="/home/documentViewer" component={DocumentViewer} />
                <Route path="/home/uploadReport" component={ReportUpload} />
                <Route path="/home/uploadRecord" component={Report} />
                <Route path="/home/reportView" component={ReportView} />
              </Switch>
            </Route>
            <Route path="/Doctor">
              <HomeNav />
              <HomeDrawer doctor={true} />
              <Switch>
                <Route exact path="/Doctor">
                  <DoctorLanding />
                </Route>
              </Switch>
            </Route>
            <Route path="/passwordSet/doctor" render={(routeProps) => <PasswordSet doctor={true} {...routeProps} />} />
            <Route path="/passwordSet" render={(routeProps) => <PasswordSet doctor={false} {...routeProps} />} />
            <Route path="/doc/home">
              {/* <HomeNav /> */}
              <HomeDrawer doctor={true} />
              <LandingPageDoc />
            </Route>
            <Route path="/doc" component={SignUpDoc} />
            <Route path="/test" render={() => <Notification />} />
            <Route path="/*" component={PageNotFound} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
