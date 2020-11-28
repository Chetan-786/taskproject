import React from "react";
import { Switch, Route } from 'react-router-dom'
import Login from "./components/login";
import Register from "./components/register";
import Notes from "./components/notes";
import ArchivedNotes from "./components/archivedNotes";
import DeletedNotes from "./components/deletedNotes";


const Routes = (props) =>
    (

        <Switch>
            {/* {console.log("Routes props.sessionValuesProps==>", props.sessionValuesProps)} */}
            {
                props.sessionValuesProps ?
                    <Route exact path="/" component={Notes} /> :
                    <Route exact path="/" component={Login} />

            }

            <Route path="/login" component={Login} />
            <Route path="/notes" component={Notes} />
            <Route path="/register" component={Register} />
            <Route path="/archived" component={ArchivedNotes} />
            <Route path="/deleted" component={DeletedNotes} />
        </Switch>
    )


export default Routes;