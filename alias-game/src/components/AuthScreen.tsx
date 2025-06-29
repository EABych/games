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

  return (
    <div className="auth-screen">
      <div className={`auth-container ${isShaking ? 'shake' : ''}`}>
        <div className="auth-icon">
          🎮
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
        
        <div className="auth-hint">
          Подсказка: выразите своё желание поиграть
        </div>
      </div>
    </div>
  );
};