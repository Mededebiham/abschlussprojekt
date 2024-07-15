import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
//import  {loginSuccess}  from '../store/loginReducer';
import { login, LoginAction  } from '../store/reducers'; 
import Cookies from 'js-cookie';
import { User } from '../store/types'; // Import User interface from types.ts
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { RootState } from '../store/types'; // Assuming RootState is defined in store.ts

// Define the RegisterFormData interface outside the component
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: {
    street: string;
    streetNumber: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
interface LoginUser {
  email:string;
  password:string
}

interface SignInProps {
  // loginSuccess: (user: User) => void;
  login: (user: User) => void;
}
interface DispatchProps {
  //loginSuccess: (user: User) => void;
  login: (user: User) => void;

  // Add other action creators here if needed
}

interface RootStateProps {
  // Define props here to access Redux state if needed
}

const ConnectedSignIn: React.FC<SignInProps & DispatchProps & RootStateProps> = ({ login }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [errorApi, setErrorApi] = useState('');
  const navigate = useNavigate();


  const handleSwitch = () => {
    setShowLogin(!showLogin);
    setErrorApi(''); // Clear any previous errors
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    const loginUser: LoginUser = { email, password }; // Assuming LoginUser is a type/interface that contains email and password
  
    try {
      // Send an API request to the backend to authenticate the user
      const response = await axios.post('http://localhost:8088/users/login', loginUser);
  
      // Destructure the response outside the axios method
      const { firstName, id, role } = response.data; // Assuming response.data contains user data
      console.log(response.data);
      
      // Create a User object
      const user: User = 
      { username: firstName, id, role };
  
      // Dispatch login success action with the user data
      console.log(user);
    
    // Dispatch the login action with user data
      Cookies.set('isloggedin', 'true');
      Cookies.set('user', JSON.stringify(user));  
      login(user);
      //loginSuccess(user);
      navigate('/');
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Error occurred during login:', error);
      setErrorApi('Failed to sign in. Please check your credentials and try again.');
    }
  };
  

  const handleRegisterSubmit = async(formData: RegisterFormData) => {
    // Logic for handling register submission
    try {      
      const response = await axios.post('http://localhost:8088/users', formData, {
     
      });
      console.log(response.data); // Handle response from backend
      // Destructure the response outside the axios method
      const { firstName, id, role } = response.data; // Assuming response.data contains user data
  
      // Create a User object
      const user: User = 
      { username: firstName, id, role };

        // Dispatch the login action with user data
        Cookies.set('isloggedin', 'true');
        Cookies.set('user', JSON.stringify(user));  
        login(user);
  
      // Dispatch login success action with the user data
      //loginSuccess(user);
      navigate("/");
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorApi('Failed to register. Please try again later.');
    }
  };

  return (
    <div className="flex ">
      <div className="ml-20">
        {showLogin ? ( <> 
        <h2 className="ml-20 text-white mt-5" >Sign In</h2>
          <div className="ml-20 mt-5">
            <Login onSubmit={handleLoginSubmit} />
            <p className="text-white cursor-pointer" onClick={handleSwitch}>Switch to Register</p>
          </div>
          </>
        ) : (
          <>
          <h2 className="ml-20 text-white" >Sign Up</h2>
          <div className="ml-20">
            <Register onSubmit={handleRegisterSubmit} />
            <p className="text-white cursor-pointer" onClick={handleSwitch}>Switch to Login</p>
          </div>
          </>
        )}
       {errorApi && <div className="text-red-500 ml-20 mt-2">{errorApi}</div>}
      </div>
    </div>
  );
};

// const mapDispatchToProps = (dispatch: Dispatch) => ({
//   loginSuccess: (user: User) => dispatch(loginSuccess(user)),
// });
const mapDispatchToProps = (dispatch: Dispatch<LoginAction>): SignInProps => ({
  login: (user: User) => dispatch(login(user)),
});
const mapStateToProps = (state: RootState): RootStateProps => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(ConnectedSignIn);
