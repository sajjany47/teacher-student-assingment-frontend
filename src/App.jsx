import { SnackbarProvider } from "notistack";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TeacherDashboard from "./Page/teacher/TeacherDashboard";
import StudentDashboard from "./Page/student/StudentDashboard";
import AssignmentDetail from "./Page/student/AssignmentDetail";
import Layout from "./auth/layout";
import StudentList from "./Page/teacher/StudentList";

function App() {
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/student-list" element={<StudentList />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/assignment/:id" element={<AssignmentDetail />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </Routes>
        </Router>
        {/* <Login /> */}
      </SnackbarProvider>
    </>
  );
}

export default App;
