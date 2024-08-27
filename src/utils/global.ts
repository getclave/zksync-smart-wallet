export const mergeClasses = (...classes: (string | undefined)[]) => {
  return classes.filter((c) => c).join(" ");
};
