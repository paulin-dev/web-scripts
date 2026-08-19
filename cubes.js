(() => {
  const cubes = [];
  const particles = [];

  const N = 30;
  const SIZE = 30;

  const MOUSE_RADIUS = 120;
  const MOUSE_FORCE = 1.5;

  const EXPLOSION_RADIUS = 250;
  const EXPLOSION_FORCE = 15;

  const BOOST_RADIUS = 180;
  const BOOST_FORCE = 1.03;

  const GRAVITY = 0.15;
  let gravityEnabled = false;

  const mouse = {
    x: -1000,
    y: -1000,
  };

  const randomColor = () =>
    `hsl(${Math.random() * 360}, 80%, 60%)`;

  // Mouse
  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Gravity toggle
  window.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "g") {
      gravityEnabled = !gravityEnabled;
    }
  });

  // Click explosion
  window.addEventListener("click", e => {
    for (const c of cubes) {
      const cx = c.x + SIZE / 2;
      const cy = c.y + SIZE / 2;

      const dx = cx - e.clientX;
      const dy = cy - e.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < EXPLOSION_RADIUS && distance > 0) {
        const strength =
          (1 - distance / EXPLOSION_RADIUS) * EXPLOSION_FORCE;

        c.vx += (dx / distance) * strength;
        c.vy += (dy / distance) * strength;
      }
    }

    // Explosion particles
    for (let i = 0; i < 40; i++) {
      createParticle(e.clientX, e.clientY);
    }
  });

  // Cubes
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

  // Particles
  function createParticle(x, y) {
    const particle = document.createElement("div");

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    const size = Math.random() * 5 + 2;

    Object.assign(particle.style, {
      position: "fixed",
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      borderRadius: "50%",
      background: randomColor(),
      zIndex: "999998",
      pointerEvents: "none",
    });

    document.body.appendChild(particle);

    particles.push({
      el: particle,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
    });
  }

  function animateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      p.vx *= 0.97;
      p.vy *= 0.97;

      p.life -= 0.02;

      p.el.style.left = `${p.x}px`;
      p.el.style.top = `${p.y}px`;
      p.el.style.opacity = p.life;

      if (p.life <= 0) {
        p.el.remove();
        particles.splice(i, 1);
      }
    }
  }

  function animate() {
    for (const c of cubes) {
      // Gravity
      if (gravityEnabled) {
        c.vy += GRAVITY;
      }

      // Mouse repulsion
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

      // Speed boost near cursor
      if (distance < BOOST_RADIUS) {
        c.vx *= BOOST_FORCE;
        c.vy *= BOOST_FORCE;
      }

      // Move
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.vr;

      // Walls
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
        for (let i = 0; i < 4; i++) {
          createParticle(
            c.x + SIZE / 2,
            c.y + SIZE / 2
          );
        }
      }

      // Limit speed
      const speed = Math.sqrt(c.vx ** 2 + c.vy ** 2);
      const maxSpeed = 20;

      if (speed > maxSpeed) {
        c.vx = (c.vx / speed) * maxSpeed;
        c.vy = (c.vy / speed) * maxSpeed;
      }

      c.el.style.left = `${c.x}px`;
      c.el.style.top = `${c.y}px`;
      c.el.style.transform = `rotate(${c.rotation}deg)`;
    }

    animateParticles();

    requestAnimationFrame(animate);
  }

  animate();
})();
