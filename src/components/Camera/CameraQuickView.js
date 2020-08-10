import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

// Custom Styles
const useStyles = makeStyles({
  Button: {
    background: "linear-gradient(45deg, #3adf57 30%, #75e093 90%)",
    border: 0,
    color: "black",
    marginTop: "-20px",
    fontSize: "30px",
  },
  Image: {
    height: "400px",
  },
});

function CameraQuickView() {
  // Websocket setup, same explanation as Camera.js but lesser functionalities.
  let history = useHistory();
  const classes = useStyles();
  var url = 'ws://localhost:8000/'

  //var url = 'ws://192.168.1.31:8000/'
  var ws = new WebSocket(url + "stream");
  ws.onopen = function() {
      console.log("connection was established");
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
  };
  function capture() {

    ws.close();
    history.push("/camera");
  }

  function onLoad() {
      if (document.getElementById("currentImage").src !== 'https://i.ibb.co/LRjs4N8/video-loading.png') {
        setTimeout(function()
        {
            ws.send("next");
        }, 100);
      }

  }

  setTimeout(function()
  {
    history.push("/");
  }, 300000);
  return (
    <div className="cameraQuickView">
      <img id="currentImage" src="https://i.ibb.co/LRjs4N8/video-loading.png" onLoad={onLoad} alt="" className={classes.Image}></img>
      <Button
        className={classes.Button}
        onClick={capture}
        fullWidth
        size="large"
        variant="outlined"
      >
        Let's Recycle!
      </Button>
    </div>
  );
}
export default CameraQuickView;
