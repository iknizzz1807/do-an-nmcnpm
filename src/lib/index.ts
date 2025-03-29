// place files you want to import through the `$lib` alias in this folder.

export const isNumber = (num : any) => {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};

export const calculateAge = (birthday: Date) => {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getFullYear() - 1970);
}

export const errorResponseJSON = (errorCode: number, message: string) => {
  return new Response(JSON.stringify({ error: message }), {
    status: errorCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
}