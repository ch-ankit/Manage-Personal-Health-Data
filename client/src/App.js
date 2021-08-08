import React, { lazy } from 'react'
import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory ,Redirect} from 'react-router-dom'
import AddDoctor from './AddDoctor';
import DoctorLanding from './DoctorLanding';
const FriendList = lazy(() => import('./FriendList'));
const Notification = lazy(() => import('./Notification'));
const About = lazy(() => import('./About'));
const Chose = lazy(() => import('./Chose'));
const DocumentViewer = lazy(() => import('./DocumentViewer'));
const HomeDrawer = lazy(() => import('./HomeDrawer'));
const HomeNav = lazy(() => import('./HomeNav'));
const HomePage = lazy(() => import('./HomePage'));
const LandingPage = lazy(() => import('./LandingPage'));
const PageNotFound = lazy(() => import('./PageNotFound'));
const PasswordSet = lazy(() => import('./PasswordSet'));
const PatientDocuments = lazy(() => import('./PatientDocuments'))
const Report = lazy(() => import('./Report'))
const SignUp = lazy(() => import('./SignUp'))
const SignUpDoc = lazy(() => import('./SignUpDoc'));
const ListPage = lazy(() => import('./ListPage'));
const ReportUpload = lazy(() => import('./ReportUpload'));
const ReportView = lazy(() => import('./ReportView'));
const ShareDocuments = lazy(() => import("./ShareDocuments"));
const RecentPatientDocuments = lazy(() => import("./RecentPatientDocuments"));
const SharedDocuments = lazy(() => import("./SharedDocuments"));
function App() {
  const history=useHistory()
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
                <Route path="/home/shareDocuments" component={ShareDocuments} />
                <Route path="/home/sharedDocuments" component={SharedDocuments} />
                <Route path="/home/addDoc" render={(routeProps) => <AddDoctor {...routeProps} />} />
                <Route path="/home/notifications" doctor={false} component={Notification} />
                <Route path="/home/*">
                  <Redirect to="/pageNotFound" />
                </Route> 
              </Switch>
            </Route>
            <Route path="/Doctor">
              <HomeNav doctor={true} />
              <HomeDrawer doctor={true} />
              <Switch>
                <Route exact path="/Doctor">
                  <DoctorLanding />
                </Route>
                <Route path="/Doctor/patientDocuments" component={RecentPatientDocuments} />
                <Route path="/Doctor/documentViewer" component={DocumentViewer} />
                <Route path="/Doctor/reportView" component={ReportView} />
                <Route path="/Doctor/notifications" render={() => <Notification doctor={true} />} />
                <Route path="/Doctor/friendList" component={FriendList} />
                <Route path="/Doctor/*">
                  <Redirect to="/pageNotFound" />
                </Route>
              </Switch>
            </Route>
            <Route path="/passwordSet/doctor" render={(routeProps) => <PasswordSet doctor={true} {...routeProps} />} />
            <Route path="/passwordSet" render={(routeProps) => <PasswordSet doctor={false} {...routeProps} />} />
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
