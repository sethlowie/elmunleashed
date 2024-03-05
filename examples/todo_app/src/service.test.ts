import { describe, beforeEach, it, expect } from "vitest";
import { TodoService } from "./service";

describe("Todo Service", () => {
	let service: TodoService;
	beforeEach(() => {
		service = new TodoService();
	});

	it("should default to an empty list", () => {
		expect(service.getTodos()).toEqual([]);
	});

	it("should add a new todo", () => {
		service.addTodo("Hello");
		expect(service.getTodos()).toEqual([
			{ id: 1, text: "Hello", completed: false },
		]);
	});

	it("should delete a todo", () => {
		service.addTodo("Hello");
		service.addTodo("World");
		service.deleteTodo(1);
		expect(service.getTodos()).toEqual([
			{ id: 2, text: "World", completed: false },
		]);
	});

	it("should toggle a todo", () => {
		service.addTodo("Hello");
		service.toggleCompleted(1);
		expect(service.getTodos()).toEqual([
			{ id: 1, text: "Hello", completed: true },
		]);
	});
});
