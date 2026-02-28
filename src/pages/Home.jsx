import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../store/userSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="auth-container" style={{ textAlign: "center" }}>
      <div className="auth-header">
        <h2>Welcome, {user.fullname}!</h2>
        <p>You have successfully logged in.</p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <img
          src={user.image}
          alt={user.fullname}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid var(--primary)",
            padding: "4px",
            marginBottom: "1rem",
          }}
        />
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Gender:</strong> {user.gender}
        </p>
      </div>

      <button
        className="btn"
        onClick={onLogout}
        style={{ background: "var(--error)" }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
