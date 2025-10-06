import { SnackbarProvider } from "notistack";
import "./App.css";
import Login from "./auth/Login";

function App() {
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <Login />
      </SnackbarProvider>
    </>
  );
}

export default App;
