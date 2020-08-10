import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

//Components
import SocialStepper from "./SocialSlider";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "10px",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const SocialExpanded = () => {
  const classes = useStyles();
  return (
    <Container>
      <div className={classes.root}>
          <SocialStepper/>
      </div>
    </Container>
  );
};

export default SocialExpanded;
