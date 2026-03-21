import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { db } from '../firebase';
import './TodoList.css';

function TodoList({ uid, nickname }) {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]); // [{uid, nickname}]
  const [text, setText] = useState('');
  const [assignedTo, setAssignedTo] = useState([]); // UIDs

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
      const list = Object.entries(data).map(([userUid, val]) => ({
        uid: userUid,
        nickname: val.nickname || userUid,
      }));
      setUsers(list);
    });
    return () => unsub();
  }, []);

  const getNameForUid = (userUid) => {
    const found = users.find((u) => u.uid === userUid);
    return found ? found.nickname : userUid;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const assignedNames = assignedTo.map(getNameForUid);

    const newTodo = {
      text: text.trim(),
      assignedTo: assignedTo.length > 0 ? assignedTo : [],
      assignedNames: assignedNames.length > 0 ? assignedNames : [],
      addedBy: uid,
      addedByName: nickname,
      createdAt: Date.now(),
      done: false,
      doneBy: null,
      doneByName: null,
      doneAt: null,
    };

    push(ref(db, 'todos'), newTodo).then(() => {
      if (assignedTo.length > 0) {
        assignedTo.forEach((userUid) => {
          push(ref(db, `notifications/${userUid}`), {
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

  const handleToggleAssign = (userUid) => {
    setAssignedTo((prev) =>
      prev.includes(userUid) ? prev.filter((u) => u !== userUid) : [...prev, userUid]
    );
  };

  const handleMarkDone = (todoId) => {
    update(ref(db, `todos/${todoId}`), {
      done: true,
      doneBy: uid,
      doneByName: nickname,
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
            {users.map((u) => (
              <label key={u.uid}>
                <input
                  type="checkbox"
                  checked={assignedTo.includes(u.uid)}
                  onChange={() => handleToggleAssign(u.uid)}
                />
                {u.nickname}
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
            {todo.assignedNames && todo.assignedNames.length > 0 && (
              <div className="todo-assigned">
                {todo.assignedNames.map((name) => (
                  <span key={name} className="todo-assigned-tag">{name}</span>
                ))}
              </div>
            )}
            <div className="todo-meta">
              <span>Dodał/a: {todo.addedByName || todo.addedBy}</span>
              <span>{formatDate(todo.createdAt)}</span>
            </div>
            {todo.done ? (
              <div className="todo-done-info">
                Zrobione przez {todo.doneByName || todo.doneBy} — {formatDate(todo.doneAt)}
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
