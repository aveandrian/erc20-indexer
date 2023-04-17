import React from 'react'
import ReactDOM from 'react-dom/client'
import RainbowConnector from './RainbowConnector'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <RainbowConnector />
    </ChakraProvider>
  </React.StrictMode>
)
