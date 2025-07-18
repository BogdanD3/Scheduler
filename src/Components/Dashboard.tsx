import { useAuth } from '../Contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p className="text-center mt-10">You are not logged in.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
      <p className="mb-4">Role: <strong>{user.role}</strong></p>

      {user.role === 'admin' && (
        <div className="p-3 mb-4 bg-blue-50 border border-blue-300 rounded">
          <p className="text-blue-800">You have access to admin tools.</p>
        </div>
      )}

      {user.role === 'user' && (
        <div className="p-3 mb-4 bg-green-50 border border-green-300 rounded">
          <p className="text-green-800">You're logged in as a regular user.</p>
        </div>
      )}

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Log Out
      </button>
    </div>
  );
}
