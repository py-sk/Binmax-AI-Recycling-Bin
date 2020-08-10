import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Custom Styles
const useStyles = makeStyles({
  titleCard: {
    maxwidth: 375,
    maxHeight: 500,
    marginLeft: 175
  },
});

function ScreenSaverCard() {
  const classes = useStyles();
  return (
    <div>
      <img
        className={classes.titleCard}
        src="https://i.ibb.co/dmRKJCX/titlecard.png"
        alt="title_card"
      ></img>
    </div>
  );
}

export default ScreenSaverCard;
