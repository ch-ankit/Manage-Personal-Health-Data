import React, {lazy} from 'react'
import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
const About=lazy(()=>import('./About'));
const Chose=lazy(()=>import('./Chose'));
const DocumentViewer=lazy(()=>import('./DocumentViewer'));
const HomeDrawer=lazy(()=>import('./HomeDrawer'));
const HomeNav=lazy(()=>import('./HomeNav'));
const HomePage=lazy(()=>import('./HomePage'));
const LandingPage=lazy(()=>import('./LandingPage'));
const LandingPageDoc=lazy(()=>import('./LandingPageDoc'));
const PageNotFound=lazy(()=>import('./PageNotFound'));  
const PasswordSet = lazy(()=>import('./PasswordSet'));
const PatientDocuments= lazy(()=> import('./PatientDocuments'))
const Report =lazy(()=>import('./Report'))
const SignUp =lazy(()=>import('./SignUp'))
const SignUpDoc=lazy(()=>import('./SignUpDoc'));
function App() {
  return (
    <div className="app" >
      <Router>
        <Suspense fallback={()=><p>Loading</p>}>
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
          <Route path="/passwordSet/doctor" render={(routeProps) => <PasswordSet doctor={true} {...routeProps} />} />
          <Route path="/passwordSet" render={(routeProps) => <PasswordSet doctor={false} {...routeProps} />} />
          <Route path="/doc/home">
            {/* <HomeNav /> */}
            <HomeDrawer doctor={true} />
            <LandingPageDoc />
          </Route>
          <Route path="/doc" component={SignUpDoc} />
          <Route path="/*" component={PageNotFound} />
        </Switch>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
