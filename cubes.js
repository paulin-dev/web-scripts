(() => {
  const cubes = [];
  const N = 30;
  const SIZE = 30;
  const SPEED = 3;

  const randomColor = () =>
    `hsl(${Math.random() * 360}, 80%, 60%)`;

  for (let i = 0; i < N; i++) {
    const cube = document.createElement("div");

    Object.assign(cube.style, {
      position: "fixed",
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      background: randomColor(),
      zIndex: "999999",
      pointerEvents: "none",
      boxShadow: "0 0 10px rgba(0,0,0,.3)",
    });

    document.body.appendChild(cube);

    cubes.push({
      el: cube,
      x: Math.random() * (innerWidth - SIZE),
      y: Math.random() * (innerHeight - SIZE),
      vx: (Math.random() * 2 - 1) * SPEED,
      vy: (Math.random() * 2 - 1) * SPEED,
      rotation: Math.random() * 360,
      vr: (Math.random() * 2 - 1) * 5,
    });
  }

  function animate() {
    // Move + wall collisions
    for (const c of cubes) {
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.vr;

      let hit = false;

      if (c.x <= 0) {
        c.x = 0;
        c.vx = Math.abs(c.vx);
        hit = true;
      }

      if (c.x >= innerWidth - SIZE) {
        c.x = innerWidth - SIZE;
        c.vx = -Math.abs(c.vx);
        hit = true;
      }

      if (c.y <= 0) {
        c.y = 0;
        c.vy = Math.abs(c.vy);
        hit = true;
      }

      if (c.y >= innerHeight - SIZE) {
        c.y = innerHeight - SIZE;
        c.vy = -Math.abs(c.vy);
        hit = true;
      }

      if (hit) c.el.style.background = randomColor();
    }

    // Cube collisions
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = cubes[i];
        const b = cubes[j];

        const ax2 = a.x + SIZE;
        const ay2 = a.y + SIZE;
        const bx2 = b.x + SIZE;
        const by2 = b.y + SIZE;

        // No overlap
        if (
          ax2 <= b.x ||
          a.x >= bx2 ||
          ay2 <= b.y ||
          a.y >= by2
        ) {
          continue;
        }

        // Calculate penetration
        const overlapX = Math.min(ax2, bx2) - Math.max(a.x, b.x);
        const overlapY = Math.min(ay2, by2) - Math.max(a.y, b.y);

        // Horizontal collision
        if (overlapX < overlapY) {
          const direction = a.x < b.x ? 1 : -1;

          a.x -= direction * overlapX / 2;
          b.x += direction * overlapX / 2;

          a.vx = -Math.abs(a.vx) * direction;
          b.vx = Math.abs(b.vx) * direction;
        }

        // Vertical collision
        else {
          const direction = a.y < b.y ? 1 : -1;

          a.y -= direction * overlapY / 2;
          b.y += direction * overlapY / 2;

          a.vy = -Math.abs(a.vy) * direction;
          b.vy = Math.abs(b.vy) * direction;
        }
      }
    }

    // Draw
    for (const c of cubes) {
      c.el.style.left = `${c.x}px`;
      c.el.style.top = `${c.y}px`;
      c.el.style.transform = `rotate(${c.rotation}deg)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
