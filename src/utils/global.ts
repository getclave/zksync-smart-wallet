export const mergeClasses = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter((c) => c).join(" ");
};
