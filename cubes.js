(() => {
  const cubes = [];
  const N = 30;
  const SIZE = 30;

  const MOUSE_RADIUS = 120;
  const MOUSE_FORCE = 1.5;

  const mouse = {
    x: -1000,
    y: -1000,
  };

  const randomColor = () =>
    `hsl(${Math.random() * 360}, 80%, 60%)`;

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

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
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 5,
    });
  }

  function animate() {
    for (const c of cubes) {
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.vr;

      // Mouse interaction
      const cx = c.x + SIZE / 2;
      const cy = c.y + SIZE / 2;

      const dx = cx - mouse.x;
      const dy = cy - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MOUSE_RADIUS && distance > 0) {
        const strength =
          (1 - distance / MOUSE_RADIUS) * MOUSE_FORCE;

        c.vx += (dx / distance) * strength;
        c.vy += (dy / distance) * strength;
      }

      // Keep cubes inside viewport
      let hitEdge = false;

      if (c.x <= 0) {
        c.x = 0;
        c.vx = Math.abs(c.vx);
        hitEdge = true;
      } else if (c.x >= innerWidth - SIZE) {
        c.x = innerWidth - SIZE;
        c.vx = -Math.abs(c.vx);
        hitEdge = true;
      }

      if (c.y <= 0) {
        c.y = 0;
        c.vy = Math.abs(c.vy);
        hitEdge = true;
      } else if (c.y >= innerHeight - SIZE) {
        c.y = innerHeight - SIZE;
        c.vy = -Math.abs(c.vy);
        hitEdge = true;
      }

      if (hitEdge) {
        c.el.style.background = randomColor();
      }

      // Limit speed
      const speed = Math.sqrt(c.vx ** 2 + c.vy ** 2);
      const maxSpeed = 10;

      if (speed > maxSpeed) {
        c.vx = (c.vx / speed) * maxSpeed;
        c.vy = (c.vy / speed) * maxSpeed;
      }

      c.el.style.left = `${c.x}px`;
      c.el.style.top = `${c.y}px`;
      c.el.style.transform = `rotate(${c.rotation}deg)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
