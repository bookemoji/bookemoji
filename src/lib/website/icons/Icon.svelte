<script lang="ts" context="module">
  type IconName = "collapse_all" | "expand_all" | "article_person" | "check" | "event" | "play_circle" | "pause_circle" | "content_copy";
  import { PUBLIC_MATERIAL_ICONS } from "$env/static/public";

  export let icons: IconName[] = PUBLIC_MATERIAL_ICONS.split(",").filter((a) => a !== "") as IconName[];
</script>

<script lang="ts">
  export let name: (typeof icons)[number];
  export let size: string = "1rem";
  export let color: string = "currentColor";
</script>

<span class="material-symbols-rounded" style:font-size={size} style:color>
  {name}
</span>

<style>
  .material-symbols-rounded {
    font-family: "Material Symbols Rounded";
    font-variation-settings:
      "FILL" 0,
      "wght" 200,
      "GRAD" 0,
      "opsz" 24;
  }
</style>
