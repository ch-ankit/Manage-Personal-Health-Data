import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import './App.css'
import LoginPage from './LoginPage'
import SignUp from './SignUp'

function App() {
  return (
    <div className='App'>
      <Router>
        <Route exact path='/' component={LoginPage} />
        <Route path='/Sign' component={SignUp} />
      </Router>
    </div>
  )
}

export default App
