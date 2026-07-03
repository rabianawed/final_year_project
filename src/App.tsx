import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AppRouter from "./routes/AppRouter";

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
