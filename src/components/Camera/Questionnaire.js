import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

// Basic UI
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

//Stepper
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";

//Dialog
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

//Firebase
import firebase from "../../firebase.js";
import { storage } from "../../firebase.js";

// Button
import Fab from "@material-ui/core/Fab";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

//UUID Generator. This UUID will be used as the name of the image file
var short = require("short-uuid");

// Relevant Dictionaries for the labels of the AI model.
var material_num_item_dict = {
  1: "metal",
  2: "glass",
  3: "paper",
  4: "plastic",
  5: "others",
};
var material_num_name_dict = {
  1: "Metal",
  2: "Glass",
  3: "Paper",
  4: "Plastic",
  5: "Others",
};
var material_item_num_dict = {
  metal: 1,
  glass: 2,
  paper: 3,
  plastic: 4,
  others: 5,
};

var plastic_item_num_dict = {
  cd: 1,
  drinking_straw: 2,
  plastic_bag: 3,
  plastic_clothes_hanger: 4,
  plastic_container_or_bottle: 5,
  plastic_disposable: 6,
  plastic_packaging: 7,
  plastic_packaging_with_foil: 8,
  styrofoam: 9,
};
var plastic_item_name_dict = {
  cd: "CD Disk",
  drinking_straw: "Straw",
  plastic_bag: "Plastic Bag",
  plastic_clothes_hanger: "Clothes Hanger",
  plastic_container_or_bottle: "Plastic Container/Bottle",
  plastic_disposable: "Disposable Cutlery",
  plastic_packaging: "Plastic Packaging",
  plastic_packaging_with_foil: "Plastic Packaging With Foil",
  styrofoam: "Styrofoam",
};
var plastic_num_name_dict = {
  1: "CD Disk",
  2: "Straw",
  3: "Plastic Bag",
  4: "Clothes Hanger",
  5: "Plastic Container or Bottle",
  6: "Disposable Cutlery",
  7: "Plastic Packaging",
  8: "Plastic Packaging With Foil",
  9: "Styrofoam",
};

var glass_item_num_dict = {
  ceramic: 1,
  glassware: 2,
  lightbulb: 3,
};
var glass_num_name_dict = {
  1: "Ceramic",
  2: "Glassware",
  3: "Lightbulb",
};

var metal_item_num_dict = {
  aerosol_can: 1,
  aluminum_tray_foil: 2,
  metal_can_or_container: 3,
};
var metal_num_name_dict = {
  1: "Aerosol Can",
  2: "Aluminium Foil or Tray",
  3: "Metal Can or Container",
};

var others_item_num_dict = {
  battery: 1,
  electronic_waste: 2,
  stationery: 3,
};
var others_num_name_dict = {
  1: "Battery",
  2: "Electronic Waste",
  3: "Stationery",
};

var paper_item_num_dict = {
  beverage_carton: 1,
  cardboard: 2,
  chopsticks: 3,
  disposables: 4,
  paper_bag: 5,
  paper_packaging: 6,
  paper_product:7,
  paper_receipt: 8,
  paper_roll: 9,
  paper_sheet: 10,
  tissue_box: 11,
  tissue_paper: 12,
};
var paper_num_name_dict = {
  1: "Beverage Carton",
  2: "Cardboard",
  3: "Chopsticks",
  4: "Disposables",
  5: "Paper Bag",
  6: "Paper Packaging",
  7: "Paper Product",
  8: "Receipt",
  9: "Paper Roll",
  10: "Paper Sheet",
  11: "Tissue Box",
  12: "Tissue Paper",
};

