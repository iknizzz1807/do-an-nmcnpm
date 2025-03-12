import { hashPassword } from './auth/password';
import fs, { write } from 'fs';
import * as readline from 'readline';


const setPassword = async (password: string) => {
  if (password == "")
    throw new Error("Không thể set password rỗng");
  const passwordHash = await hashPassword(password);
  const secretPasswordJson = JSON.stringify({
    password: passwordHash
  })
  fs.writeFile('src/lib/server/secretPassword.json', secretPasswordJson, (err) => {
    if (err) {
      console.error('Error writing file: ', err);
    }
    else {
      console.log('set password thành công');
    }
  })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

await rl.question("Nhập vào password cần đổi: ", async (answer) => {
  await setPassword(answer);
  rl.close();
})
