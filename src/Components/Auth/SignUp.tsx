import { useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext';

export default function Signup() {
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Pass 'user' as the default role
      await signup(email, password, name, 'user', stayLoggedIn);
      setSuccess('Signup successful!');
      setEmail('');
      setName('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 shadow-lg rounded bg-white">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={stayLoggedIn}
          onChange={(e) => setStayLoggedIn(e.target.checked)}
        />
        Stay logged in
      </label>
      <a href='/login'>Already have an account?</a>
        <button
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
