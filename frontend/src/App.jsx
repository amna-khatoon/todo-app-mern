import "./style/App.css";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import AddTask from "./components/AddTask";
import List from "./components/List";
import UpdataTask from "./components/UpdataTask";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Protected from "./components/Protected";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <List />
              <Footer />
            </Protected>
          }
        />
        <Route
          path="/add"
          element={
            <Protected>
              <AddTask />
            </Protected>
          }
        />

        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <Protected>
              <EditProfile />
            </Protected>
          }
        />
        <Route
          path="/change-password"
          element={
            <Protected>
              <ChangePassword />
            </Protected>
          }
        />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/update/:id" element={<UpdataTask />} />
      </Routes>
    </div>
  );
}

export default App;
