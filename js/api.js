(() => {
	const apiBase = document.querySelector('meta[name="api-base"]')?.content || '/api';

	const getJson = async (url) => {
		const response = await fetch(url, { headers: { Accept: 'application/json' } });
		if (!response.ok) throw new Error(`API indisponível (${response.status}).`);
		return response.json();
	};

	const normalizeReading = (item) => {
		const rawValid = item.valida ?? item.valido ?? item.valid ?? true;
		const isValid = rawValid !== false && rawValid !== 0;

		return {
			estacao: item.estacao ?? item.id_estacao ?? 1,
			timestamp: item.timestamp ?? item.data_hora ?? item.created_at ?? item.data ?? null,
			temperatura: item.temperatura ?? item.temp ?? null,
			umidade: item.umidade ?? item.humidade ?? null,
			pressao: item.pressao ?? item.pressao_atmosferica ?? null,
			luz_adc: item.luz_adc ?? item.luminosidade ?? item.radiacao_solar ?? item.ldr ?? null,
			mq135_adc: item.mq135_adc ?? item.qualidade_ar ?? item.gas ?? item.mq135 ?? null,
			mq135_alerta: Boolean(item.mq135_alerta),
			latitude: item.latitude ?? item.lat ?? null,
			longitude: item.longitude ?? item.lng ?? item.lon ?? null,
			valida: isValid,
		};
	};

	const fetchDashboard = async (stationId, period) => {
		const payload = await getJson(`${apiBase}/telemetria/ultimas`);

		if (payload && !Array.isArray(payload) && (payload.historico || payload.ultima_leitura)) {
			return {
				...payload,
				modo: 'producao',
			};
		}

		const rawList = Array.isArray(payload)
			? payload
			: payload?.ultimas || payload?.leituras || payload?.dados || payload?.data || [];

		const historico = rawList
			.map(normalizeReading)
			.sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));

		const leiturasValidas = historico.filter((r) => r.valida !== false);
		const ultimaLeitura = leiturasValidas.at(-1) || {};
		const stationInfo = payload?.estacao || {};

		const latitude =
			stationInfo.latitude ?? stationInfo.lat ??
			payload?.latitude ?? payload?.lat ??
			ultimaLeitura.latitude ?? null;

		const longitude =
			stationInfo.longitude ?? stationInfo.lng ?? stationInfo.lon ??
			payload?.longitude ?? payload?.lng ?? payload?.lon ??
			ultimaLeitura.longitude ?? null;

		return {
			modo: 'producao',
			estacao: {
				id: stationInfo.id ?? stationId ?? '01',
				nome: stationInfo.nome ?? 'Estação 01',
				localizacao: stationInfo.localizacao ?? 'ESP32 · Telemetria em tempo real',
				latitude,
				longitude,
			},
			ultima_leitura: ultimaLeitura,
			historico,
			unidades: {
				temperatura: '°C',
				umidade: '%',
				pressao: 'hPa',
				luz_adc: 'ADC',
				mq135_adc: 'ADC',
			},
			resumo: {
				leituras_validas: leiturasValidas.length,
				leituras_rejeitadas: historico.length - leiturasValidas.length,
			},
		};
	};

	window.WeatherAPI = { fetchDashboard };
})();