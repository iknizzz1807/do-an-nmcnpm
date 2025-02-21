<script lang="ts">
  let length: number = $state(4);

  type CauThu = {
    ten: string | null;
    ngaySinh: string | null;
    loai: string | null;
    ghiChu: string | null;
  };

  let tenDoiBong: string = $state("");
  let sanNha: string = $state("");
  let danhSachCauThu: CauThu[] = $state([]);
  for (let i = 0; i < 4; i++) {
    danhSachCauThu.push({ ten: "", ngaySinh: "", loai: "", ghiChu: "" });
  }

  const formValidation = () => {
    if (tenDoiBong.trim() === "" || sanNha.trim() === "") {
      //
    }
  };

  const submitForm = async (event: Event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/taodoibong", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          tenDoiBong: tenDoiBong, 
          sanNha: sanNha, 
          danhSachCauThu: danhSachCauThu 
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const add = () => {
    length++;
    if (length > danhSachCauThu.length) {
      danhSachCauThu.push({ ten: "", ngaySinh: "", loai: "", ghiChu: "" });
    }
  };

  const deleteData = (id: number) => {
    danhSachCauThu.splice(id, 1);
    length--;
  };
</script>

<main class="w-full flex flex-col justify-center items-center h-screen">
  <form
    method="POST"
    class="flex-col flex justify-center items-center bg-amber-300 w-2xl gap-4"
  >
    <input
      required
      name="td"
      type="text"
      placeholder="Ten doi"
      bind:value={tenDoiBong}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
    <input
      required
      name="sn"
      type="text"
      placeholder="San nha"
      bind:value={sanNha}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >Tao</button
    >
    <table id="table" class="w-full p-2">
      <thead>
        <tr>
          <th class="p-1 bg-gray-100 border">STT</th>
          <th class="p-1 bg-gray-100 border">Cau thu</th>
          <th class="p-1 bg-gray-100 border">Ngay sinh</th>
          <th class="p-1 bg-gray-100 border">Loai cau thu</th>
          <th class="p-1 bg-gray-100 border">Ghi chu</th>
        </tr>
      </thead>
      <tbody>
        {#each { length: length }, id}
          <tr>
            <td class="p-1 border"> {id}</td>
            <td class="p-1 border">
              <input
                type="text"
                class="w-full p-1 border"
                placeholder="Ten cau thu"
                bind:value={danhSachCauThu[id].ten}
              />
            </td>
            <td class="p-1 border">
              <input
                type="text"
                class="w-full p-1 border"
                placeholder="Ngay sinh"
                bind:value={danhSachCauThu[id].ngaySinh}
              />
            </td>
            <td class="p-1 border">
              <input
                type="text"
                class="w-full p-1 border"
                placeholder="Loai cau thu"
                bind:value={danhSachCauThu[id].loai}
              />
            </td>
            <td class="p-1 border">
              <input
                type="text"
                class="w-full p-1 border"
                placeholder="Ghi chu"
                bind:value={danhSachCauThu[id].ghiChu}
              />
            </td>
            <td class="p-1 border">
              <button onclick={() => deleteData(id)}>-</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <button onclick={add} class="p-1 border">+</button>
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onclick={submitForm}>Submit</button
    >
  </form>
</main>
