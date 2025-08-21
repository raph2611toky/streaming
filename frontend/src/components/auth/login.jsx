import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from 'lucide-react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login/`, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.access);

      navigate('/');
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Une erreur est survenue lors de la connexion' 
      });
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
    onSwitchToRegister();
  };

  return (
    <div className="auth-container">
      <div className="auth-card login-card">
        <div className="auth-header">
          <h2 className="auth-title">Connexion</h2>
          <p className="auth-subtitle">Accédez à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && <span className="error-message general-error">{errors.general}</span>}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="label-icon-svg" />
              Email
            </label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="votre@email.com"
              />
              <User className="input-icon-svg" />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock className="label-icon-svg" />
              Mot de passe
            </label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                name="rememberMe" 
                checked={formData.rememberMe} 
                onChange={handleChange} 
              />
              <span className="checkmark">✓</span>
              Se souvenir de moi
            </label>
            <button type="button" className="forgot-password">
              Mot de passe oublié ?
            </button>
          </div>

          <button type="submit" className="auth-button primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="loading-spinner" />
                Connexion...
              </>
            ) : (
              <>
                Se connecter
              </>
            )}
          </button>

          <div className="divider">
            <span>ou</span>
          </div>

          <button type="button" className="social-button google">
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          <p className="auth-switch">
            Pas encore de compte ?{" "}
            <button type="button" onClick={handleSwitchToRegister} className="switch-link">
              Créer un compte
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;