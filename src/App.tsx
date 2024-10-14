import { useState } from 'react';
import './App.css';
import { TodoItem, useStore, ViewType } from './store';

export default function App() {
  return (
    <div className="App">
      <h1>TODO LIST</h1>
      <TodoList />
    </div>
  );
}

const TodoList = () => {
  const [newItem, setNewItem] = useState('');
  const { view, setView, addItem, clearCompleted, items } = useStore();

  const addTodoItem = () => {
    if (!newItem.trim()) {
      setNewItem('');
      return;
    }
    addItem({ id: Date.now(), title: newItem, done: false });
    setNewItem('');
    setView(ViewType.ALL);
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodoItem();
    }
  }

  return (
    <div>
      <div>
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={newItem}
          onInput={(e) => setNewItem(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        <button onClick={clearCompleted} disabled={!items.some((it) => it.done)}>
          Clear completed
        </button>
        <div>
          <button type='button' onClick={() => setView(ViewType.ALL)} className={view === ViewType.ALL ? 'selected' : ''}>
            All
          </button>
          <button type='button' onClick={() => setView(ViewType.ACTIVE)} className={view === ViewType.ACTIVE ? 'selected' : ''}>
            Active
          </button>
          <button type='button' onClick={() => setView(ViewType.COMPLETED)} className={view === ViewType.COMPLETED ? 'selected' : ''}>
            Completed
          </button>
        </div>
      </div>
      <List />
    </div>
  );
}

const List = () => {
  const { view, items } = useStore();
  let visibleItems = [...items];
  if (view === ViewType.COMPLETED) {
    visibleItems = visibleItems.filter((li) => li.done);
  } else if (view === ViewType.ACTIVE) {
    visibleItems = visibleItems.filter((li) => !li.done);
  }
  return (
    <ul>
      <div className='number'>{`${visibleItems.length} ${visibleItems.length === 1 ? 'item' : 'items'}`}</div>
      {visibleItems
        .map((li) => (
          <ListItem item={li} key={li.id} />
        ))}
    </ul>
  );
}

const ListItem = ({ item }: { item: TodoItem }) => {
  const { toggleItem, removeItem } = useStore();
  return (
    <li className='item'  onClick={() => toggleItem(item)}>
      <input 
        type='checkbox' 
        checked={item.done} 
      /> 
      <div className={`title ${item.done ? 'done' : ''}`}>
        {item.title}
      </div>
      <button onClick={() => removeItem(item)} className='delete'>
        Delete
      </button>
    </li>
  );
}