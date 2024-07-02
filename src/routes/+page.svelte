<script>
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  import { browser } from "$app/environment";
  if (browser) {
    goto(`${base}/papers`);
  }

  console.log("root base", base);
</script>

<h1>Paper Similarity</h1>

Please start on or
<div class="row">
  <div class="col-auto">
    <a class="btn btn-primary" href="{base}/papers">search papers</a>
  </div>

  <div class="col-auto">
    <a class="btn btn-primary" href="{base}/authors"
  >search authors</a
>
  </div>
</div>

