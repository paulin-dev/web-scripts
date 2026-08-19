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
      left: "0",
      top: "0",
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
    // Move cubes
    for (const c of cubes) {
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.vr;

      let hitEdge = false;

      // Left / right
      if (c.x < 0) {
        c.x = 0;
        c.vx = Math.abs(c.vx);
        hitEdge = true;
      } else if (c.x + SIZE > innerWidth) {
        c.x = innerWidth - SIZE;
        c.vx = -Math.abs(c.vx);
        hitEdge = true;
      }

      // Top / bottom
      if (c.y < 0) {
        c.y = 0;
        c.vy = Math.abs(c.vy);
        hitEdge = true;
      } else if (c.y + SIZE > innerHeight) {
        c.y = innerHeight - SIZE;
        c.vy = -Math.abs(c.vy);
        hitEdge = true;
      }

      if (hitEdge) {
        c.el.style.background = randomColor();
      }
    }

    // Cube ↔ cube collisions
    for (let i = 0; i < cubes.length; i++) {
      for (let j = i + 1; j < cubes.length; j++) {
        const a = cubes[i];
        const b = cubes[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const overlapX = SIZE - Math.abs(dx);
        const overlapY = SIZE - Math.abs(dy);

        if (overlapX > 0 && overlapY > 0) {
          // Collision is horizontal
          if (overlapX < overlapY) {
            const direction = dx >= 0 ? 1 : -1;

            // Separate them
            a.x -= overlapX * direction / 2;
            b.x += overlapX * direction / 2;

            // Only bounce if moving toward each other
            if ((a.vx - b.vx) * direction > 0) {
              [a.vx, b.vx] = [b.vx, a.vx];
            }
          }

          // Collision is vertical
          else {
            const direction = dy >= 0 ? 1 : -1;

            // Separate them
            a.y -= overlapY * direction / 2;
            b.y += overlapY * direction / 2;

            // Only bounce if moving toward each other
            if ((a.vy - b.vy) * direction > 0) {
              [a.vy, b.vy] = [b.vy, a.vy];
            }
          }
        }
      }
    }

    // Render
    for (const c of cubes) {
      c.el.style.left = `${c.x}px`;
      c.el.style.top = `${c.y}px`;
      c.el.style.transform = `rotate(${c.rotation}deg)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
