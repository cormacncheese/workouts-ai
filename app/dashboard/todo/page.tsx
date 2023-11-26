import TodoList from './components/todo-list';

export default async function TodoListPage() {
  return (
    <section className="mb-32 height-screen-helper px-4">
      <TodoList />
    </section>
  );
}
