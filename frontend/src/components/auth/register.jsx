import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Loader2, Play } from 'lucide-react';
import './register.css';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
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

    setTimeout(() => {
      setIsLoading(false);
      onRegister({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        avatar: "/placeholder.svg?height=32&width=32",
      });
    }, 2000);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const labels = ["", "Très faible", "Faible", "Moyen", "Fort", "Très fort"];
    const colors = ["", "#ff6b6b", "#ffa726", "#ffca28", "#66bb6a", "#43a047"];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2 className="auth-title">Créer un compte</h2>
          <p className="auth-subtitle">Rejoignez StreamTube</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                <User className="label-icon-svg" />
                Prénom
              </label>
              <div className="input-container">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${errors.firstName ? "error" : ""}`}
                  placeholder="John"
                />
              </div>
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                <User className="label-icon-svg" />
                Nom
              </label>
              <div className="input-container">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${errors.lastName ? "error" : ""}`}
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

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
                placeholder="john.doe@email.com"
              />
              <Mail className="input-icon-svg" />
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
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <Lock className="label-icon-svg" />
              Confirmer le mot de passe
            </label>
            <div className="input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

       

          <button type="submit" className="auth-button primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="loading-spinner" />
                Création du compte...
              </>
            ) : (
              <>
                <UserPlus className="button-icon-svg" />
                Créer mon compte
              </>
            )}
          </button>

          <p className="auth-switch">
            Déjà un compte ?{" "}
            <button type="button" onClick={onSwitchToLogin} className="switch-link">
              Se connecter
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;