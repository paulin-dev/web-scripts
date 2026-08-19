(() => {
  const cubes = [];
  const N = 30;
  const SIZE = 30;

  function randomColor() {
    return `hsl(${Math.random() * 360}, 80%, 60%)`;
  }

  for (let i = 0; i < N; i++) {
    const cube = document.createElement("div");

    Object.assign(cube.style, {
      position: "fixed",
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      left: `${Math.random() * (innerWidth - SIZE)}px`,
      top: `${Math.random() * (innerHeight - SIZE)}px`,
      background: randomColor(),
      zIndex: "999999",
      pointerEvents: "none",
      boxShadow: "0 0 10px rgba(0,0,0,.3)",
    });

    document.body.appendChild(cube);

    cubes.push({
      el: cube,
      x: parseFloat(cube.style.left),
      y: parseFloat(cube.style.top),
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

      let hitEdge = false;

      if (c.x <= 0) {
        c.x = 0;
        c.vx *= -1;
        hitEdge = true;
      } else if (c.x >= innerWidth - SIZE) {
        c.x = innerWidth - SIZE;
        c.vx *= -1;
        hitEdge = true;
      }

      if (c.y <= 0) {
        c.y = 0;
        c.vy *= -1;
        hitEdge = true;
      } else if (c.y >= innerHeight - SIZE) {
        c.y = innerHeight - SIZE;
        c.vy *= -1;
        hitEdge = true;
      }

      if (hitEdge) {
        c.el.style.background = randomColor();
      }

      c.el.style.left = `${c.x}px`;
      c.el.style.top = `${c.y}px`;
      c.el.style.transform = `rotate(${c.rotation}deg)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
