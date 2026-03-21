import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { db } from '../firebase';
import './TodoList.css';

function TodoList({ nickname }) {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);

  useEffect(() => {
    const todosRef = ref(db, 'todos');
    const unsub = onValue(todosRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data)
        .map(([id, todo]) => ({ id, ...todo }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setTodos(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUsers(Object.keys(data));
    });
    return () => unsub();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTodo = {
      text: text.trim(),
      assignedTo: assignedTo.length > 0 ? assignedTo : [],
      addedBy: nickname,
      createdAt: Date.now(),
      done: false,
      doneBy: null,
      doneAt: null,
    };

    push(ref(db, 'todos'), newTodo).then(() => {
      // Create notifications for assigned users
      if (assignedTo.length > 0) {
        assignedTo.forEach((user) => {
          push(ref(db, `notifications/${user}`), {
            message: `Przypisano ci zadanie: ${newTodo.text}`,
            from: nickname,
            createdAt: Date.now(),
            read: false,
          });
        });
      }
    });

    setText('');
    setAssignedTo([]);
  };

  const handleToggleAssign = (user) => {
    setAssignedTo((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleMarkDone = (todoId) => {
    update(ref(db, `todos/${todoId}`), {
      done: true,
      doneBy: nickname,
      doneAt: Date.now(),
    });
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <form className="todo-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nowe zadanie..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          <div className="todo-assign-label">Przypisz do:</div>
          <div className="todo-assign-list">
            {users.map((user) => (
              <label key={user}>
                <input
                  type="checkbox"
                  checked={assignedTo.includes(user)}
                  onChange={() => handleToggleAssign(user)}
                />
                {user}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={!text.trim()}>
          Dodaj zadanie
        </button>
      </form>

      <div className="todo-items">
        {todos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <div className="todo-text">{todo.text}</div>
            {todo.assignedTo && todo.assignedTo.length > 0 && (
              <div className="todo-assigned">
                {todo.assignedTo.map((user) => (
                  <span key={user} className="todo-assigned-tag">{user}</span>
                ))}
              </div>
            )}
            <div className="todo-meta">
              <span>Dodał/a: {todo.addedBy}</span>
              <span>{formatDate(todo.createdAt)}</span>
            </div>
            {todo.done ? (
              <div className="todo-done-info">
                Zrobione przez {todo.doneBy} — {formatDate(todo.doneAt)}
              </div>
            ) : (
              <button className="todo-done-btn" onClick={() => handleMarkDone(todo.id)}>
                Oznacz jako zrobione
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
