function performAsyncOperation(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
    console.log(`Performed operation for resource ${id}.`);
    resolve();
    }, 300);
  });
}
const worker = next_ => async () => {
  let next;
  while ((next = next_())) {
    await performAsyncOperation(next);
  }
};
const CONCURRENT_WORKERS = 3;
async function run() {
  const start = Date.now();
  const ids = Array.from(Array(99), (_, i) => i + 1);
  const workers = [];
  for (let i = 0; i < CONCURRENT_WORKERS; i++) {
    const w = worker(ids.pop.bind(ids));
    workers.push(w(ids));
  }
  await Promise.all(workers);
  const end = Date.now();
  console.log(`All operations performed in ${end - start}ms, moving on to something else now.`);
}
run();