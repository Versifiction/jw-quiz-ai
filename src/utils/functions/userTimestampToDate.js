function userTimestampToDate(timestamp) {
  return `${new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(timestamp * 1000)}`;
}

export default userTimestampToDate;
