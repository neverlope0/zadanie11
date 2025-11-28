export class TodoApp {
  constructor() {
    this.todos = [];
    this.favorites = new Set();
  }

  addTodo(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Текст задачи обязателен и должен быть строкой');
    }

    const todo = {
      id: Date.now() + Math.random(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.push(todo);
    return todo;
  }

  deleteTodo(id) {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(todo => todo.id !== id);
    
    this.favorites.delete(id);
    
    return initialLength !== this.todos.length;
  }

  editTodo(id, newText) {
    if (!newText || typeof newText !== 'string') {
      throw new Error('Новый текст обязателен и должен быть строкой');
    }

    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new Error('Задача не найдена');
    }

    todo.text = newText.trim();
    todo.updatedAt = new Date().toISOString();
    return todo;
  }

  toggleTodo(id) {
    const todo = this.todos.find(todo => todo.id === id);
    if (!todo) {
      throw new Error('Задача не найдена');
    }

    todo.completed = !todo.completed;
    return todo;
  }

  toggleFavorite(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      return false;
    } else {
      const todoExists = this.todos.some(todo => todo.id === id);
      if (!todoExists) {
        throw new Error('Задача не найдена');
      }
      this.favorites.add(id);
      return true;
    }
  }

  getAllTodos() {
    return [...this.todos];
  }

  getFavoriteTodos() {
    return this.todos.filter(todo => this.favorites.has(todo.id));
  }

  getActiveTodos() {
    return this.todos.filter(todo => !todo.completed);
  }

  getCompletedTodos() {
    return this.todos.filter(todo => todo.completed);
  }

  getTodoById(id) {
    return this.todos.find(todo => todo.id === id);
  }

  clearCompleted() {
    const completedIds = this.todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    this.todos = this.todos.filter(todo => !todo.completed);
    
    completedIds.forEach(id => this.favorites.delete(id));
    
    return completedIds.length;
  }

  getStats() {
    const total = this.todos.length;
    const completed = this.getCompletedTodos().length;
    const active = total - completed;
    const favorites = this.favorites.size;

    return {
      total,
      completed,
      active,
      favorites
    };
  }
}