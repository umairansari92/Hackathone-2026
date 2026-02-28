import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup, reset } from "../store/userSlice";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    gender: "Male", // Default
  });
  const [image, setImage] = useState(null);

  const { fullname, email, password, gender } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = new FormData();
    userData.append("fullname", fullname);
    userData.append("email", email);
    userData.append("password", password);
    userData.append("gender", gender);
    if (image) {
      userData.append("image", image);
    }

    dispatch(signup(userData));
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join us today to start your journey.</p>
      </div>

      {isError && <div className="error-message">{message}</div>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            id="fullname"
            name="fullname"
            value={fullname}
            placeholder="Enter your full name"
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            placeholder="Enter password"
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select
            className="form-control"
            id="gender"
            name="gender"
            value={gender}
            onChange={onChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Profile Picture</label>
          <input
            type="file"
            className="form-control file-input"
            id="image"
            name="image"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? <span className="spinner"></span> : "Sign Up"}
        </button>
      </form>
      <div className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Signup;
