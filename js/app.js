(() => {
	const stationId = document.querySelector('meta[name="station-id"]')?.content || '1';
	const dataMode = document.querySelector('meta[name="data-mode"]')?.content || 'mock';
	let activePeriod = '24h';

	const loadWeather = async () => {
		WeatherDashboard.setLoading(true);
		WeatherDashboard.hideNotice();
		try {
			const dashboard = dataMode === 'mock'
				? await MockWeatherData.fetchDashboard(activePeriod)
				: await WeatherAPI.fetchDashboard(stationId, activePeriod);
			WeatherDashboard.renderDashboard(dashboard);
		} catch (error) {
			WeatherDashboard.showNotice(`${error.message || 'Não foi possível carregar as leituras.'} Verifique se o backend Python está em execução.`);
		} finally {
			WeatherDashboard.setLoading(false);
		}
	};

	document.getElementById('refresh-button').addEventListener('click', loadWeather);
	document.getElementById('retry-button').addEventListener('click', loadWeather);

	document.querySelectorAll('[data-metric]').forEach((button) => {
		button.addEventListener('click', () => {
			document.querySelectorAll('[data-metric]').forEach((segment) => {
				const selected = segment === button;
				segment.classList.toggle('is-active', selected);
				segment.setAttribute('aria-pressed', String(selected));
			});
			WeatherDashboard.setMetric(button.dataset.metric);
		});
	});

	document.querySelectorAll('[data-period]').forEach((button) => {
		button.addEventListener('click', () => {
			activePeriod = button.dataset.period;
			document.querySelectorAll('[data-period]').forEach((segment) => {
				const selected = segment === button;
				segment.classList.toggle('is-active', selected);
				segment.setAttribute('aria-pressed', String(selected));
			});
			loadWeather();
		});
	});

	/* Controle de ampliação dos cards ao clicar */
	let activeCard = null;
	let placeholder = null;
	let backdrop = null;

	const closeExpandedCard = () => {
		if (!activeCard) return;

		activeCard.classList.remove('is-expanded');
		activeCard.querySelector('.card-close-btn')?.remove();

		if (placeholder && placeholder.parentNode) {
			placeholder.parentNode.replaceChild(activeCard, placeholder);
		}

		if (backdrop) {
			backdrop.classList.remove('is-visible');
			const ref = backdrop;
			setTimeout(() => ref.remove(), 220);
		}

		document.body.style.overflow = '';
		activeCard = null;
		placeholder = null;
		backdrop = null;

		window.dispatchEvent(new Event('resize'));
	};

	const openExpandedCard = (card) => {
		if (activeCard) closeExpandedCard();

		const rect = card.getBoundingClientRect();
		placeholder = document.createElement('div');
		placeholder.style.height = `${rect.height}px`;
		placeholder.style.visibility = 'hidden';

		backdrop = document.createElement('div');
		backdrop.className = 'card-backdrop';
		backdrop.addEventListener('click', closeExpandedCard);

		const closeBtn = document.createElement('button');
		closeBtn.type = 'button';
		closeBtn.className = 'card-close-btn';
		closeBtn.setAttribute('aria-label', 'Fechar visualização ampliada');
		closeBtn.innerHTML = '&times;';
		closeBtn.addEventListener('click', (event) => {
			event.stopPropagation();
			closeExpandedCard();
		});

		card.parentNode.insertBefore(placeholder, card);
		document.body.append(backdrop, card);
		card.appendChild(closeBtn);
		card.classList.add('is-expanded');
		document.body.style.overflow = 'hidden';

		requestAnimationFrame(() => backdrop?.classList.add('is-visible'));
		activeCard = card;

		window.dispatchEvent(new Event('resize'));
	};

	document.addEventListener('click', (event) => {
		if (event.target.closest('button, a, input, select, iframe')) return;

		const card = event.target.closest('.panel');
		if (!card || card.classList.contains('is-expanded')) return;

		openExpandedCard(card);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') closeExpandedCard();
	});

	loadWeather();
	window.setInterval(loadWeather, 60_000);
})();