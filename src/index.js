import { ChakraProvider } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const container = document.querySelector('easytrade-email');
if (container) {
  const root = ReactDOM.createRoot(container);

  root.render(
    <StrictMode>
      <ChakraProvider>
        <App userId={container.getAttribute('user-id')} />
      </ChakraProvider>
      <ToastContainer />
    </StrictMode>
  );
}
