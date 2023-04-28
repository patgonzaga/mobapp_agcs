// Import Screens
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
export default App;