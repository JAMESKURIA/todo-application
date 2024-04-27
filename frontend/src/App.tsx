import React, { FormEvent } from "react";
import axios from "axios";

const STATUS = {
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
};

type Task = {
    id?: string;
    todoItem: string;
    status: keyof typeof STATUS;
};

function App() {
    const [tasks, setTasks] = React.useState<Task[]>([]);

    function addTodo(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const todoItem = formData.get("todoItem");
        const status = formData.get("status");

        const newTodo = {
            id: Date.now().toString(),
            todoItem,
            status,
        } as Task;

        axios.post("http://localhost:8081/task", newTodo);

        setTasks((prev) => [...prev, newTodo]);
    }

    function removeTodo(id: string) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }

    return (
        <>
            <form onSubmit={addTodo}>
                <input name="todoItem" type="text" />
                <select name="status">
                    <option value="TODO">Todo</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
                <button type="submit">Add</button>
            </form>

            <ul>
                {tasks.map((task, idx) => (
                    <li key={idx.toString()}>
                        <span>{task.todoItem}</span>
                        <span>{task.todoItem}</span>
                        <span>
                            <button
                                type="button"
                                onClick={() => removeTodo(task.id!)}
                            >
                                Delete
                            </button>
                        </span>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default App;
