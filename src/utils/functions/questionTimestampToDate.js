function timestampToDate(timestamp) {
  const d = new Date(timestamp * 1000);

  return `${d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear()} à ${
    d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
  }`;
}

export default timestampToDate;
