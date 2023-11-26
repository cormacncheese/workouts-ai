import { FileTabs } from './components/file-tabs';

export default async function Files() {
  return (
    <section className="mb-32 height-screen-helper py-6 md:px-0 px-4">
      <FileTabs />
    </section>
  );
}
