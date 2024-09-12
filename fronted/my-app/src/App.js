import React from 'react';
import { BrowserRouter as Router, Routes,Route   } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Router>

      <div className="App">
        <h1>MY APP</h1>
        <Routes>
          <Route path="/login" component={() => <AuthForm type="login" />} />
          <Route path="/signup" component={() => <AuthForm type="signup" />} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password/:token" component={ResetPassword} />
          <Route path="/" exact component={() => <div>Welcome! <a href="/login">Login</a></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
