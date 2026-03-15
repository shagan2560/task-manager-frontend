import { useState,useEffect } from "react";


const Board = () => {

  const [tasks, setTasks] = useState({
    todo: [],
    progress: [],
    done: []
  });

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  

  const [newTask, setNewTask] = useState({
    title: "",
    desc: "",
    priority: "medium",
    date: ""
  });

  const [boards, setBoards] = useState([
    
  ]);
  // add user name
  const [user, setUser] = useState(null);

  useEffect(() => {

  const fetchUser = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setUser(data);

    } catch (error) {
      console.log(error);
    }

  };

  fetchUser();

}, []);

  const [newBoard, setNewBoard] = useState({
    title: "",
    desc: ""
  });

  // Drag and Drop States
  const [draggedTask, setDraggedTask] = useState(null);
  const [sourceColumn, setSourceColumn] = useState(null);
  useEffect(() => {
  fetchBoards();
}, []);

useEffect(() => {

  if (!selectedBoard) return;

  const fetchTasks = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/tasks/${selectedBoard._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      const grouped = {
        todo: data.filter(t => t.status === "todo"),
        progress: data.filter(t => t.status === "progress"),
        done: data.filter(t => t.status === "done")
      };

      setTasks(grouped);

    } catch (error) {
      console.log(error);
    }
  };

  fetchTasks();

}, [selectedBoard]);

const fetchBoards = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/boards", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    setBoards(data);

  } catch (error) {
    console.log(error);
  }
};

  const handleCreateBoard = async () => {

  if (!newBoard.title) {
    alert("Board title required");
    return;
  }

  try {

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newBoard),
    });

    const data = await res.json();

    setBoards((prev) => [...prev, data]);

    setNewBoard({ title: "", desc: "" });
    setShowModal(false);

  } catch (error) {
    console.log(error);
  }
};

  /* NEW: Delete Board */
const deleteBoard = async (id, e) => {
  e.preventDefault();
  e.stopPropagation();

  try {

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/boards/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    setBoards((prev) => prev.filter((b) => b._id !== id));

  } catch (error) {
    console.log(error);
  }
};

const handleCreateTask = async () => {

  if (!newTask.title) {
    alert("Task title required");
    return;
  }

  try {

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
  title: newTask.title,
  description: newTask.desc,
  priority: newTask.priority.toLowerCase(),
  dueDate: newTask.date,
  status: "todo",
  board: selectedBoard._id
})
    });

    const data = await res.json();

    // Add task to UI
    setTasks({
      ...tasks,
      todo: [...tasks.todo, data]
    });

    // Reset form
    setNewTask({
      title: "",
      desc: "",
      priority: "medium",
      date: ""
    });

    setShowTaskModal(false);

  } catch (error) {
    console.log(error);
  }

};
// Log Out button
const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

  /* DRAG AND DROP FUNCTIONS */
  const handleDragStart = (task, column) => {
    setDraggedTask(task);
    setSourceColumn(column);
  };

