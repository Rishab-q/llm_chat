import { Routes, Route, Link } from "react-router-dom"
import Chat from "./Home"
// Inside your Routes
 function App() {
  return (
    <div className="p-4">
      

      <Routes>

        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
  )
}

export default App
