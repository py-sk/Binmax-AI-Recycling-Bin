import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

// Custom Styles
const useStyles = makeStyles({
  Button: {
    background: "linear-gradient(45deg, #3adf57 30%, #75e093 90%)",
    border: 0,
    color: "black",
    height: 60,
    fontSize: "2rem",
  },
  BackButton: {
    background: "#f44336",
    border: 0,
    color: "black",
    height: 60,
  },
  Image: {
    height: "400px",
    width: "500px",
  },
  CameraFeed: {
    position: "relative",
    margin: "auto",
    fontSize: "x-large",
    height: "50%",
    width: "90%",
    paddingTop: "10px",
  },
  Title: {
    fontSize: "2rem",
  },
});

function Camera() {
  // Setup websocket
  // Whenever a new image is received from websocket, a 'next' message is sent to retrieve the next image.
  // 'prediction' is sent when the capture button is pressed.
  // Messages sent are judged by length. If it is more than 1000 characters, it is an image in byte string form. If it's lesser, then it is probably an actual message.
  // If 'image saved' is received, then redirect to questionnaire page since the image has been saved on server.
  let history = useHistory();
  var url = "ws://localhost:8000/";

  //var url = 'ws://192.168.1.31:8000/'
  var ws = new WebSocket(url + "stream");
  ws.onopen = function() {
      console.log("connection was established");
      ws.send("viewfinder");      
      ws.send("next");
  };
  ws.onmessage = function(msg) {
      if (msg.data.length > 1000) {
          try{
              document.getElementById("currentImage").src = 'data:image/png;base64, ' + msg.data;
          }
          catch(err) {
              console.log(err);
          }
      }
      else if (msg.data==='image saved'){
          ws.close();
          window.location.replace("../questionnaire")
      }
  };
  function capture() {

    ws.send("prediction")
    ws.close();
    history.push("/questionnaire");
  }
  function onLoad() {

    ws.send("next");
  }

  const classes = useStyles();
  return (
    <div className={classes.CameraFeed}>
      <Typography
        gutterBottom="false"
        variant="h6"
        className={classes.Title}
        align="center"
      >
        Put the item you wish to recycle into the camera's view below!
      </Typography>
      <img id="currentImage" src="/stream" onLoad={onLoad} alt="loading_image" className={classes.Image}></img>

      <Button
        className={classes.Button}
        onClick={capture}
        fullWidth
        size="large"
        variant="outlined"
      >
        Recycle This!
      </Button>
    </div>
  );
}

export default Camera;
