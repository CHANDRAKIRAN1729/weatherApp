import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';

function AdminRegistration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegister = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:3001/api/register', { email, password, role: 'admin' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Failed to register:', error);
      });
  };

  return (
    <div>
      <h2>Admin Registration</h2>
      <form onSubmit={handleRegister}>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

function UserRegistration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegister = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:3001/api/register', { email, password, role: 'user' })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Failed to register:', error);
      });
  };

  return (
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleRegister}>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

function AdminLogin({ setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:3001/api/login', { email, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        setRole('admin');
      })
      .catch((error) => {
        console.error('Failed to login:', error);
      });
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function UserLogin({ setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    axios
      .post('http://localhost:3001/api/login', { email, password })
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        setRole('user');
      })
      .catch((error) => {
        console.error('Failed to login:', error);
      });
  };

  return (
    <div>
      <h2>User Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function CityForm({ handleAddCity }) {
  const [city, setCity] = useState('');

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddCity(city);
    setCity('');
  };
  

  return (
    <div>
      {/* <h2>Add City</h2> */}
      <form onSubmit={handleSubmit}>
        <label>City:</label>
        <input type="text" value={city} onChange={handleCityChange} required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

function Home({ isLoggedIn, isAdmin, handleAddCity, handleCityChange, cities, weatherData }) {
  return (
    <div>
      {!isLoggedIn && <h1>Welcome to the Weather App</h1>}
      {isAdmin && isLoggedIn ? (
        <div>
          <h2>Add City</h2>
          <CityForm handleAddCity={handleAddCity} />
        </div>
      ) : (
        <>
          <h2>Select a City</h2>
          <select onChange={handleCityChange}>
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {weatherData && (
            <div>
              <h3>Weather for {weatherData.name}</h3>
              <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
              <p>Description: {weatherData.weather[0].description}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}


function App() {
  const [role, setRole] = useState('');
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // Fetch cities from the server
    axios
      .get('http://localhost:3001/api/cities')
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch cities:', error);
      });
  }, []);

  const handleAddCity = (city) => {
    axios
    .post('http://localhost:3001/api/cities', { name: city })
    .then((response) => {
      console.log(response.data);
      // Fetch the updated list of cities after adding a city
      axios
        .get('http://localhost:3001/api/cities')
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch cities:', error);
        });
    })
    .catch((error) => {
      console.error('Failed to add city:', error);
    });
    // setCities([...cities, city]);
    // axios
    //   .post('http://localhost:3001/api/cities', { name: city })
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.error('Failed to add city:', error);
    //   });
  };

  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=ae6008103ce35e0516e5291d9564168b`)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch weather data:', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole('');
  };

  const isLoggedIn = !!localStorage.getItem('token');
  const isAdmin = role === 'admin';

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/admin/register">Admin Register</Link>
                </li>
                <li>
                  <Link to="/user/register">User Register</Link>
                </li>
                <li>
                  <Link to="/admin/login">Admin Login</Link>
                </li>
                <li>
                  <Link to="/user/login">User Login</Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/logout" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/admin/register" element={<AdminRegistration />} />
          <Route path="/user/register" element={<UserRegistration />} />
          <Route path="/admin/login" element={<AdminLogin setRole={setRole} />} />
          <Route path="/user/login" element={<UserLogin setRole={setRole} />} />
          <Route path="/logout" element={<Navigate to="/" />} />
          {isLoggedIn ? (
            <Route
              path="/"
              element={
                <Home
                  isLoggedIn={isLoggedIn}
                  isAdmin={isAdmin}
                  handleAddCity={handleAddCity}
                  handleCityChange={handleCityChange}
                  cities={cities}
                  weatherData={weatherData}
                />
              }
            />
          )
           : (
            <Route path="/logout" element={<Navigate to="/" />} />
          )
          }
        </Routes>
      </div>
    </Router>
  );
}

export default App;
