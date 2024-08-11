import { Link, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Doctors from "./Doctors";
import NewReview from "./NewReview";
import NavBar from "./NavBar";

function App() {
  return (
  <div>
    <NavBar />
    <div>
      <Switch> 
        <Route exact path='/'><Home /></Route> 
        <Route exact path='/doctors'><Doctors /></Route> 
        <Route exact path='/createreview'><NewReview /></Route>
      </Switch>
    </div>
  </div>
  )
}

export default App;
