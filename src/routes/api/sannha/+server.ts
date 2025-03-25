import { selectAllSanNha, updateSanNha, insertSanNha } from "$lib/server/db/functions/SanNha";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  let result = await selectAllSanNha();
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const POST: RequestHandler = async ({
  request,
  locals
}: {
  request: Request;
  locals: App.Locals
}) => {

  // Cái post request này để tạo sân nhà, response ok sẽ tiến hành trả về sân nhà mới vừa tạo
  const data = await request.json();
  console.log(data);

  if (data.maMG ?? null) {
    await updateSanNha(data);
  }
  else{
    await insertSanNha(data)
  }

  // Trả về response với sân nhà vừa tạo và status 200 OK
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Delete DoiBong
// export const DELETE: RequestHandler = async ({
//   request,
// }: {
//   request: Request;
// }) => {
  
//   const data = await request.json();
//   let result : number | null = null;

//   console.log(data.maMG);
//   if ((data.maMG) === null) {
//     throw new Error("Không có mã đội sao xóa? bruh");
//   }
//   else {
//     result = data.maMG!!;
//     // await deleteSanNha(data.maMG!!);
//   }

//   return new Response(JSON.stringify({ maMG: result!! }), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };