import { Route, Routes, BrowserRouter } from "react-router-dom";

import MainWrapper from "./layouts/MainWrapper";
import PrivateRoute from "./layouts/PrivateRoute";

import Register from "./views/auth/Register";

function App() {
  return (
    <BrowserRouter>
      <MainWrapper>
        <Routes>
          {/* <Route path="/register" element={<h1>Register</h1>} />
          <PrivateRoute path="/dashboard" element={<h1>Dashboard</h1>} /> */}
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          </Route>
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  );
}

export default App;
