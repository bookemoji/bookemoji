<svelte:options namespace="svg" />

<script lang="ts">
  export let scale: number = 1;
  export let width: number = 105;
  export let height: number = 125;

  var yellowIndex = Math.floor(Math.random() * 5);
  let fill = `var(--yellow-${yellowIndex})`;
</script>

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0" width={width * scale} height={height * scale}>
  <path
    style:fill
    d="m18.008 49.34c5.9961 2.9453 21.324 0.74219 28.609 3.5742l3.1133 29.586 3.1914-29.859 29.066-2.9688c-3.5391-1.6602-22.914-2.6445-28.531-3.3594-1.8555-3.3047-2.9531-23.355-3.3477-28.812-2.332 4.7539-1.9609 25.5-3.5938 28.105-1.1758 1.875-24.621 3.0273-28.508 3.7344z"
    fill-rule="evenodd"
  />
</svg>
