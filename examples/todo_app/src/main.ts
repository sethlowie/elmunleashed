import { portModule } from "@elmunleashed/core";

class TodoService {
	private todos: string[] = [];

	public getTodos(): string[] {
		return this.todos;
	}

	public createTodo(todo: string): string {
		this.todos.push(todo);
		return todo;
	}
}

const todoService = new TodoService();

const ports = portModule();

const todoModule = ports.newModule("simple-todo");

todoModule.get("/todos", async (data) => {
	console.log("CHECKING THIS THING OUT", data);
	return todoService.getTodos();
});

todoModule.post("/todos", async (body: string) => {
	return todoService.createTodo(body);
});

ports.listen();

const appNode = document.getElementById("app");
if (!appNode) {
	throw new Error("No #app node found");
}

window.Elm.Main.init({
	node: appNode,
	flags: {},
});