const handleDrop = async (targetColumn) => {

  if (!draggedTask) return;

  try {

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/tasks/${draggedTask._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: targetColumn
      })
    });

  } catch (error) {
    console.log(error);
  }

  const updatedSource = tasks[sourceColumn].filter(
    (t) => t._id !== draggedTask._id
  );

  const updatedTask = {
    ...draggedTask,
    status: targetColumn
  };

  const updatedTarget = [...tasks[targetColumn], updatedTask];

  setTasks({
    ...tasks,
    [sourceColumn]: updatedSource,
    [targetColumn]: updatedTarget
  });

  setDraggedTask(null);
  setSourceColumn(null);
};
const deleteTask = async (column, id) => {

  try {

    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setTasks({
      ...tasks,
      [column]: tasks[column].filter(t => t._id !== id)
    });

  } catch (error) {
    console.log(error);
  }

};

  const Column = ({ title, items, color,status }) => (
    <div
      className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition"
      onDragOver={(e)=>e.preventDefault()}
      onDrop={()=>handleDrop(status)}
    >

      <h2 className={`font-semibold mb-4 text-lg ${color}`}>
        {title} ({items.length})
      </h2>

      <div className="space-y-3">
        {items.map((task) => (
<div
  key={task._id}
  draggable
  onDragStart={() => handleDragStart(task, status)}
  className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
>

  <div className="flex justify-between items-start">
  <h3 className="font-medium">{task.title}</h3>

  <button
    onClick={() => deleteTask(status, task._id)}
    className="text-gray-400 hover:text-red-500"
  >
    🗑
  </button>
</div>

{/* DESCRIPTION */}
{task.description && (
  <p className="text-sm text-gray-500 mt-1">
    {task.description}
  </p>
)}

  {/* PRIORITY */}
{/* PRIORITY */}
<div className="mt-2 text-sm flex items-center justify-between">

  <span
    className={`px-2 py-1 rounded-lg text-xs font-medium
      ${task.priority === "high" ? "bg-red-100 text-red-600" :
        task.priority === "medium" ? "bg-yellow-100 text-yellow-600" :
        "bg-green-100 text-green-600"}`}
  >
    {task.priority.toUpperCase()}
  </span>

  {task.dueDate && (
    <span className="px-3 py-1 rounded-lg text-sm font-semibold" >
      📅 {new Date(task.dueDate).toLocaleDateString()}
    </span>
  )}

</div>

</div>
        ))}
      </div>

      <button
        onClick={() => setShowTaskModal(true)}
        className="mt-4 w-full py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition"
      >
        + Add Task
      </button>

    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-white shadow-sm px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          📋 Dashboard
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">

           <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
            </div>

            <span className="text-gray-700">
             {user?.name}
           </span>

</div>

          <button onClick={handleLogout} className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
            Logout
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-16 pt-16 pb-28">

        <h1 className="text-4xl font-bold flex items-center gap-3">
          My Boards
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            MERN Stack
          </span>
        </h1>

        <p className="text-white/80 mt-3">
          Manage your projects and tasks
        </p>

      </div>

      {/* BOARDS */}
      {!selectedBoard && (

        <div className="px-16 mt-12">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold">All Boards</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl shadow hover:shadow-lg transition"
            >
              + New Board
            </button>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {boards.map((board) => (

              <div
                key={board._id}
                className="bg-white rounded-2xl shadow-md border overflow-hidden hover:shadow-xl transition cursor-pointer relative"
                onClick={() => setSelectedBoard(board)}
              >

                {/* DELETE ICON */}
                <button
                  onClick={(e)=>deleteBoard(board._id,e)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  🗑
                </button>

                <div className={`h-2 bg-gradient-to-r ${board.color}`}></div>

                <div className="p-6">

                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    📋 {board.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {board.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* BOARD VIEW */}
      {selectedBoard && (

        <div className="px-16 mt-10 pb-20">

          <div className="bg-white rounded-2xl shadow-xl p-8">

            <div className="flex items-center justify-between mb-8">

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedBoard(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-xl"
                >
                  ←
                </button>

                <div>
                  <h2 className="text-3xl font-bold">{selectedBoard.title}</h2>
                  <p className="text-gray-500">{selectedBoard.desc}</p>
                </div>
              </div>

              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-white shadow px-5 py-2 rounded-xl hover:shadow-md"
              >
                + Add Task
              </button>

            </div>

            <div className="grid md:grid-cols-3 gap-6">

              <Column title="To Do" items={tasks.todo} color="text-blue-600" status="todo" />
              <Column title="In Progress" items={tasks.progress} color="text-orange-500" status="progress" />
              <Column title="Completed" items={tasks.done} color="text-green-600" status="done" />

            </div>

          </div>

        </div>

      )}

      {/* CREATE BOARD MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8">

            <h2 className="text-xl font-bold mb-6">
              Create New Board
            </h2>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Board Title *</label>

              <input
                type="text"
                placeholder="e.g., Website Redesign"
                value={newBoard.title}
                onChange={(e)=>setNewBoard({...newBoard,title:e.target.value})}
                className="w-full mt-2 border border-indigo-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600">Description</label>

              <textarea
                placeholder="What's this board about?"
                value={newBoard.desc}
                onChange={(e)=>setNewBoard({...newBoard,desc:e.target.value})}
                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 h-24"
              />
            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateBoard}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              >
                Create Board
              </button>

            </div>

          </div>

        </div>

      )}

      {/* CREATE TASK MODAL */}
      {showTaskModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8">

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              ✨ Create New Task
            </h2>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Title *</label>

              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={(e)=>setNewTask({...newTask,title:e.target.value})}
                className="w-full mt-2 border border-indigo-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Description</label>

              <textarea
                placeholder="Add more details..."
                value={newTask.desc}
                onChange={(e)=>setNewTask({...newTask,desc:e.target.value})}
                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">

              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>

                <select
                  value={newTask.priority}
                  onChange={(e)=>setNewTask({...newTask,priority:e.target.value})}
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                >
                 <option value="low">🟢 Low</option>
                 <option value="medium">🟡 Medium</option>
                 <option value="high">🔴 High</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Due Date</label>

                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e)=>setNewTask({...newTask,date:e.target.value})}
                  className="w-full mt-2 border rounded-xl px-4 py-3"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setShowTaskModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTask}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              >
                Create Task
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Board;