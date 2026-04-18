function userTimestampToDate(timestamp) {
  return `${new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
  }).format(timestamp * 1000)}`;
}

export default userTimestampToDate;
