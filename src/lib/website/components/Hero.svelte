<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { createRenderer, type TimeInfo } from "./renderer.js";

  let canvasRef: HTMLCanvasElement;
  let containerRef: HTMLDivElement;

  let width: number = browser ? globalThis.innerWidth : 0;
  let height: number = browser ? globalThis.innerHeight : 0;

  let last_mouse = {
    x: 0,
    y: 0,
  };
  let mouse = {
    x: 0,
    y: 0,
  };

  const peachColor: readonly [r: number, g: number, b: number] = [250, 136, 107];

  onMount(() => {
    let renderer: ReturnType<typeof createRenderer>;
    let context = canvasRef.getContext("2d");

    let datagrid: number[][] = [];
    // todo
    // let changed: Record<number, number> = {};

    if (context) {
      renderer = createRenderer({
        canvas: canvasRef,
        context,
        width,
        height,
      });

      let grid_size = 32;
      const grid: readonly [rows: number, cols: number] = [Math.floor(width / grid_size), Math.floor(height / grid_size)];
      const [rows, cols] = grid;

      datagrid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
      console.log(datagrid);

      let padding: number = 1;
      const cellsize = grid_size - padding;
      const cellOffset = grid_size + padding;

      function decay(t: number, value: number): number {
        return Math.max(0, value - Math.random() * 4);
      }

      function updateMouseHover() {
        if (last_mouse.x !== mouse.x || last_mouse.y !== mouse.y) {
          last_mouse.x = mouse.x;
          last_mouse.y = mouse.y;
          const row = Math.floor(mouse.x / cellOffset);
          const col = Math.floor(mouse.y / cellOffset);

          const within = 2; // You can tweak this value to change the neighbor range

          if (row < rows && col < cols) {
            datagrid[row][col] = 400 + Math.random() * 600;

            const neighbors = [];
            // Collect all valid neighboring cells within a Manhattan distance of `within`
            for (let dr = -within; dr <= within; dr++) {
              for (let dc = -within; dc <= within; dc++) {
                // Skip the center cell itself
                if (dr === 0 && dc === 0) continue;

                const neighborRow = row + dr;
                const neighborCol = col + dc;

                const isInBounds = neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols;

                const manhattanDistance = Math.abs(dr) + Math.abs(dc);

                if (isInBounds && manhattanDistance <= within) {
                  neighbors.push([neighborRow, neighborCol]);
                }
              }
            }

            for (let i = 0; i < Math.min(within, neighbors.length); i++) {
              const idx = Math.floor(Math.random() * neighbors.length);
              const [nr, nc] = neighbors.splice(idx, 1)[0];
              if (datagrid[nr][nc] === 0) {
                datagrid[nr][nc] = Math.random() * 2000;
              }
            }
          }
        }
      }

      function update(time: TimeInfo) {
        for (let row = 0; row < datagrid.length; row++) {
          // const row = datagrid[row];
          for (let col = 0; col < datagrid[row].length; col++) {
            const value = datagrid[row][col];
            datagrid[row][col] = decay(time.delta, value);
          }
        }

        updateMouseHover();
      }
      function render(time: TimeInfo, ctx: CanvasRenderingContext2D) {
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const value = datagrid[row][col];
            let alpha = 1;
            let r = 30,
              g = 40,
              b = 50;
            if (value > 0) {
              alpha = value / (1000 * 3);
              [r, g, b] = peachColor;
            }

            // rgb(250 136 107)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            if (value > 0) {
              ctx.save();
              const offset = cellsize / 2;
              const size = Math.max(offset, cellsize * (1 - value / 1000));
              ctx.translate(row * cellOffset + offset, col * cellOffset + offset);
              ctx.rotate(((value / 1000) * 180 * Math.PI) / 180);
              ctx.fillRect(-offset, -offset, size, size);
              ctx.restore();
            } else {
              ctx.fillRect(row * cellOffset, col * cellOffset, cellsize, cellsize);
            }
          }
        }

        ctx.fillStyle = "#000";
      }

      const unsub = renderer.onFrame((time, ctx) => {
        update(time);
        render(time, ctx);
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
