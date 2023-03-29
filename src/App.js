//import React, {useState} from 'react';
//import { ReactDOM } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login'
import Editor from './Pages/Editor'
import Load from './Pages/Load';

function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route exact path='/board-brush' element={<Navigate to='/'/>}/>
            <Route path='/' element={<Login/>}/>
            <Route path='/editor' element={<Editor/>}/>
            <Route path='/load' element={<Load/>}/>
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
