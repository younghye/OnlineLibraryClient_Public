export const navActiveStyle = (flag: boolean) => {
  let style = {
    color: flag ? "CornflowerBlue" : "black",
    fontWeight: flag ? "bold" : "normal",
    textDecoration: "none",
  };
  return style;
};

// Can not use it for dropdown tab(dropdown tab is always active)
// const navActiveStyle2 = ({ isActive }: { isActive: boolean }) => ({
// color: isActive ? "blue" : "grey",
// fontWeight: isActive ? "bold" : "normal",
// });
