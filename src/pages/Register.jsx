import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-100">

      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center text-white text-center px-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

        <div className="text-6xl mb-6">🚀</div>

        <h1 className="text-5xl font-bold mb-4">TaskFlow</h1>

        <p className="text-lg text-purple-100 max-w-md">
          A powerful Trello-like task management app built with the MERN stack
        </p>

        {/* MERN Icons */}
        <div className="flex gap-4 mt-8">

          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center font-bold text-xl">M</div>
            <p className="text-sm mt-1">MongoDB</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-gray-800 flex items-center justify-center font-bold text-xl">E</div>
            <p className="text-sm mt-1">Express</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-xl">R</div>
            <p className="text-sm mt-1">React</p>
          </div>

          <div className="text-center">
            <div className="w-14 h-14 rounded-xl bg-lime-500 flex items-center justify-center font-bold text-xl">N</div>
            <p className="text-sm mt-1">Node.js</p>
          </div>

        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">

          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
            ✨ Kanban Boards
          </span>

          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
            ✨ Drag & Drop
          </span>

          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
            ✨ JWT Auth
          </span>

          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
            ✨ REST API
          </span>

          <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
            ✨ Mongoose
          </span>

        </div>

      </div>


      {/* RIGHT SIDE FORM */}
      <div className="flex flex-col justify-center items-center p-10">

        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-1">
            Create account
          </h2>

          <p className="text-gray-500 mb-6">
            Start organizing your work today
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
            >
              Create Account
            </button>

          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?
            <Link
              to="/login"
              className="text-indigo-600 ml-1 font-medium"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;