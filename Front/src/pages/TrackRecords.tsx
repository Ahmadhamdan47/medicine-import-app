import React, { useState, useReducer } from 'react'

function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map((task: { id: React.Key | null | undefined; }) => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
        className='text-black-text p-1'
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button className='text-green-500' onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label className='space-x-4'>
      <input
        className='text-black-bg'
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button className='text-red-500' onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}

function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        className='w-1/2 self-center text-black-bg'
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className='w-32 rounded self-center mt-2 bg-blue-500' onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}






export function TrackRecords() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text: any) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
      task: {
        id: undefined
      }
    });
  }

  function handleChangeTask(task: any) {
    dispatch({
      type: 'changed',
      task: task,
      id: undefined,
      text: undefined
    });
  }

  function handleDeleteTask(taskId: any) {
    dispatch({
      type: 'deleted',
      id: taskId,
      text: undefined,
      task: {
        id: undefined
      }
    });
  }

  return (
    <div className='flex-col flex items-center justify-center'>
      <h1>Day off in Kyoto</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

function tasksReducer(tasks: { id: any; }[], action: { type: string; id: any; text: any; task: { id: any; }; }) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map((t: { id: any; }) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t: { id: any; }) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
