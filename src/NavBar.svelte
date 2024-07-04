<script>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import NavLink from "./lib/components/NavLink.svelte";

  // Update when the url change
  // console.log("NavBar page", browser ? $page.url: "");
  $: base && browser && $page.url.href;
</script>

<nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="{base}/papers">Paper Similarity</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        

        <NavLink href="{base}/papers/">Search papers</NavLink>
        <NavLink href="{base}/authors/">Search authors</NavLink>

        <!-- <li class="nav-item">
          <a class="nav-link" href="{base}/"
            >Root</a
          >
        </li> -->
      </ul>
    </div>
  </div>
</nav>
