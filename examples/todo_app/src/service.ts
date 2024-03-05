type Todo = {
	id: number;
	text: string;
	completed: boolean;
};

export class TodoService {
	private todos: Todo[] = [];

	getTodos() {
		return this.todos;
	}

	addTodo(text: string) {
		const id = this.todos.length + 1;
		const newTodo = { id, text, completed: false };
		this.todos.push(newTodo);
		return newTodo;
	}

	toggleCompleted(id: number) {
		this.todos = this.todos.map((todo) => {
			if (todo.id === id) {
				return { ...todo, completed: !todo.completed };
			}
			return todo;
		});
	}

	deleteTodo(id: number) {
		this.todos = this.todos.filter((todo) => todo.id !== id);
	}
}
