<script lang="ts">
  interface Props {
    text: string;
  }

  let { text }: Props = $props();
</script>

<h1>{text}</h1>
