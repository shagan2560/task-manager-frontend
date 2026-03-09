import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get(`${API_URL}/boards`);
      setBoards(res.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      await axios.post(`${API_URL}/boards`, { title: newBoardTitle });
      setNewBoardTitle('');
      fetchBoards();
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav>
        <h1>TaskFlow</h1>
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="board-section">
        <h2>My Boards</h2>

        <form onSubmit={createBoard}>
          <input
            type="text"
            placeholder="New board title..."
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
          />
          <button type="submit">+ Create Board</button>
        </form>

        <div className="board-grid">
          {boards.map((board) => (
            <div
              key={board._id}
              className="board-card"
              onClick={() => navigate(`/board/${board._id}`)}
            >
              <h3>{board.title}</h3>
              <p>{board.description || 'No description'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;