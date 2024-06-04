import { readFileAsync, writeFileAsync } from '../utilities/fileHandler.mjs';

export const save = async (user) => {
  const users = await loadUsers();

  users.push(user);

  await writeFileAsync('data', 'users.json', JSON.stringify(users));
};

const loadUsers = async () => {
  // Läsa in filen users.json...
  return await readFileAsync('data', 'users.json');
};
