import React, { useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CounterContext = React.createContext();

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, count: action.count };
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_MYCOUNT':
      return { ...state, mycount: action.mycount };
    case 'MYINCREMENT':
      return { ...state, mycount: state.mycount + 1 };
    case 'MYDECREMENT':
      return { ...state, mycount: state.mycount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <h1>MyCount value: {state.mycount}</h1>
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('https://mern-challenge-1.onrender.com/api/counter');
      dispatch({ type: 'SET', count: response.data.count });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async (variable) => {
    try {
      await axios.post(`https://mern-challenge-1.onrender.com/api/counter/increment/${variable}`);
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async (variable) => {
    try {
      await axios.post(`https://mern-challenge-1.onrender.com/api/counter/decrement/${variable}`);
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <MyCounter/>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <button onClick={()=>incrementCounter('count')}>Increment</button>
      <button onClick={()=>decrementCounter('count')}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();
  const fetchMyCounter = useCallback(async () => {
    try {
      const response = await axios.get('https://mern-challenge-1.onrender.com/api/counter');
      dispatch({ type: 'SET_MYCOUNT', mycount: response.data.mycount });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);
  
  useEffect(() => {
    fetchMyCounter();
  }, [fetchMyCounter]);

  const MyincrementCounter = useCallback(async (variable) => {
    try {
      await axios.post(`https://mern-challenge-1.onrender.com/api/counter/increment/${variable}`);
      dispatch({ type: 'MYINCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const MydecrementCounter = useCallback(async (variable) => {
    try {
      await axios.post(`https://mern-challenge-1.onrender.com/api/counter/decrement/${variable}`);
      dispatch({ type: 'MYDECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>MyCounter</h2>
      <p>MyCount: {state.mycount}</p>
      <button onClick={()=>MyincrementCounter('mycount')}>MyIncrement</button>
      <button onClick={()=>MydecrementCounter('mycount')}>MyDecrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 ,mycount:0});
  useEffect(() => {
    const fetchInitialValues = async () => {
      try {
        const response = await axios.get('https://mern-challenge-1.onrender.com/api/counter');
        dispatch({ type: 'SET', count: response.data.count });
      dispatch({ type: 'SET_MYCOUNT', mycount: response.data.mycount });
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialValues(); 
  },[]);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">MyCounter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter/>}/>
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
