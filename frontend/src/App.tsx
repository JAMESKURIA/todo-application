import axios from "axios";
import React, { FormEvent } from "react";

const STATUS = {
    TODO: "Todo",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
};

type Task = {
    id?: string;
    todoItem: string;
    status: keyof typeof STATUS;
    todoDescription: string;
};

function App() {
    const [tasks, setTasks] = React.useState<Task[]>([]);

    const [uploadStatus, setUploadStatus] = React.useState<
        "loading" | "success" | "error" | undefined
    >();
    const [fetchTaskStatus, setFetchTaskStatus] = React.useState<
        "loading" | "success" | "error" | undefined
    >();

    function addTodo(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const todoItem = formData.get("todoItem");
        const status = formData.get("status");
        const todoDescription = formData.get("todoDescription");

        const newTodo = {
            id: Date.now().toString(),
            todoItem,
            status,
            todoDescription,
        } as Task;

        const data = {
            name: todoItem,
            description: todoDescription,
            status,
            taskName: todoItem,
        };

        setUploadStatus("loading");

        axios
            .post("http://localhost:8081/task", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((resp) => {
                console.log("response", resp.data);
                setUploadStatus("success");
                fetchTasks();
            })
            .catch((error) => {
                console.log("error", error.response.data);
                setUploadStatus("error");
            });

        setTasks((prev) => [...prev, newTodo]);
    }

    function fetchTasks() {
        setFetchTaskStatus("loading");
        axios
            .get("http://localhost:8081/task")
            .then((resp) => {
                console.log("response", resp.data);

                setFetchTaskStatus("success");

                const newTasks = resp.data.map((item) => ({
                    ...item,
                    todoItem: item.taskName,
                    todoDescription: item.description,
                }));

                setTasks((prev) => [...prev, ...newTasks]);
            })
            .catch((error) => {
                console.log("error", error.response.data);

                setFetchTaskStatus("error");
            });
    }

    React.useEffect(() => {
        fetchTasks();
    }, []);

    function removeTodo(id: string) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }

    // if (uploadStatus === "loading" || fetchTaskStatus === "loading" || deleteStatus == "loading") {

    if ([uploadStatus, fetchTaskStatus].includes("loading")) {
        return <div>Loading...</div>;
    }

    if ([uploadStatus, fetchTaskStatus].includes("error")) {
        return <div>Error</div>;
    }

    return (
        <>
            <form onSubmit={addTodo}>
                <input name="todoItem" type="text" placeholder="task name" />
                <input
                    name="todoDescription"
                    type="text"
                    placeholder="description"
                />
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
                        <span>{task.todoItem}</span> -
                        <span>{task.todoDescription}</span> -
                        <span>{task.status}</span>
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
