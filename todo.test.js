import { TodoApp } from './todo.js';

describe('TodoApp', () => {
  let todoApp;

  beforeEach(() => {
    todoApp = new TodoApp();
  });

  describe('Добавление задач', () => {
    test('добавляет новую задачу', () => {
      const todo = todoApp.addTodo('Новая задача');
      
      expect(todo).toHaveProperty('id');
      expect(todo.text).toBe('Новая задача');
      expect(todo.completed).toBe(false);
      expect(todo).toHaveProperty('createdAt');
      
      const todos = todoApp.getAllTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('Новая задача');
    });

    test('добавляет несколько задач', () => {
      todoApp.addTodo('Первая задача');
      todoApp.addTodo('Вторая задача');
      
      const todos = todoApp.getAllTodos();
      expect(todos).toHaveLength(2);
      expect(todos[0].text).toBe('Первая задача');
      expect(todos[1].text).toBe('Вторая задача');
    });

    test('выбрасывает ошибку при пустом тексте', () => {
      expect(() => todoApp.addTodo('')).toThrow('Текст задачи обязателен и должен быть строкой');
      expect(() => todoApp.addTodo(null)).toThrow('Текст задачи обязателен и должен быть строкой');
      expect(() => todoApp.addTodo(123)).toThrow('Текст задачи обязателен и должен быть строкой');
    });

    test('обрезает пробелы в тексте задачи', () => {
      const todo = todoApp.addTodo('  Задача с пробелами  ');
      expect(todo.text).toBe('Задача с пробелами');
    });
  });

  describe('Удаление задач', () => {
    test('удаляет задачу по ID', () => {
      const todo = todoApp.addTodo('Задача для удаления');
      const initialLength = todoApp.getAllTodos().length;
      
      const result = todoApp.deleteTodo(todo.id);
      
      expect(result).toBe(true);
      expect(todoApp.getAllTodos()).toHaveLength(initialLength - 1);
      expect(todoApp.getTodoById(todo.id)).toBeUndefined();
    });

    test('возвращает false при удалении несуществующей задачи', () => {
      const result = todoApp.deleteTodo(999);
      expect(result).toBe(false);
    });

    test('удаляет задачу из избранного при удалении', () => {
      const todo = todoApp.addTodo('Задача в избранном');
      todoApp.toggleFavorite(todo.id);
      
      expect(todoApp.getFavoriteTodos()).toHaveLength(1);
      
      todoApp.deleteTodo(todo.id);
      
      expect(todoApp.getFavoriteTodos()).toHaveLength(0);
      expect(todoApp.getTodoById(todo.id)).toBeUndefined();
    });
  });

  describe('Изменение задач', () => {
    test('изменяет текст задачи', () => {
      const todo = todoApp.addTodo('Старый текст');
      const updatedTodo = todoApp.editTodo(todo.id, 'Новый текст');
      
      expect(updatedTodo.text).toBe('Новый текст');
      expect(updatedTodo).toHaveProperty('updatedAt');
      
      const foundTodo = todoApp.getTodoById(todo.id);
      expect(foundTodo.text).toBe('Новый текст');
    });

    test('выбрасывает ошибку при изменении несуществующей задачи', () => {
      expect(() => todoApp.editTodo(999, 'Новый текст'))
        .toThrow('Задача не найдена');
    });

    test('выбрасывает ошибку при пустом новом тексте', () => {
      const todo = todoApp.addTodo('Задача');
      
      expect(() => todoApp.editTodo(todo.id, ''))
        .toThrow('Новый текст обязателен и должен быть строкой');
    });
  });

  describe('Избранное', () => {
    test('добавляет задачу в избранное', () => {
      const todo = todoApp.addTodo('Задача для избранного');
      const result = todoApp.toggleFavorite(todo.id);
      
      expect(result).toBe(true);
      expect(todoApp.getFavoriteTodos()).toHaveLength(1);
      expect(todoApp.getFavoriteTodos()[0].id).toBe(todo.id);
    });

    test('удаляет задачу из избранного', () => {
      const todo = todoApp.addTodo('Задача');
      todoApp.toggleFavorite(todo.id); 
      const result = todoApp.toggleFavorite(todo.id);
      
      expect(result).toBe(false);
      expect(todoApp.getFavoriteTodos()).toHaveLength(0);
    });

    test('выбрасывает ошибку при добавлении несуществующей задачи в избранное', () => {
      expect(() => todoApp.toggleFavorite(999))
        .toThrow('Задача не найдена');
    });

    test('возвращает только избранные задачи', () => {
      const todo1 = todoApp.addTodo('Задача 1');
      const todo2 = todoApp.addTodo('Задача 2');
      const todo3 = todoApp.addTodo('Задача 3');
      
      todoApp.toggleFavorite(todo1.id);
      todoApp.toggleFavorite(todo3.id);
      
      const favorites = todoApp.getFavoriteTodos();
      expect(favorites).toHaveLength(2);
      expect(favorites.map(f => f.id)).toEqual([todo1.id, todo3.id]);
    });
  });

  describe('Статус выполнения', () => {
    test('переключает статус выполнения задачи', () => {
      const todo = todoApp.addTodo('Задача');
      expect(todo.completed).toBe(false);
      
      const updatedTodo = todoApp.toggleTodo(todo.id);
      expect(updatedTodo.completed).toBe(true);
      
      const updatedAgain = todoApp.toggleTodo(todo.id);
      expect(updatedAgain.completed).toBe(false);
    });

    test('выбрасывает ошибку при переключении несуществующей задачи', () => {
      expect(() => todoApp.toggleTodo(999))
        .toThrow('Задача не найдена');
    });

    test('фильтрует активные и выполненные задачи', () => {
      const todo1 = todoApp.addTodo('Активная задача');
      const todo2 = todoApp.addTodo('Выполненная задача');
      
      todoApp.toggleTodo(todo2.id); 
      
      const activeTodos = todoApp.getActiveTodos();
      const completedTodos = todoApp.getCompletedTodos();
      
      expect(activeTodos).toHaveLength(1);
      expect(activeTodos[0].id).toBe(todo1.id);
      
      expect(completedTodos).toHaveLength(1);
      expect(completedTodos[0].id).toBe(todo2.id);
    });
  });

  describe('Очистка выполненных задач', () => {
    test('удаляет все выполненные задачи', () => {
      const todo1 = todoApp.addTodo('Активная задача');
      const todo2 = todoApp.addTodo('Выполненная задача 1');
      const todo3 = todoApp.addTodo('Выполненная задача 2');
      
      todoApp.toggleFavorite(todo2.id);
      todoApp.toggleFavorite(todo3.id);
      
      todoApp.toggleTodo(todo2.id);
      todoApp.toggleTodo(todo3.id);
      
      const removedCount = todoApp.clearCompleted();
      
      expect(removedCount).toBe(2);
      expect(todoApp.getAllTodos()).toHaveLength(1);
      expect(todoApp.getAllTodos()[0].id).toBe(todo1.id);
      expect(todoApp.getFavoriteTodos()).toHaveLength(0);
    });
  });

  describe('Статистика', () => {
    test('возвращает корректную статистику', () => {
      todoApp.addTodo('Задача 1');
      todoApp.addTodo('Задача 2');
      const todo3 = todoApp.addTodo('Задача 3');
      
      todoApp.toggleTodo(todo3.id); 
      todoApp.toggleFavorite(todo3.id); 
      
      const stats = todoApp.getStats();
      
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.active).toBe(2);
      expect(stats.favorites).toBe(1);
    });
  });

  describe('Интеграционные тесты', () => {
    test('полный цикл работы с задачей', () => {
      const todo = todoApp.addTodo('Тестовая задача');
      expect(todoApp.getAllTodos()).toHaveLength(1);
      
      todoApp.toggleFavorite(todo.id);
      expect(todoApp.getFavoriteTodos()).toHaveLength(1);
      
      todoApp.editTodo(todo.id, 'Обновленная задача');
      expect(todoApp.getTodoById(todo.id).text).toBe('Обновленная задача');
      
      todoApp.toggleTodo(todo.id);
      expect(todoApp.getTodoById(todo.id).completed).toBe(true);
      
      todoApp.deleteTodo(todo.id);
      expect(todoApp.getAllTodos()).toHaveLength(0);
      expect(todoApp.getFavoriteTodos()).toHaveLength(0);
    });

    test('работа с несколькими задачами', () => {
      const tasks = ['Задача 1', 'Задача 2', 'Задача 3'];
      tasks.forEach(task => todoApp.addTodo(task));
      
      expect(todoApp.getAllTodos()).toHaveLength(3);
      
      const todos = todoApp.getAllTodos();
      todoApp.toggleFavorite(todos[0].id);
      todoApp.toggleFavorite(todos[2].id);
      
      expect(todoApp.getFavoriteTodos()).toHaveLength(2);
      
      todoApp.toggleTodo(todos[1].id);
      expect(todoApp.getCompletedTodos()).toHaveLength(1);
      
      todoApp.deleteTodo(todos[0].id);
      expect(todoApp.getAllTodos()).toHaveLength(2);
      expect(todoApp.getFavoriteTodos()).toHaveLength(1);
    });
  });
});