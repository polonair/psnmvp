import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import ShareProfile from "./containers/ShareProfile";
import NewProfile from "./containers/NewProfile";
import ShowLink from "./containers/ShowLink";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <AuthenticatedRoute path="/share" exact component={ShareProfile} props={childProps} />
    <AuthenticatedRoute path="/new" exact component={NewProfile} props={childProps} />
    <AppliedRoute path="/link/:id" exact component={ShowLink} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;
