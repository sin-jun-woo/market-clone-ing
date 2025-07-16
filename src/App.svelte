<script>
  import Main from "./pages/Main.svelte";
  import Signup from "./pages/Signup.svelte";
  import Write from "./pages/Write.svelte";
  import Login from "./pages/Login.svelte";
  import Router from "svelte-spa-router";
  import Notfound from "./pages/Notfound.svelte";
  import "./css/style.css";

  const routes = {
    "/": Main,
    "/login": Login,
    "/signup": Signup,
    "/write": Write,
    "*": Notfound,
  };
</script>

<Router {routes}></Router>
