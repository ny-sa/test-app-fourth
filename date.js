exports.getDate = () => {
  const today = new Date(),
  options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return today.toLocaleDateString("en-US", options);
}

exports.getDay = () => {
  const today = new Date(),
    options = {weekday: "long"};
  return today.toLocaleDateString("en-US", options);
}
