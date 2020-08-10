import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

//Components
import CameraQuickView from "../Camera/CameraQuickView";
import TitleCard from "./TitleCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "60px",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  SocialStepper: {
    marginTop: "10px",
  },
  middleDivider: {
    marginTop: "10px",
  },
}));

export default function DashBoard() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs>
            <TitleCard />
          </Grid>
          <Grid item xs={6}>
            <CameraQuickView />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
