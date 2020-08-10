import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import firebase from "../../firebase.js";

//QR Code Dialog
import { QRCode } from "react-qrcode-logo";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function useItems() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Education")
      .orderBy("Name", "desc")
      .onSnapshot((snapshot) => {
        const newItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(newItems);
      });
    return () => unsubscribe();
  }, []);
  return items;
}

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 400,
    flexGrow: 1,
    boxShadow: "0px 9px 12px -2px rgba(0,0,0,0.25)",
  },
  popupDiv: {
    width: "75%",
    marginRight: "auto",
    marginLeft: "20px",
    display: "block",
  },
  doneButton: {
    paddingRight: 150,
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "8px",
    paddingRight: "8px",
    backgroundColor: "#46ea6c",
    position: "absolute",
    marginLeft: "320px",
    borderRadius: "5px",
    marginTop: "7px",
    zIndex: "10",
    color: "#000000",
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: "70px",
    marginTop: "430px !important",
    paddingLeft: "8px",
    paddingRight: "8px",
    backgroundColor: "#fafafa00",
    position: "absolute",
    zIndex: "10",
    width: "950px",
    color: "#ffffff",
    justifyContent: "center",
  },
  titleText: {
    fontSize: "2rem",
    // fontWeight: 800
  },
  sliderText: {
    // fontWeight: 800,
    fontSize: "3rem",
  },
  img: {
    height: 500,
    display: "block",
    // maxWidth: 900,
    overflow: "hidden",
    width: "100%",
    borderRadius: "10px 10px 0px 0px",
    filter: "brightness(50%)",
  },
  BottomStepper: {
    padding: 0,
    borderRadius: "0px 0px 5px 5px",
  },
}));

function EducationStepper() {
  const [URL, setURL] = React.useState();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
    setURL(items[activeStep].URL);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const items = useItems();

  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = items.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return items[0] === undefined ? (
    <div></div>
  ) : (
    <div className={classes.root}>
      <Paper
        square
        elevation={0}
        className={classes.headerTitle}
        onClick={handleClickOpen}
      >
        <Typography className={classes.titleText} onClick={handleClickOpen}>
          Learn More About Recycling
        </Typography>
      </Paper>
      <Paper
        square
        elevation={0}
        className={classes.header}
        onClick={handleClickOpen}
      >
        <Typography className={classes.sliderText} onClick={handleClickOpen}>
          {items[activeStep].Name.replace(/^(.{55}[^\s]*).*/, "$1...")}
        </Typography>
      </Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {items.map((step, index) => (
          <div key={step.Name}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img
                className={classes.img}
                src={step.Image}
                alt={step.Name}
                onClick={handleClickOpen}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        className={classes.BottomStepper}
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Scan the QR Code to bring yourself to the article!"}
        </DialogTitle>
        <DialogContent>
          <div className={classes.popupDiv}>
            <QRCode
              size="300"
              value={URL}
              logoOpacity="0.5"
              logoWidth="300"
              logoHeight="250"
              logoImage="https://i.ibb.co/16Nzf0J/recycler3.png"
              bgColor="#EFF6EF"
              qrStyle="dots"
              quietZone="10"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            fullWidth
            variant="contained"
          >
            Done!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EducationStepper;
