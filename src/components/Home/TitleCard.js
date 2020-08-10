import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Custom Styles
const useStyles = makeStyles({
  titleCard: {
    maxwidth: 375,
    maxHeight: 400,
  },
});

function TitleCard() {
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

export default TitleCard;
