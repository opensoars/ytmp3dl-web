import React from 'react';
import './App.css';
import Downloads from './components/Downloads';

import { red, blue } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const themes = {
  dark: createMuiTheme({
    type: 'dark',
    typography: {
      fontFamily: "'Roboto', sans-serif"
      // fontSize: 16
    },
    palette: {
      type: 'dark',
      primary: {
        main: red[600]
      },
      secondary: {
        main: blue[600]
      },
      background: {
        main: '#121212'
      }
      // text: {
      //   primary: '#ffffff'
      // }
    }
  }),

  light: createMuiTheme({
    typography: {
      fontFamily: "'Roboto', sans-serif"
      // fontSize: 16
    },
    palette: {
      type: 'light',
      primary: {
        main: red[700]
      },
      secondary: {
        main: blue[600]
      },
      background: {
        main: '#f5f5f5'
      }
    }
  })
};

function App() {
  return (
    <ThemeProvider theme={themes.light}>
      <div className="App">
        <Downloads />
      </div>
    </ThemeProvider>
  );
}

export default App;
