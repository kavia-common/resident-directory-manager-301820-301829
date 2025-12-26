import { localStorageAdapter } from "./localStorage";

beforeEach(async () => {
  // reset localStorage
  window.localStorage.clear();
  await localStorageAdapter.init();
});

test("localStorageAdapter upsert and getAll", async () => {
  const sample = { id: "1", name: "Test", apartment: "101" };
  await localStorageAdapter.upsert(sample);
  const all = await localStorageAdapter.getAll();
  expect(all.length).toBe(1);
  expect(all[0].name).toBe("Test");
});

test("localStorageAdapter remove", async () => {
  await localStorageAdapter.upsert({ id: "1", name: "A" });
  await localStorageAdapter.upsert({ id: "2", name: "B" });
  await localStorageAdapter.remove("1");
  const all = await localStorageAdapter.getAll();
  expect(all.map(x => x.id)).toEqual(["2"]);
});

test("localStorageAdapter export/import", async () => {
  const recs = [
    { id: "1", name: "A" },
    { id: "2", name: "B" },
  ];
  for (const r of recs) await localStorageAdapter.upsert(r);
  const json = await localStorageAdapter.export();
  await localStorageAdapter.clear();
  expect((await localStorageAdapter.getAll()).length).toBe(0);
  await localStorageAdapter.import(json);
  expect((await localStorageAdapter.getAll()).length).toBe(2);
});