// Custom Styles
const useStyles = makeStyles((theme) => ({
  BackButton: {
    background: "linear-gradient(45deg, #3adf57 30%, #75e093 90%)",
    border: 0,
    color: "black",
    height: 60,
  },
  root: {
    display: "flex",
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  Image: {
    border: "5px solid #88c399",
    borderRadius: "5px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
    maxWidth: 500,
  },
  selectEmpty: {
    paddingTop: "12px",
    fontSize: "2rem",
  },
  paperCard: {
    maxWidth: 950,
    margin: "auto",
    marginTop: "20px",
    backgroundColor: "#ffffff00",
  },
  ConfirmButtonGrid: {
    margin: "auto",
  },
  actionsContainer: {
    marginBottom: theme.spacing(1),
  },
  resetContainer: {
    padding: theme.spacing(2),
  },
  WarningButton: {
    backgroundColor: "#f44336",
    color: "#ffffff",
    fontSize: "2rem",
  },
  button: {
    fontSize: "2rem",
  },
  divBox: {
    marginTop: "2px",
  },
  FormLabel: {
    fontSize: "2rem",
  },
  loadingPredictions: {
    marginTop: 0,
    fontSize: "2rem",
  },
  Confirm: {
    fontSize: "2rem",
    marginBottom: 20,
  },
  DialogCard: {
    minWidth: "900px !important",
  },
  StepperTitle: {
    fontSize: "2rem",
    alignSelf: "center",
    marginBottom: 0,
    marginTop: 5,
  },
  imagebox: {
    marginTop: 60,
  },
}));

// Stepper for Questionnaire
function getSteps() {
  return [
    "Is it made up of more than one material?",
    "Does it have food or liquid in it?",
    "Is it a disposable item?",
    "Did it previously contain hazardous waste?",
  ];
}

function getStepsPredictions() {
  return [
    "Material",
    "Item"
  ];
}
function getStepContentPredictions(step) {
  switch (step) {
    case 0:
      return `Verify the material predicted!`;
    case 1:
      return "Verify the item predicted!";
  }
} 
function getStepContent(step) {
  switch (step) {
    case 0:
      return `If it does, it cannot be recycled. Please throw it in a normal bin! If it is only made up of one material, please continue with the questionnaire.`;
    case 1:
      return "If it does, please remove the food/liquid before putting it into me! If it does not, continue onto the next question";
    case 2:
      return `If it is a disposable item, it cannot be recycled. Please throw it in a normal bin. `;
    case 3:
      return `If it does, it cannot be recycled. Please throw it in a normal bin.`;
    default:
      return "Unknown step";
  }
} 

function Questionnaire() {
  // Prediction Parsing
  function regex1(data) {
    const material_regex = /(?<=Material\s)(\w*)(?=\s)/gm;
    const material_conf_regex = /(?<=Material\s(\w*)\s0.)(\d{2})/gm;
    const item_regex = /(?<=Item\s)(\w*)(?=\s)/gm;
    const item_conf_regex = /(?<=Item\s(\w*)\s0.)(\d{2})/gm;

    var material = data.match(material_regex);
    var material_conf = data.match(material_conf_regex);
    var item = data.match(item_regex);
    var item_conf = data.match(item_conf_regex);
    return { material, material_conf, item, item_conf };
  }
  function regex_new(data) {
    const material_regex = /(?<=Material.)(\w*)(?=.)/gm;
    const material_conf_regex = /(?<=Material\s(\w*)\s0.)(\d{2})/gm;
    const item_regex = /(?<=Item\s)(\w*)(?=\s)/gm;
    const item_conf_regex = /(?<=Item\s(\w*)\s0.)(\d{2})/gm;

    var material = data.match(material_regex);
    var material_conf = data.match(material_conf_regex);
    var item = data.match(item_regex);
    var item_conf = data.match(item_conf_regex);
    return { material, material_conf, item, item_conf };
  }
  // States
  const [material, setMaterial] = React.useState(0);
  const [item_dict, setItemDict] = React.useState(plastic_item_name_dict);
  const [item, setItem] = React.useState(0);
  const [imageURL, setImageURL] = React.useState();
  const [glass, setGlass] = React.useState(0);
  const [others, setOthers] = React.useState(0);
  const [metal, setMetal] = React.useState(0);
  const [plastic, setPlastic] = React.useState(0);
  const [paper, setPaper] = React.useState(0);

  // Form Control
  const handleChangeMaterial = (event) => {
    setMaterial(event.target.value);
    if (event.target.value === 1) {
      setItemDict(metal_num_name_dict);
      setItem(metal);
    } else if (event.target.value === 2) {
      setItemDict(glass_num_name_dict);
      setItem(glass);
    } else if (event.target.value === 3) {
      setItemDict(paper_num_name_dict);
      setItem(paper);
    } else if (event.target.value === 4) {
      setItemDict(plastic_num_name_dict);
      setItem(plastic)
    } else if (event.target.value === 5) {
      setItemDict(others_num_name_dict);
      setItem(others);
    }
  };
  const handleChangeItem = (event) => {
    setItem(event.target.value);
  };

  // Upload Image to Firebase
  const handleUploadImage = (data, uuid) => {
    const uploadTask = storage
      .ref(`images/${uuid}.png`)
      .putString(data, "base64");
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(`${uuid}.png`)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            setImageURL(url);
          });
      }
    );
  };

  // To run only once upon loading, using UseEffect. Settles the temporary connection to web socket to get the image and prediction.
  useEffect(() => {


    var url = 'ws://localhost:8000/'
    //var url = "ws://192.168.1.31:8000/";
    // var url = "ws://10.27.180.226:8000/";
    var count = 0;
    if (count === 0) {
      var ws = new WebSocket(url + "stream");
      count++;
    }
    ws.onopen = function () {
      ws.send("view_image");
      ws.send("get_prediction");
    };
    ws.onmessage = function (msg) {
      var current_uuid = short.generate();
      if (msg.data.length > 1000) {
        document.getElementById("currentImage").src =
          "data:image/png;base64, " + msg.data;
        handleUploadImage(msg.data, current_uuid);
      } else if (msg.data.startsWith("Material")) {

        // var results = regex1(msg.data);
        console.log(msg.data);
        var results = msg.data.split(" ");
        console.log(results);
        var predicted_material = parseInt(results[1]);
        var predicted_glass = parseInt(results[2]);
        var predicted_metal = parseInt(results[3]);
        var predicted_paper = parseInt(results[4]);
        var predicted_plastic = parseInt(results[5]);
        var predicted_others = parseInt(results[6]);
        setMetal(predicted_metal);
        setOthers(predicted_others);
        setPaper(predicted_paper);
        setPlastic(predicted_plastic);
        setGlass(predicted_glass);
        if (predicted_material === 1) {
          //var predicted_item = metal_item_num_dict[results[3]];
          setItem(predicted_metal);
          setItemDict(metal_num_name_dict);
        } else if (predicted_material === 2) {
          //var predicted_item = glass_item_num_dict[results[2]];
          setItem(predicted_glass);
          setItemDict(glass_num_name_dict);
        } else if (predicted_material === 3) {
          //var predicted_item = paper_item_num_dict[results[4]];
          setItem(predicted_paper);
          setItemDict(paper_num_name_dict);
        } else if (predicted_material === 4) {
          //var current = results[5];
          //var predicted_item = plastic_item_num_dict[current];
          setItem(predicted_plastic);
          setItemDict(plastic_num_name_dict);
        } else if (predicted_material === 5) {
          //var current = results[6];
          //var predicted_item = others_item_num_dict[current];
          setItem(predicted_others);
          setItemDict(others_num_name_dict);
        }
        setMaterial(predicted_material);

        document.getElementById("prediction").textContent =
          "I predict that this is:";
        ws.close();
      }
    };
  }, 0);

  // Back Button
  let history = useHistory();
  function BackButton() {
    history.goBack();
  }

  //Dialog for Contamination Questionnaire
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //Handles the updating of database with the recycled item
  const handleCloseWithCompletedChecklist = () => {
    setOpen(false);
    // UNCOMMENT BELOW
    if (activeStep===-1) {
        var ws = new WebSocket('ws://localhost:8000/' + "stream");
        ws.onopen = function () {
              ws.send("non_recyclable")
              ws.close()
        }
        firebase.firestore().collection('RecycledItemsImages').add({
            item: item_dict[item],
            material: material_num_item_dict[material],
            url: imageURL,
            location: 'NTU',
            contaminated: true
        })
        firebase.firestore().collection('RecycledItems').doc(item_dict[item]).update({
            quantity: firebase.firestore.FieldValue.increment(1)
        })
        firebase.firestore().collection('Locations').doc('NTU').update({
            Quantity: firebase.firestore.FieldValue.increment(1)
        })
        firebase.firestore().collection('RecycledMaterials').doc(material_num_name_dict[material]).update({
            Quantity: firebase.firestore.FieldValue.increment(1)
        })
    }
    else {
        var ws = new WebSocket('ws://localhost:8000/' + "stream");
        ws.onopen = function () {
              ws.send("recyclable")
              ws.close()
        }
        firebase.firestore().collection('RecycledItemsImages').add({
            item: item_dict[item],
            material: material_num_item_dict[material],
            url: imageURL,
            location: 'NTU',
            contaminated: false
        })
        firebase.firestore().collection('RecycledItems').doc(item_dict[item]).update({
            quantity: firebase.firestore.FieldValue.increment(1)
        })
        firebase.firestore().collection('Locations').doc('NTU').update({
            Quantity: firebase.firestore.FieldValue.increment(1)
        })
        firebase.firestore().collection('RecycledMaterials').doc(material_num_name_dict[material]).update({
            Quantity: firebase.firestore.FieldValue.increment(1)
        })
    }
    setTimeout(function () {
      window.location.replace("../home");
    }, 2000);
  };

  //Stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleDeath = () => {
    setActiveStep(-1);
  };

  const stepsPrediction = getStepsPredictions();
  const [activeStepPrediction, setActiveStepPrediction] = React.useState(0);
  const handleNextPrediction = () => {
    setActiveStepPrediction((prevActiveStepPrediction) => prevActiveStepPrediction + 1);
  };
  const handleBackPrediction = () => {
    setActiveStepPrediction((prevActiveStepPrediction) => prevActiveStepPrediction - 1);
  };


  const classes = useStyles();
  return (
    <Paper elevation="0" className={classes.paperCard}>
      <Fab
        color="red"
        aria-label="back"
        onClick={BackButton}
        className={classes.BackButton}
      >
        <ArrowBackIcon />
      </Fab>
      <Grid container spacing={3} className={classes.divBox}>
        <Grid item xs={6}>
          <div className={classes.imagebox}>
            <img className={classes.Image} id="currentImage" alt="loading_image" src="https://i.ibb.co/tZWCqtf/image-loading.png"></img>
            
          </div>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <p className={classes.loadingPredictions} id="prediction">Loading Prediction...</p>

            <Grid container spacing={1}>
              <Grid item xs={12}>
              {activeStepPrediction === stepsPrediction.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  {/* <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button> */}
                </div>
              ) : (
          <div>
            <div>
              {activeStepPrediction === 0? <FormControl className={classes.formControl}>
                  <InputLabel className={classes.FormLabel} shrink>
                    Material
                  </InputLabel>
                  <Select
                    value={material}
                    onChange={handleChangeMaterial}
                    displayEmpty
                    className={classes.selectEmpty}
                  >
                    <MenuItem value={1}>Metal</MenuItem>
                    <MenuItem value={2}>Glass</MenuItem>
                    <MenuItem value={3}>Paper</MenuItem>
                    <MenuItem value={4}>Plastic</MenuItem>
                    <MenuItem value={5}>Others</MenuItem>
                  </Select>
                  <FormHelperText>
                    Please correct me if I'm wrong!
                  </FormHelperText>
                </FormControl> : ''}
              {activeStepPrediction === 1? <FormControl className={classes.formControl}>
                  <InputLabel shrink className={classes.FormLabel}>
                    Item
                  </InputLabel>
                  <Select
                    value={item}
                    onChange={handleChangeItem}
                    // displayEmpty
                    className={classes.selectEmpty}
                  >
                    {Object.entries(item_dict).map(([key, value]) => (
                      <MenuItem value={key}>{value}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Please correct me if I'm wrong!
                  </FormHelperText>
                </FormControl> : ''}
              <Button disabled={activeStepPrediction === 0} onClick={handleBackPrediction} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={activeStepPrediction === stepsPrediction.length -1 ? handleClickOpen : handleNextPrediction}
                className={classes.button}
              >
                {activeStepPrediction === stepsPrediction.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}

              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12}>
               
              </Grid>
              <Grid
                item
                xs={11}
                alignItems="center"
                justify="space-evenly"
                className={classes.ConfirmButtonGrid}
              >

              </Grid>
            </Grid>
          </Paper>
        </Grid>

      
      </Grid>
      <Dialog
        maxWidth="xl"
        className={classes.DialogCard}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title1"
      >
        <p className={classes.StepperTitle} id="form-dialog-title">
          Now let's check for contamination!
        </p>

        <DialogContent maxWidth="xl">
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel variant="h4">
                  <Typography variant="h4">{label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="h6">{getStepContent(index)}</Typography>
                  <div className={classes.actionsContainer}>
                    <div>
                      <Grid container spacing={3}>
                        <Grid item spacing={4}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.button}
                          >
                            Back
                          </Button>
                        </Grid>
                        <Grid item spacing={4}>
                          <Button
                            variant="contained"
                            onClick={handleDeath}
                            className={classes.WarningButton}
                          >
                            Yes
                          </Button>
                        </Grid>
                        <Grid item spacing={4}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            No
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <div>
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography variant="h5">
                  Contamination checklist completed, your item is not
                  contaminated! Please throw it into the opening lit up for you!
                </Typography>
              </Paper>
              <Button
                onClick={handleCloseWithCompletedChecklist}
                color="primary"
                fullWidth
                variant="contained"
              >
                Thrown!
              </Button>
            </div>
          )}
          {activeStep === -1 && (
            <div>
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography variant="h5">
                  It appears that your item is contaminated and cannot be
                  recycled. Please throw it in a normal bin.
                </Typography>
              </Paper>
              <Button
                onClick={handleCloseWithCompletedChecklist}
                color="primary"
                fullWidth
                variant="contained"
                className={classes.button}
              >
                Done!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
export default Questionnaire;
