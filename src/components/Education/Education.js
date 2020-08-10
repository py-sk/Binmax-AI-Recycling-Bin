import React from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import EducationStepper from "./EducationSlider";

// Custom Styles
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

// Split into two rows, manual splitting of data since only 4 articles.
const EducationExpanded = () => {
  const classes = useStyles();
  
  return (
    <Container>
      <div className={classes.root}>
        <Grid container spacing={1}>
          <EducationStepper />
        </Grid>
      </div>
    </Container>
  );
};

export default EducationExpanded;
