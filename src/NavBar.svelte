<script>
  import { base } from "$app/paths";
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
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
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="{base}/papers"
            >Search papers</a
          >
        </li>
        <!-- <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/recPapers/">Recommend papers</a>
        </li> -->
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="{base}/authors"
            >Search authors</a
          >
        </li>
        <!-- <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/recAuthors/">Recommended authors</a>
        </li> -->
      </ul>
    </div>
  </div>
</nav>
