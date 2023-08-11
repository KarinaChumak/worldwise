import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import { Suspense, lazy } from 'react';

import { CitiesProvider } from './contexts/CitiesContext';
import { AuthProvider } from './contexts/FakeAuthContext';

import CityList from './components/CityList';
import CountryList from './components/CountryList';
import City from './components/City';
import Form from './components/Form';
import ProtectedRoute from './pages/ProtectedRoute';
import SpinnerFullPage from './components/SpinnerFullPage';

// import Product from './pages/Product';
// import Pricing from './pages/Pricing';
// import Homepage from './pages/Homepage';
// import PageNotFound from './pages/PageNotFound';
// import AppLayout from './pages/AppLayout';
// import Login from './pages/Login';

const Product = lazy(() => import('./pages/Product'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Homepage = lazy(() => import('./pages/Homepage'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const AppLayout = lazy(() => import('./pages/AppLayout'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage></SpinnerFullPage>}>
            <Routes>
              <Route path="/" element={<Homepage></Homepage>}></Route>
              <Route
                path="product"
                element={<Product></Product>}
              ></Route>
              <Route
                path="pricing"
                element={<Pricing></Pricing>}
              ></Route>
              <Route path="login" element={<Login></Login>}></Route>

              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout></AppLayout>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={<Navigate replace to="cities"></Navigate>}
                ></Route>
                <Route path="cities" element={<CityList />}></Route>

                <Route
                  path="cities/:id"
                  element={<City></City>}
                ></Route>
                <Route
                  path="countries"
                  element={<CountryList />}
                ></Route>
                <Route path="form" element={<Form></Form>}></Route>
              </Route>
              <Route
                path="*"
                element={<PageNotFound></PageNotFound>}
              ></Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
