import { SnackbarProvider } from "notistack";
import "./App.css";
import Navbar from "./component/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TeacherDashboard from "./Page/teacher/TeacherDashboard";
import StudentDashboard from "./Page/student/StudentDashboard";
import AssignmentDetail from "./Page/student/AssignmentDetail";

function App() {
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/assignment/:id" element={<AssignmentDetail />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
        {/* <Login /> */}
      </SnackbarProvider>
    </>
  );
}

export default App;
