<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { createRenderer, type TimeInfo } from "./renderer.js";
  import { wait } from "../renderer-utils.js";

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

  let freeze_mouse: boolean = true;

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

      let padding: number = 1;
      const cellsize = grid_size - padding;
      const cellOffset = grid_size + padding;

      function decay(t: number, value: number): number {
        return Math.max(0, value - Math.random() * 4);
      }

      function applyBrushToMouseLocation() {
        if (last_mouse.x !== mouse.x || last_mouse.y !== mouse.y) {
          last_mouse.x = mouse.x;
          last_mouse.y = mouse.y;
          const row = Math.max(0, Math.floor(mouse.x / cellOffset));
          const col = Math.max(0, Math.floor(mouse.y / cellOffset));

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

        applyBrushToMouseLocation();
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

      const bezierPath = randomBezierPath([0, 0], [width, height]);

      const subPath1 = randomBezierPath(bezierPath[randomIntAlong(bezierPath.length - 1, 0.25, 0.65)], [width, 0]);
      const subPath2 = randomBezierPath(bezierPath[randomIntAlong(bezierPath.length - 1, 0.15, 0.85)], [width, height]);

      const paintPath: (el: Coords) => void = ([x, y]) => {
        mouse.x = x;
        mouse.y = y;
        applyBrushToMouseLocation();
      };

      bezierPath.forEach(paintPath);
      subPath1.forEach(paintPath);
      subPath2.forEach(paintPath);
      freeze_mouse = false;

      return () => {
        renderer.stop();
        unsub();
      };
    }
  });

  type Coords = readonly [x: number, y: number];

  function rand(n = 1) {
    return Math.random() * n;
  }

  function randomIntAlong(n: number, min: number, max: number) {
    const start = Math.floor(min * n);
    const end = Math.floor(max * n);
    const index = Math.max(0, Math.min(n, start + Math.floor(Math.random() * Math.max(1, end - start))));
    return index;
  }

  function randomBezierPath(start: Coords, end: Coords, numPoints = 50): Coords[] {
    // Random control points
    // To create a stronger S-shaped curve, place control points on opposite sides of the line from start to end.
    // For a diagonal S, offset control points perpendicularly from the line.
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const mx = (start[0] + end[0]) / 2;
    const my = (start[1] + end[1]) / 2;
    // Perpendicular vector (normalized)
    const perpLen = Math.sqrt(dx * dx + dy * dy) || 1;
    const perpX = -dy / perpLen;
    const perpY = dx / perpLen;
    // S-curve strength
    const strength = 0.4 * perpLen + rand(perpLen * 0.1);

    // Control points on opposite sides for S shape
    const cp1: Coords = [mx - dx * 0.25 + perpX * strength, my - dy * 0.25 + perpY * strength];
    const cp2: Coords = [mx + dx * 0.25 - perpX * strength, my + dy * 0.25 - perpY * strength];

    // Cubic Bezier formula
    function bezier(t: number): Coords {
      const x = Math.pow(1 - t, 3) * start[0] + 3 * Math.pow(1 - t, 2) * t * cp1[0] + 3 * (1 - t) * Math.pow(t, 2) * cp2[0] + Math.pow(t, 3) * end[0];
      const y = Math.pow(1 - t, 3) * start[1] + 3 * Math.pow(1 - t, 2) * t * cp1[1] + 3 * (1 - t) * Math.pow(t, 2) * cp2[1] + Math.pow(t, 3) * end[1];
      return [x, y];
    }

    const path: Coords[] = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      path.push(bezier(t));
    }

    return path;
  }

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
    height: calc(85vh - 10rem);
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
