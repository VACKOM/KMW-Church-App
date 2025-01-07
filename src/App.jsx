import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Sidebar from './scenes/global/SideBar';
import Dashboard from './scenes/dashboard';
import Centers from './scenes/centers';
import AddCenter from './scenes/centers/addCenter';
import Zones from './scenes/zones';
import AddZone from './scenes/zones/addZones';
import Bacenta from './scenes/bacentas/AddBacenta';
import Bacentas from './scenes/bacentas';


const App = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className='content'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/centers' element={<Centers />} />
              <Route path='/add-center' element={<AddCenter />} />
              <Route path='/zones' element={<Zones />} />
              <Route path='/add-zone' element={<AddZone />} />
              <Route path='/bacentas' element={<Bacentas />} />
              <Route path='/add-bacenta' element={<Bacenta />} />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
