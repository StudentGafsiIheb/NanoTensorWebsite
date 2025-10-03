(function() {
	const canvas = document.getElementById('field');
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

	const nodes = [];
	const LINKS = 180;
	const SPEED = 0.2;

	function resize() {
		width = canvas.clientWidth;
		height = canvas.clientHeight;
		canvas.width = Math.floor(width * dpr);
		canvas.height = Math.floor(height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	function init() {
		resize();
		nodes.length = 0;
		const count = Math.floor((width * height) / 14000);
		for (let i = 0; i < count; i++) {
			nodes.push({
				x: Math.random() * width,
				y: Math.random() * height,
				vx: (Math.random() - 0.5) * SPEED,
				vy: (Math.random() - 0.5) * SPEED
			});
		}
	}

	function step() {
		for (const p of nodes) {
			p.x += p.vx;
			p.y += p.vy;
			if (p.x < 0 || p.x > width) p.vx *= -1;
			if (p.y < 0 || p.y > height) p.vy *= -1;
		}
	}

	function draw() {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = 'rgba(108,224,255,0.6)';
		for (const p of nodes) ctx.fillRect(p.x, p.y, 2, 2);

		ctx.strokeStyle = 'rgba(138,125,255,0.18)';
		ctx.lineWidth = 1;
		let drawn = 0;
		for (let i = 0; i < nodes.length && drawn < LINKS; i++) {
			for (let j = i + 1; j < nodes.length && drawn < LINKS; j++) {
				const a = nodes[i], b = nodes[j];
				const dx = a.x - b.x, dy = a.y - b.y;
				const d2 = dx*dx + dy*dy;
				if (d2 < 160*160) {
					ctx.globalAlpha = Math.max(0.05, 1 - d2 / (160*160));
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();
					ctx.globalAlpha = 1;
					drawn++;
				}
			}
		}
	}

	function loop() {
		step();
		draw();
		requestAnimationFrame(loop);
	}

	window.addEventListener('resize', () => { resize(); init(); });
	init();
	loop();

	// Footer year
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// Homepage counters and chart (progressive enhancement)
(function() {
	function inViewport(el) {
		const r = el.getBoundingClientRect();
		return r.top < window.innerHeight && r.bottom > 0;
	}

	const counters = Array.from(document.querySelectorAll('.counter'));
	let countersStarted = false;

	function startCounters() {
		if (countersStarted) return;
		if (!counters.length) return;
		if (!inViewport(counters[0].closest('.section'))) return;
		countersStarted = true;
		counters.forEach(el => {
			const target = Number(el.getAttribute('data-target') || '0');
			let val = 0;
			const step = Math.max(1, Math.floor(target / 60));
			const iv = setInterval(() => {
				val += step;
				if (val >= target) { val = target; clearInterval(iv); }
				el.textContent = String(val);
			}, 16);
		});
	}

	window.addEventListener('scroll', startCounters, { passive: true });
	window.addEventListener('load', startCounters);

	// Tiny chart without dependencies
	const chart = document.getElementById('scalingChart');
	if (chart && chart.getContext) {
		const c = chart.getContext('2d');
		const W = chart.width, H = chart.height;
		c.clearRect(0, 0, W, H);
		c.strokeStyle = 'rgba(0,0,0,0.2)';
		c.lineWidth = 1;
		for (let x = 60; x < W; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
		for (let y = 60; y < H; y += 60) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }

		// Axes
		c.strokeStyle = 'rgba(0,0,0,0.6)';
		c.lineWidth = 2;
		c.beginPath(); c.moveTo(40, H-40); c.lineTo(W-20, H-40); c.stroke();
		c.beginPath(); c.moveTo(40, H-40); c.lineTo(40, 20); c.stroke();

		// Fake data: y = a * x^{-b} + noise
		const a = 380, b = 0.35;
		c.strokeStyle = '#2563eb';
		c.lineWidth = 3;
		c.beginPath();
		for (let i = 0; i <= 20; i++) {
			const x = 40 + (i / 20) * (W - 60);
			const xv = i + 1;
			const yv = a * Math.pow(xv, -b) + (Math.random() - 0.5) * 8 + 40;
			const y = Math.max(20, Math.min(H - 40, yv));
			if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
		}
		c.stroke();
	}
})();

