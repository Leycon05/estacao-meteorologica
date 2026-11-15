# Dashboard da Estação Meteorológica (ESP32)

Painel web responsivo para monitoramento ambiental em tempo real de uma estação meteorológica baseada no microcontrolador **ESP32**. A aplicação consome dados telemétricos validados de uma API REST em Python hospedada no Render e apresenta leituras atuais, estatísticas do período, gráficos históricos interativos e georreferenciamento.

## Sensores e Grandezas Monitoradas

| Sensor | Grandeza | Unidade | Descrição |
| :--- | :--- | :---: | :--- |
| **DHT22** | Temperatura do ar | `°C` | Medição térmica digital do ambiente |
| **DHT22** | Umidade relativa | `%` | Percentual de umidade com barra de nível visual |
| **BMP280** | Pressão atmosférica | `hPa` | Leitura barométrica via barramento I2C |
| **LDR** | Luz ambiente | `ADC` | Resposta analógica da luminosidade incidente |
| **MQ-135** | Qualidade do ar | `ADC` | Indicador relativo da concentração de gases |

## Funcionalidades

- **Telemetria em Tempo Real:** Atualização automática a cada 60 segundos e botão para atualização sob demanda.
- **Gráficos Históricos Interativos:** Visualização temporal via *Chart.js* com alternância dinâmica entre os 5 parâmetros dos sensores e períodos (`24 h`, `7 dias` e `30 dias`).
- **Resumo Estatístico:** Cálculo automático de leituras válidas, média, mínima e máxima para o sensor e período selecionados.
- **Integridade dos Dados:** Contabilização e filtragem de registros inválidos ou descartados pela camada de validação da API.
- **Georreferenciamento:** Renderização dinâmica de mapa interativo (*OpenStreetMap*) quando as coordenadas da estação são fornecidas pelo backend.
- **Modo Offline / Demonstração:** Suporte nativo a dados simulados (`mock`) para testes locais sem dependência de conexão com o servidor.

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (Grid/Flexbox responsivo) e JavaScript (ES6+ modular)
- **Visualização e Ícones:** [Chart.js](https://www.chartjs.org/) e [Lucide Icons](https://lucide.dev/)
- **Hardware:** Microcontrolador ESP32 + sensores DHT22, BMP280, LDR e MQ-135

## Estrutura de Pastas

```text
dashboard-estacao-meteorologica/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── api.js
│   ├── charts.js
│   ├── dashboard.js
│   └── mock-data.js
└── assets/
    ├── icons/
    └── images/
