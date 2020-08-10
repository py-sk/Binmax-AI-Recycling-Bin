import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

//Components
import ScreenSaverCard from "./ScreenSaverCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "60px",
  },
}));

export default function DashBoard() {
  const classes = useStyles();
  var url = "ws://localhost:8000/";
  //var url = "ws://192.168.1.31:8000/";
  var ws = new WebSocket(url + "stream");
  ws.onopen = function() {
      console.log("connection was established");
      ws.send("screensaver");
  };
  ws.onmessage = function(msg) {
      if (msg.data==='someone_detected'){
          ws.close();
          window.location.replace("../home")
      }
  };

  return (
    <div className={classes.root}>
      <Container>
            <ScreenSaverCard className={classes.TitleCard} />
      </Container>
    </div>
  );
}
