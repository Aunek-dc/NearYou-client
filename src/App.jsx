
import { useLocation } from 'react-router-dom';
import './App.css'
import Navbar from './Pages/Shared/NavBar/Navbar';

function App() {

  return (
    <>
    <NavbarWithRouteControl />
    </>
  )
}

const NavbarWithRouteControl = () => {
  const location = useLocation();

  // Conditionally render navbar based on route
  if (location.pathname === '/routed') {
    return null; // Return null to hide the navbar for the routed page
  }

  return <Navbar />;
};



export default App
