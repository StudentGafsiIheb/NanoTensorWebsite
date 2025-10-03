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

	// Blackhole animation
	const blackholeCanvas = document.getElementById('blackhole');
	if (!blackholeCanvas) return;
	const blackholeCtx = blackholeCanvas.getContext('2d');
	let blackholeWidth = 0, blackholeHeight = 0;

	function resizeBlackhole() {
		blackholeWidth = blackholeCanvas.clientWidth;
		blackholeHeight = blackholeCanvas.clientHeight;
		blackholeCanvas.width = Math.floor(blackholeWidth * dpr);
		blackholeCanvas.height = Math.floor(blackholeHeight * dpr);
		blackholeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	const blackhole = {
		x: 0,
		y: 0,
		radius: 0,
		accretionDisk: [],
		particles: [],
		time: 0
	};

	function initBlackhole() {
		resizeBlackhole();
		blackhole.x = blackholeWidth * 0.7;
		blackhole.y = blackholeHeight * 0.3;
		blackhole.radius = Math.min(blackholeWidth, blackholeHeight) * 0.08;
		
		// Initialize accretion disk
		blackhole.accretionDisk = [];
		for (let i = 0; i < 3; i++) {
			blackhole.accretionDisk.push({
				radius: blackhole.radius * (2 + i * 0.5),
				angle: Math.random() * Math.PI * 2,
				speed: 0.02 + i * 0.01,
				opacity: 0.6 - i * 0.15
			});
		}

		// Initialize particles
		blackhole.particles = [];
		for (let i = 0; i < 50; i++) {
			blackhole.particles.push({
				x: blackhole.x + (Math.random() - 0.5) * blackholeWidth * 0.8,
				y: blackhole.y + (Math.random() - 0.5) * blackholeHeight * 0.8,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				life: Math.random(),
				size: Math.random() * 2 + 1
			});
		}
	}

	function updateBlackhole() {
		blackhole.time += 0.016;

		// Update accretion disk
		blackhole.accretionDisk.forEach(ring => {
			ring.angle += ring.speed;
		});

		// Update particles
		blackhole.particles.forEach(particle => {
			// Gravitational pull towards blackhole
			const dx = blackhole.x - particle.x;
			const dy = blackhole.y - particle.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			if (distance > blackhole.radius * 3) {
				const force = 0.01 / (distance * distance);
				particle.vx += (dx / distance) * force;
				particle.vy += (dy / distance) * force;
			}

			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.life -= 0.005;

			// Reset particle if it's consumed or dead
			if (particle.life <= 0 || distance < blackhole.radius) {
				particle.x = blackhole.x + (Math.random() - 0.5) * blackholeWidth * 0.8;
				particle.y = blackhole.y + (Math.random() - 0.5) * blackholeHeight * 0.8;
				particle.vx = (Math.random() - 0.5) * 0.5;
				particle.vy = (Math.random() - 0.5) * 0.5;
				particle.life = 1;
			}
		});
	}

	function drawBlackhole() {
		blackholeCtx.clearRect(0, 0, blackholeWidth, blackholeHeight);

		// Draw accretion disk
		blackhole.accretionDisk.forEach(ring => {
			blackholeCtx.save();
			blackholeCtx.translate(blackhole.x, blackhole.y);
			blackholeCtx.rotate(ring.angle);
			
			blackholeCtx.strokeStyle = `rgba(37, 99, 235, ${ring.opacity})`;
			blackholeCtx.lineWidth = 2;
			blackholeCtx.beginPath();
			blackholeCtx.arc(0, 0, ring.radius, 0, Math.PI * 2);
			blackholeCtx.stroke();
			
			blackholeCtx.restore();
		});

		// Draw particles
		blackhole.particles.forEach(particle => {
			blackholeCtx.save();
			blackholeCtx.globalAlpha = particle.life;
			blackholeCtx.fillStyle = `hsl(${200 + particle.life * 60}, 70%, 60%)`;
			blackholeCtx.beginPath();
			blackholeCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
			blackholeCtx.fill();
			blackholeCtx.restore();
		});

		// Draw blackhole
		const gradient = blackholeCtx.createRadialGradient(
			blackhole.x, blackhole.y, 0,
			blackhole.x, blackhole.y, blackhole.radius
		);
		gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
		gradient.addColorStop(0.7, 'rgba(20, 20, 40, 0.8)');
		gradient.addColorStop(1, 'rgba(37, 99, 235, 0.3)');

		blackholeCtx.fillStyle = gradient;
		blackholeCtx.beginPath();
		blackholeCtx.arc(blackhole.x, blackhole.y, blackhole.radius, 0, Math.PI * 2);
		blackholeCtx.fill();

		// Event horizon effect
		blackholeCtx.strokeStyle = 'rgba(37, 99, 235, 0.6)';
		blackholeCtx.lineWidth = 1;
		blackholeCtx.beginPath();
		blackholeCtx.arc(blackhole.x, blackhole.y, blackhole.radius * 0.8, 0, Math.PI * 2);
		blackholeCtx.stroke();
	}

	function blackholeLoop() {
		updateBlackhole();
		drawBlackhole();
		requestAnimationFrame(blackholeLoop);
	}

	window.addEventListener('resize', resizeBlackhole);
	initBlackhole();
	blackholeLoop();

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

	// Beautiful animated charts
	function createAnimatedChart(canvasId, chartType, data, options = {}) {
		const canvas = document.getElementById(canvasId);
		if (!canvas || !canvas.getContext) return;
		
		const ctx = canvas.getContext('2d');
		const W = canvas.width;
		const H = canvas.height;
		const padding = 40;
		const chartWidth = W - 2 * padding;
		const chartHeight = H - 2 * padding;
		
		let animationFrame = 0;
		const maxFrames = 120;
		
		function drawChart(progress) {
			ctx.clearRect(0, 0, W, H);
			
			// Grid
			ctx.strokeStyle = 'rgba(0,0,0,0.1)';
			ctx.lineWidth = 1;
			for (let x = padding; x <= W - padding; x += 40) {
				ctx.beginPath();
				ctx.moveTo(x, padding);
				ctx.lineTo(x, H - padding);
				ctx.stroke();
			}
			for (let y = padding; y <= H - padding; y += 40) {
				ctx.beginPath();
				ctx.moveTo(padding, y);
				ctx.lineTo(W - padding, y);
				ctx.stroke();
			}
			
			// Axes
			ctx.strokeStyle = 'rgba(0,0,0,0.6)';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(padding, H - padding);
			ctx.lineTo(W - padding, H - padding);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(padding, H - padding);
			ctx.lineTo(padding, padding);
			ctx.stroke();
			
			// Chart content based on type
			if (chartType === 'line') {
				drawLineChart(ctx, data, padding, chartWidth, chartHeight, progress);
			} else if (chartType === 'bar') {
				drawBarChart(ctx, data, padding, chartWidth, chartHeight, progress);
			} else if (chartType === 'scatter') {
				drawScatterChart(ctx, data, padding, chartWidth, chartHeight, progress);
			}
		}
		
		function drawLineChart(ctx, data, padding, width, height, progress) {
			ctx.strokeStyle = '#2563eb';
			ctx.lineWidth = 3;
			ctx.beginPath();
			
			const points = data.map((value, i) => ({
				x: padding + (i / (data.length - 1)) * width,
				y: padding + height - (value * progress) * height
			}));
			
			points.forEach((point, i) => {
				if (i === 0) {
					ctx.moveTo(point.x, point.y);
				} else {
					ctx.lineTo(point.x, point.y);
				}
			});
			ctx.stroke();
			
			// Data points
			ctx.fillStyle = '#2563eb';
			points.forEach(point => {
				ctx.beginPath();
				ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
				ctx.fill();
			});
		}
		
		function drawBarChart(ctx, data, padding, width, height, progress) {
			const barWidth = width / data.length * 0.8;
			const barSpacing = width / data.length * 0.2;
			
			data.forEach((value, i) => {
				const barHeight = (value * progress) * height;
				const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
				const y = padding + height - barHeight;
				
				// Gradient fill
				const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
				gradient.addColorStop(0, '#2563eb');
				gradient.addColorStop(1, '#7c3aed');
				
				ctx.fillStyle = gradient;
				ctx.fillRect(x, y, barWidth, barHeight);
				
				// Bar border
				ctx.strokeStyle = 'rgba(37,99,235,0.3)';
				ctx.lineWidth = 1;
				ctx.strokeRect(x, y, barWidth, barHeight);
			});
		}
		
		function drawScatterChart(ctx, data, padding, width, height, progress) {
			data.forEach(point => {
				const x = padding + point.x * width;
				const y = padding + height - point.y * height;
				const alpha = Math.min(1, progress * 2);
				
				ctx.save();
				ctx.globalAlpha = alpha;
				ctx.fillStyle = `hsl(${200 + point.y * 60}, 70%, 60%)`;
				ctx.beginPath();
				ctx.arc(x, y, 6, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();
			});
		}
		
		function animate() {
			animationFrame++;
			const progress = Math.min(1, animationFrame / maxFrames);
			drawChart(progress);
			
			if (animationFrame < maxFrames) {
				requestAnimationFrame(animate);
			}
		}
		
		// Start animation when in viewport
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && animationFrame === 0) {
					animate();
				}
			});
		});
		observer.observe(canvas);
	}
	
	// Initialize charts when page loads
	window.addEventListener('load', () => {
		// Learning dynamics chart (line chart)
		const learningData = [0.8, 0.6, 0.45, 0.35, 0.28, 0.22, 0.18, 0.15, 0.12, 0.1, 0.08, 0.07, 0.06, 0.05, 0.045, 0.04, 0.038, 0.036, 0.035, 0.034];
		createAnimatedChart('learningChart', 'line', learningData);
		
		// Scaling laws chart (scatter plot)
		const scalingData = [
			{x: 0.1, y: 0.2}, {x: 0.2, y: 0.35}, {x: 0.3, y: 0.45}, {x: 0.4, y: 0.55},
			{x: 0.5, y: 0.62}, {x: 0.6, y: 0.68}, {x: 0.7, y: 0.73}, {x: 0.8, y: 0.77},
			{x: 0.9, y: 0.8}, {x: 1.0, y: 0.82}
		];
		createAnimatedChart('scalingChart', 'scatter', scalingData);
		
		// Emergent capabilities chart (bar chart)
		const capabilitiesData = [0.2, 0.4, 0.6, 0.75, 0.85, 0.9, 0.92, 0.94, 0.95, 0.96];
		createAnimatedChart('capabilitiesChart', 'bar', capabilitiesData);
	});
})();

