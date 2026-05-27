# 📚 ChipGPT Wiki

> Полная документация по архитектуре, эволюции ядер и агентным пайплайнам.

## 🔬 Концепция и парадигма
- [Парадигма эволюционного дизайна чипов](index.html#/wiki/evolutionary-paradigm)
- [DSE vs Evolution: Сравнительный анализ](index.html#/wiki/dse-vs-evolution)
- [🔄 Эволюция VLIW → Groq: Dataflow, SRAM и детерминированный TSP](index.html#/wiki/evolution/vliw-to-groq-dataflow-tsp)
- [🔄 Эволюция VLIW → SIMT и план перехода к GPU](index.html#/wiki/architecture/vliw-to-simt-evolution)
- [🔄 Эволюция Warp Scheduler: От VLIW к интеллектуальному SIMT](index.html#/wiki/evolution/vliw-to-warp-scheduler)
- [🔄 Эволюция VLIW → TPU и план перехода к тензорным ядрам](index.html#/wiki/architecture/vliw-to-tpu-evolution)
- [🔄 Эволюция VLIW → MPPA: Архитектурный подход Kalray и массово-параллельные DPU](index.html#/wiki/evolution/vliw-to-mppa-kalray-evolution)
- [⚡ Практика ChipGPT: Оптимизация CNN и механизмов внимания](index.html#/wiki/examples/optimizing-vliw-instructions-evolution)
- [⚡ Практика ChipGPT: KV Cache-Ускоритель. Гибридный сопроцессор и расширение ISA](index.html#/wiki/examples/vliw-to-kv-cache-accelerator-isa)

## 🧠 Инструменты и агенты
- [RAG в эволюционном дизайне](index.html#/wiki/rag-chip-design)
- [Агентное проектирование: ADL + LLM + EA](index.html#/wiki/agent-pipeline)

## 🔄 Стратегия ко-эволюции SW: Компилятор, ISA и GRPO
- [🤖 Автогенерация ассемблера VLIWGPT и GRPO-супероптимизация](index.html#/wiki/sw-evolution/llm-grpo-vliwgpt-assembly)

## 🛠 Адаптация компилятора и тулчейна
- [Гибридная адаптация LLVM-бэкенда под VLIW](index.html#/wiki/compiler/llvm-vliw-hybrid-evolution)

## 🌐 Инфраструктура eSW и многоуровневый IR
- [Генерация MLIR-слоя и эволюция eSW для VLIW](index.html#/wiki/compiler/mlir-vliw-ir-generation)

## 🔍 Симуляция и оптимизация PPA
- [Декларативный ISS: Основа AI-эволюции процессоров](index.html#/wiki/simulation/iss-declarative-architecture-grpo)
- [⚡ Параметрическая энергомодель VLIW для GRPO](index.html#/wiki/simulation/vliw-energy-model-grpo)
- [Многоуровневая симуляция для GRPO: Интеграция ISS и RTL](index.html#/wiki/simulation/grpo-multi-level-ppa-reward)
- [Многоядерный ISS: Глобальный GRPO для GPU-эмуляции](index.html#/wiki/simulation/multicore-iss-event-driven-grpo)

## 📊 MERASIC: Бенчмарки и система верификации
- [MERASIC: Методология гибридной верификации RTL на базе Renode Co-Simulation](index.html#/wiki/merasic/renode-vliw-cosimulation-rtl-verification)

## ⚙️ Платформы и реализации
- [Платформа VLIWGPT: VLIW-ядро коммерческого уровня на базе r-VEX](index.html#/wiki/platforms/vliwgpt-rvex-platform)
- [Отладка eSW в Renode: интеграция VLIW и GRPO-петля](index.html#/wiki/debugging/renode-vliw-grpo)
- [VLIWGPT ISS: Детерминированная симуляция конвейера Эпохи 1](index.html#/wiki/simulation/vliwgpt-iss-epoch1-pipeline)
