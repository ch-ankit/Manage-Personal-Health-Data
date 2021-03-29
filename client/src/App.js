import React from 'react'
import {BrowserRouter as Router , Route} from 'react-router-dom'
import About from './About'
import LandingPage from './LandingPage'
function App() {
  return (
    <div className="app" >
      <Router>
        <Route exact path="/" component={LandingPage} />
        <Route path="/about" component={About} />
      </Router>
    </div>
  )
}

export default App 
