# 🧬📊 DIVA Documentation
> DIVA (**Derived from Inference Virtual Assistant**). Полная документация по методологии data-driven microarchitecture design, семантическому майнингу PTX-трасс, генерации специализированных VLIW-ядер и адаптации под реальные LLM-нагрузки.

## 🚀 Ключевые документы
- [**Введение в DIVA**: От данных к архитектуре](index.html#/diva/general/trace-driven-architecture-evolution)
- [⚡ **Trace-Driven Design: Эволюция на основе реальных нагрузок GPU**](index.html#/wiki/trace-driven/ptx-traces-to-semantic-architecture)
- [**Полный Pipeline Оптимизации LLM**: От ONNX до Кастомных Чипов](index.html#/diva/general/full-llm-optimization-pipeline-onnx-to-custom-silicon)

## 🧩 Оптимизация дизайна AI-чипов
- [**За рамки CUDA**: WARP-V — нишевый ускоритель LLM, который исправляет недостатки архитектуры NVIDIA](index.html#/docs/blocks/warp-v-vliw-simt-evolutionary-accelerator)
- [**Семантический профайлер DIVA**: Инструмент архитектурного анализа нагрузок для AI-ускорителей](index.html#/diva/ptx2vliw/ptx-vliw-semantic-profiler)
- [⚡ **Warp Specialization для VLIW+NUMA**: Стратегия Превосходства над Nvidia Hopper и Blackwell](index.html#/diva/warp-v/warp-specialization-vliw-numa-hopper-blackwell-strategy)

## 🧮 Оптимизация моделей GigaChat
- [**Прорывное ускорение Sparse Attention и Mixed Precision для моделей GigaChat и DeepSeek**](index.html#/diva/giga/sparse-attention-mixed-precision-gigachat-deepseek)
- [**FlashAttention-5: Революция в инференсе LLM на архитектуре WARP-V и NNTile**](index.html#/diva/warp-v/chipgpt-flashattention5-warpv-nntile-roadmap)

## 🧮 Оптимизация моделей AIRI Institute
- [**NNTile**: Инфраструктура сбора трасс](index.html#/diva/airi/nntile-trace-collection-tile-centric)
- [**Стратегия тайловых акселераторов** и нишевое превосходство над GPU](index.html#/diva/airi/tile-centric-accelerators-strategy)
- [**Стратегический план для проектирования Tile-Centric чипов**](index.html#/diva/airi/nntile/trace-collection-strategy-tile-centric)
- [⚡ **Синергия HW/SW Ускорителей для Sparse Attention**: Реализация N:M Activation Sparsity на архитектуре WARP-V + XYL](index.html#/diva/airi/nm-sparsity-warp-v-xy-synergy)

<!--
- [NNTile: Семантический майнинг и кластеризация паттернов](index.html#/docs/diva/models/airi/nntile-mining)
- [NNTile: Синтез VLIW-ядра и симуляция в Accel-Sim](index.html#/docs/diva/models/airi/nntile-synthesis)


## 📊 Оптимизация моделей SBER
- [**GigaChat 3.5**: Анализ PTX-трасс и профилирование](index.html#/docs/diva/models/sber/gigachat-3.5)
- [GigaChat 3.5: Семантические паттерны и рекомендации по VLIW-конфигурации](index.html#/docs/diva/models/sber/gigachat-3.5-patterns)
- [GigaChat 3.5: Бенчмаркинг и PPA-оценка](index.html#/docs/diva/models/sber/gigachat-3.5-benchmark)


## 🧠 Оптимизация моделей DeepSeek
- [**DeepSeek-V3**: Анализ архитектурных паттернов MoE](index.html#/docs/diva/models/deepseek/ds-v3-moe-patterns)
- [DeepSeek-V3: Оптимизация маршрутизации экспертов](index.html#/docs/diva/models/deepseek/ds-v3-routing)
- [DeepSeek-V3: Сравнение с эталонным GPU (A100/H100)](index.html#/docs/diva/models/deepseek/ds-v3-comparison)

## 🔄 Оптимизация моделей Mamba
- [**Mamba**: Адаптация DIVA к State-Space Models (SSM)](index.html#/docs/diva/models/mamba/ssm-adaptation)
- [Mamba: От GEMM-паттернов к SCAN-паттернам](index.html#/docs/diva/models/mamba/pattern-shift-analysis)
- [Mamba: Переконфигурация VLIW-кластера под линейную рекуррентность](index.html#/docs/diva/models/mamba/reconfiguration)

## ⚙️ Инфраструктура и инструменты DIVA
- [**DIVA PTX Collector**: Инфраструктура сбора трасс](index.html#/docs/diva/infrastructure/ptx-collector)
- [**MLIR Semantic Pass**: Семантическая абстракция PTX→MLIR](index.html#/docs/diva/infrastructure/mlir-semantic-pass)
- [**PrefixSpan Pattern Miner**: Алгоритмы майнинга частотных паттернов](index.html#/docs/diva/infrastructure/prefixspan-miner)
- [**VLIW Core Generator**: От паттернов к Verilog/VHDL](index.html#/docs/diva/infrastructure/core-generator)

## 🧬 Методология и теория
- [**DIVA Closed-Loop Evolution**: Замкнутый цикл проектирования](index.html#/docs/diva/methodology/closed-loop)
- [**Data-Driven vs Intuition-Driven**: Сравнительный анализ подходов](index.html#/docs/diva/methodology/data-vs-intuition)
- [**Semantic Invariance**: Почему семантика важнее синтаксиса](index.html#/docs/diva/methodology/semantic-invariance)
- [**Adaptive Reconfiguration**: Адаптация к дрифту архитектурных паттернов](index.html#/docs/diva/methodology/adaptive-reconfiguration)

## 📈 Бенчмарки и верификация
- [**MERASIC × DIVA**: Пятиуровневая верификация трансляции PTX→VLIW](index.html#/docs/diva/verification/merasic-hybrid)
- [**Accel-Sim Integration**: Моделирование кастомных VLIW-ядер](index.html#/docs/diva/verification/accel-sim)
- [**FPGA Prototyping**: Результаты тестов на Xilinx VU13P](index.html#/docs/diva/verification/fpga-results)
- [**PPA Dashboard**: Energy/Area/Performance метрики для 100+ моделей](index.html#/docs/diva/verification/ppa-dashboard)


DIVA: Data-Driven Microarchitecture Evolution for AI Inference
Версия документации: 1.0 | Актуализировано: 2026-07-13
-->