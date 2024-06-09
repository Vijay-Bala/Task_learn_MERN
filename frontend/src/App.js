import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState({title: '', status: "todo"});
  const [updateTaskId, setUpdateTaskId] = useState(null);
  const [updatedValue, setUpdatedValue] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState('todo');
  
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => {
        if (!res.ok) {
          throw Error("could not fetch the data for that resource");
        }
        return res.json();
      }) 
      .then((data) => {
        setTask(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleCreateTask = (e) => {
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("could not fetch the data for that resource");
        }
        return res.json();
      })
      .then((data) => {
        setTask([...task, data]);
        setNewTask({title: "", status: "todo"});
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const openUpdatePopup = (id, value, status) => {
    setUpdateTaskId(id);
    setUpdatedValue(value.toString());
    setUpdatedStatus(status.toString());
  };

  const closeUpdatePopup = () => {
    setUpdateTaskId(null);
    setUpdatedValue("");
    setUpdatedStatus("todo");
  };

  const handleUpdateTask = () => {
    if (!updateTaskId || !updatedValue) return;
    fetch(`http://localhost:5000/tasks/${updateTaskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: updatedValue, status: updatedStatus }),
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("could not fetch the data for that resource");
        }
        return res.json();
      })
      .then((data) => {
        const updatedTask = task.map((task) => {
          return task._id === updateTaskId ? data : task;
        });
        setTask(updatedTask);
        closeUpdatePopup();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("could not fetch the data for that resource");
        }
        setTask(task.filter((task) => task._id !== id));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="App">
      <h1>VJ Tasks</h1>
      <div>
        <h2>Create New Task</h2>
        <label>Title</label>
        <input type="text" name="title" value={newTask.title} onChange={handleInputChange} />
        <label>Status</label>
        <select name="status" value={newTask.status} onChange={handleInputChange}>
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        <button onClick={handleCreateTask}>Create</button>
      </div>

      <div>
        <h2> Overall Tasks</h2>
        <ul>
          {task.map((task) => (
            <li key={task._id}>
              {task.title} : {task.status}
              <button onClick={() => openUpdatePopup(task._id, task.title, task.status)}>Update</button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
    </div>

    {updateTaskId !== null && (
      <div className="update-popup" style={{zIndex: 1}}>
         <h2>Update Task</h2>
         <label>New Title</label>
         <input type="text" name="title" value={updatedValue} onChange={(e) => setUpdatedValue(e.target.value)} />
         <label>New Status</label>
         <select name="status" value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
         <button onClick={handleUpdateTask}>Update</button>
         <button onClick={closeUpdatePopup}>Cancel</button>
      </div>
    )}  

    </div>
  );
}

export default App;
