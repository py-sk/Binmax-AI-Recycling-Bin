import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { Link, useHistory } from "react-router-dom";
//Icons
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import HomeIcon from "@material-ui/icons/Home";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import FormatListNumberedRtlIcon from "@material-ui/icons/FormatListNumberedRtl";
import SchoolIcon from "@material-ui/icons/School";

// Custom Styles
const useStyles = makeStyles({
  root: {
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
  selectedButton: {
    background: "linear-gradient(45deg, #3adf57 30%, #75e093 90%)",
    color: "#101311",
  },
});

function NavBar() {
  let location = useHistory();
  setTimeout(function () {
    if (location.location.pathname === "/social") {
      setActive("Social");
    } else if (location.location.pathname === "/camera") {
      setActive("Camera");
    } else if (location.location.pathname === "/stats") {
      setActive("Stats");
    } else if (location.location.pathname === "/education") {
      setActive("Education");
    }
  }, 1000);
  const [active, setActive] = React.useState("Home");
  const classes = useStyles();
  return location.location.pathname === "/" ? (
    <div></div>
  ) : (
  // return (
    <BottomNavigation
      value={active}
      onChange={(event, newValue) => {
        setActive(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        component={Link}
        to="/home"
        label="Home"
        value="Home"
        icon={<HomeIcon />}
        className={"Home" === active ? classes.selectedButton : null}
      />
      <BottomNavigationAction
        component={Link}
        to="/social"
        value="Social"
        label="What's New"
        icon={<NewReleasesIcon />}
        className={"Social" === active ? classes.selectedButton : null}
      />
      <BottomNavigationAction
        component={Link}
        to="/camera"
        value="Camera"
        label="Recycle!"
        icon={<RestoreFromTrashIcon />}
        className={"Camera" === active ? classes.selectedButton : null}
      />
      <BottomNavigationAction
        component={Link}
        to="/stats"
        value="Stats"
        label="Statistics"
        icon={<FormatListNumberedRtlIcon />}
        className={"Stats" === active ? classes.selectedButton : null}
      />
      <BottomNavigationAction
        component={Link}
        to="/education"
        value="Education"
        label="Education"
        icon={<SchoolIcon />}
        className={"Education" === active ? classes.selectedButton : null}
      />
    </BottomNavigation>
  );
}
export default NavBar;
