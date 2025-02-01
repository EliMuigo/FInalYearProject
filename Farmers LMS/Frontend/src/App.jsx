import { Route, Routes, BrowserRouter } from "react-router-dom";

import MainWrapper from "./layouts/MainWrapper";
import PrivateRoute from "./layouts/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <MainWrapper>
        <Routes>
          <Route path="/register" element={<h1>Register</h1>} />
          <PrivateRoute path="/dashboard" element={<h1>Dashboard</h1>} />
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  );
}

export default App;
