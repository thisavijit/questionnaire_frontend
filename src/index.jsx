import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import Home from './pages/Home/index.jsx';
import Answers from './pages/Answers/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
  return (
    <LocationProvider>
      <main class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 p-6">
        <Router>
          <Route path="/" component={Home} />
          <Route path="/response/:id" component={Answers} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
}

render(<App />, document.getElementById('app'));