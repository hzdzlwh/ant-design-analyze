import React, { useState } from 'react'
import { Button as ANTDButton } from 'antd'
import Button from './components/button/'

function App() {

  return (
    <div className="App">
      <ANTDButton type="primary">中文</ANTDButton>
      <Button type="primary">中文</Button>
    </div>
  )
}

export default App
