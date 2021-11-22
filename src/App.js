import './App.css';
import 'animate.css';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Timeline from './pages/Timeline';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Home></Home>
      <About></About>
      <Projects></Projects>
      <Timeline></Timeline>
      <Footer></Footer>
    </div>
  );
}

export default App;
