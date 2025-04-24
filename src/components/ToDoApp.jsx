import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Trash2, Edit, Plus, X, Calendar } from 'lucide-react';
import './ToDoApp.css';


export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) setTodos(JSON.parse(storedTodos));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      dueDate: dueDateInput || null,
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
    setDueDateInput('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleCompleted = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    setTodos(
      todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
  };

  return (
    <div className="todo-container">
      <div className="todo-card">
        <header className="todo-header">
          <h1>Todo List</h1>
        </header>

        <form onSubmit={addTodo} className="todo-form">
          <div className="todo-input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What needs to be done?"
              className="todo-input"
            />
            <button type="submit" className="add-btn">
              <Plus size={18} />
            </button>
          </div>
          <div className="todo-date-wrapper">
            <Calendar size={16} />
            <input
              type="date"
              value={dueDateInput}
              onChange={(e) => setDueDateInput(e.target.value)}
              className="todo-date"
            />
          </div>
        </form>

        <div className="todo-filters">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <ul className="todo-list">
          {sortedTodos.length > 0 ? (
            sortedTodos.map(todo => (
              <li key={todo.id} className="todo-item">
                {editingId === todo.id ? (
                  <div className="edit-wrapper">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="icon green"><CheckCircle size={18} /></button>
                    <button onClick={cancelEdit} className="icon red"><X size={18} /></button>
                  </div>
                ) : (
                  <div className="todo-content">
                    <button onClick={() => toggleCompleted(todo.id)} className={`icon ${todo.completed ? 'green' : 'gray'}`}>
                      {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </button>
                    <div className="todo-text">
                      <span className={todo.completed ? 'completed' : ''}>{todo.text}</span>
                      {todo.dueDate && (
                        <div className={`due-date ${isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : ''}`}>
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="todo-actions">
                      <button onClick={() => startEdit(todo)} className="icon blue"><Edit size={18} /></button>
                      <button onClick={() => deleteTodo(todo.id)} className="icon red"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="empty-state">No tasks found. Add a new task to get started!</li>
          )}
        </ul>

        <footer className="todo-footer">
          <span>{todos.filter(todo => !todo.completed).length} items left</span>
          <button
            onClick={() => setTodos(todos.filter(todo => !todo.completed))}
            className={`clear-btn ${todos.some(todo => todo.completed) ? '' : 'invisible'}`}
          >
            Clear completed
          </button>
        </footer>
      </div>
    </div>
  );
}
