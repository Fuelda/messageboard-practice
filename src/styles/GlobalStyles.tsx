import React from "react";
import { Global } from "@emotion/react";
import tw, { theme, GlobalStyles as BaseStyles } from "twin.macro";
import css from "twin.macro";

const customStyles = css({
  body: {
    WebkitTapHighlightColor: theme`colors.purple.500`,
    ...tw`antialiased`,
  },
});

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
);

export default GlobalStyles;
