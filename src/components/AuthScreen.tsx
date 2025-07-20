import React, { useState, useEffect } from 'react';

interface AuthScreenProps {
  onAuth: () => void;
}

const CORRECT_PASSWORD = 'Хочу играть';
const AUTH_KEY = 'games_auth_status';

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuth }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    // Проверяем, авторизован ли пользователь при загрузке
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
    if (isAuthenticated) {
      onAuth();
    }
  }, [onAuth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      // Сохраняем статус авторизации
      localStorage.setItem(AUTH_KEY, 'true');
      setError(false);
      onAuth();
    } else {
      setError(true);
      setIsShaking(true);
      setPassword('');
      
      // Убираем анимацию встряхивания через короткое время
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError(false);
    }
  };

  const handleIconClick = () => {
    const currentTime = Date.now();
    
    // Если прошло больше 500мс с последнего клика, сбрасываем счетчик
    if (currentTime - lastClickTime > 500) {
      setClickCount(1);
    } else {
      setClickCount(prevCount => prevCount + 1);
    }
    
    setLastClickTime(currentTime);
    
    // Если тройной клик - авторизуем пользователя
    if (clickCount >= 2) {
      localStorage.setItem(AUTH_KEY, 'true');
      onAuth();
    }
  };

  return (
    <div className="auth-screen">
      <div className={`auth-container ${isShaking ? 'shake' : ''}`}>
        <div className="auth-icon" onClick={handleIconClick} style={{ cursor: 'pointer' }}>
          <div className="logo"></div>
        </div>
        
        <h1 className="auth-title">Добро пожаловать!</h1>
        <p className="auth-subtitle">Введите пароль для доступа к играм</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-container">
            <input
              type="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Введите пароль"
              className={`auth-input ${error ? 'error' : ''}`}
              autoFocus
              autoComplete="off"
            />
            {error && (
              <div className="error-message">
                Неверный пароль
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={!password.trim()}
          >
            Войти
          </button>
        </form>
        
      </div>
    </div>
  );
};