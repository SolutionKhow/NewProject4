
import React, { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './componenets/layout/Navbar';
import Landing from './componenets/layout/Landing';
import Register from './componenets/auth/Register';
import Login from './componenets/auth/Login';
import './App.css';


const App = () => (
  <BrowserRouter>
    <Fragment>
      <Navbar></Navbar>
      <Routes>
        <Route exact path='/' element={<Landing />}></Route>
      </Routes>
      <section className='container'>
        <Routes>
          <Route exact path='/register' element={<Register />}></Route>
          <Route exact path='/login' element={<Login />}></Route>
        </Routes>

      </section>

    </Fragment>

  </BrowserRouter>

);


export default App;
