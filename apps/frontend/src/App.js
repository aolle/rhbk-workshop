import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Users from './pages/Users';

const App = ({ }) => (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
);

export default App;
