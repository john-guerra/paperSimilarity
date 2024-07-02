<script>
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { browser } from "$app/environment";

  $: base && browser && $page.url.href;

  export let href = "";
</script>

<li class="nav-item">
  <a
    class="nav-link {$page.url.pathname === href ? 'active' : ''}"
    aria-current={$page.url.pathname === href}
    {href}
  >
    <slot /></a
  >
</li>
