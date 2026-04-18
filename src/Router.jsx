import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import Loading from "./components/Loading";
const Home = lazy(() => import("./pages/Home"));
const Play = lazy(() => import("./pages/Play"));
const Solo = lazy(() => import("./pages/Solo"));
const Admin = lazy(() => import("./pages/Admin"));
const Users = lazy(() => import("./pages/Users"));
const Questions = lazy(() => import("./pages/Questions"));
const Update = lazy(() => import("./pages/Update"));
const Add = lazy(() => import("./pages/Add"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Profile = lazy(() => import("./pages/Profile"));
const Versions = lazy(() => import("./pages/Versions"));
const Faq = lazy(() => import("./pages/Faq"));
const Error = lazy(() => import("./pages/Error"));

function Router() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/play" exact element={<Play />} />
        <Route path="/solo" exact element={<Solo />} />
        <Route path="/admin" exact element={<Admin />} />
        <Route path="/users" exact element={<Users />} />
        <Route path="/questions" exact element={<Questions />} />
        <Route path="/update/:type?/:id?" exact element={<Update />} />
        <Route path="/add" exact element={<Add />} />
        <Route path="/quiz/:type?/:name?" exact element={<Quiz />} />
        <Route path="/me" exact element={<Profile />} />
        <Route path="/versions" exact element={<Versions />} />
        <Route path="/faq" exact element={<Faq />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
