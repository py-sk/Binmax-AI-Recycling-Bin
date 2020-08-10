import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Home/Dashboard";
import Camera from "./components/Camera/Camera";
import SocialExpanded from "./components/Social/Social";
import StatsExpanded from "./components/Stats/Stats";
import EducationExpanded from "./components/Education/Education";
import Questionnaire from "./components/Camera/Questionnaire";
import Screensaver from "./components/Home/Screensaver";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="App window">
          <NavBar />
          <Route exact path="/" component={Screensaver} />
          <Route exact path="/home" component={Dashboard} />
          <Route path="/social" component={SocialExpanded} />
          <Route path="/camera" component={Camera} />
          <Route path="/stats" component={StatsExpanded} />
          <Route path="/education" component={EducationExpanded} />
          <Route path="/questionnaire" component={Questionnaire} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
