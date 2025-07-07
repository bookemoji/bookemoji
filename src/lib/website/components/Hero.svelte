<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { createRenderer } from "./renderer.js";

  let canvasRef: HTMLCanvasElement;
  let containerRef: HTMLDivElement;

  let width: number = browser ? globalThis.innerWidth : 0;
  let height: number = browser ? globalThis.innerHeight : 0;

  let mouse = {
    x: 0,
    y: 0,
  };

  onMount(() => {
    let renderer: ReturnType<typeof createRenderer>;
    let context = canvasRef.getContext("2d");

    let datagrid: number[][] = [];

    if (context) {
      renderer = createRenderer({
        canvas: canvasRef,
        context,
        width,
        height,
      });

      let grid_size = 10;

      const grid: readonly [rows: number, cols: number] = [width / grid_size, height / grid_size];
      let padding: number = 1;

      const unsub = renderer.onFrame((time, ctx) => {
        const [rows, cols] = grid;

        const center_x = Math.round(width / 2);
        const center_y = Math.round(height / 2);

        const center_row = Math.ceil(rows / 2);
        const center_col = Math.ceil(cols / 2);
        const cellsize = grid_size - padding;
        const cellOffset = grid_size + padding;

        const mouse_x = Math.round(mouse.x / cellOffset);
        const mouse_y = Math.round(mouse.y / cellOffset);

        const threshold = Math.round(width / 10);

        ctx.fillStyle = "rgba(0,0,0,0.1)";

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            // Calculate distance from mouse for each axis
            const dx = Math.abs(mouse_x - row);
            const dy = Math.abs(mouse_y - col);

            // Falloff: if distance > 50, clamp to 10; else scale 0 (close) to 10 (far)
            const x_aug = dx > threshold ? cellsize : (dx / threshold) * cellsize;
            const y_aug = dy > threshold ? cellsize : (dy / threshold) * cellsize;

            const pre_aug = (x_aug + y_aug) / 2;
            const aug = pre_aug + Math.round(Math.random());

            ctx.fillStyle = `rgba(${aug * 15}, ${aug * 8}, ${aug * 2}, ${pre_aug * 0.9})`;

            // if (x_aug == 9) {
            //   ctx.save();
            //   ctx.rotate(aug);
            //   ctx.fillRect(row * cellOffset, col * cellOffset, cellsize, cellsize);
            //   ctx.restore();
            // } else {
            ctx.fillRect(row * cellOffset, col * cellOffset, cellsize, cellsize);
            // }
          }
        }
        // ctx.fillStyle = "#f00";
        // ctx.save();

        // ctx.translate(mouse_x, mouse_y);
        // ctx.fillRect(mouse_x * (grid_size + padding), mouse_y * (grid_size + padding), grid_size - padding, grid_size - padding);
        // ctx.restore();
      });

      renderer.start();

      return () => {
        renderer.stop();
        unsub();
      };
    }
  });

  function onMouseMove(e: MouseEvent) {
    mouse.x = e.x;
    mouse.y = e.y;
  }
</script>

<svelte:window on:mousemove={onMouseMove} />

<div class="stack" bind:this={containerRef}>
  <div class="hero-content">
    <slot />
  </div>
  {#if browser}
    <canvas id="screen" {width} {height} aria-hidden="true" bind:this={canvasRef}></canvas>
  {/if}
</div>

<style>
  #screen {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .stack {
    height: calc(90vh - 10rem);
    width: 100vw;
    place-content: center;
    display: grid;
  }

  .stack > * {
    grid-area: 1 / 2;
  }

  .hero-content {
    display: grid;
    place-content: center;
  }
</style>
