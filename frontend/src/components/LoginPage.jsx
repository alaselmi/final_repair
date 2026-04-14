import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onLogin(email.trim(), password);
    } catch (fetchError) {
      // authentication error handled by toast
    }
  };

  return (
    <div className="page-shell">
      <div className="card">
        <h1>Repair Login</h1>
        <p className="help-text">Sign in with your email and password.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              required
            />
          </label>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
