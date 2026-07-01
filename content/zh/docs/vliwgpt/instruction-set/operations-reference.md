# VLIWGPT Instruction Set Architecture: Справочник операций

Данный документ содержит полный перечень операций ядра VLIWGPT. Каждая инструкция описана согласно архитектуре VLIW: семантика, функциональное назначение, аппаратные ограничения и возможные исключения. Для наглядности добавлены схемы потоков данных.

## 📖 Формат описания
Каждая операция представлена в стандартизированном виде:
- **Название:** `Мнемоника [Вариант кодирования операндов]`
- **Semantics:** Формальное описание поведения (на нотационном языке ISA)
- **Description:** Словесное описание действия
- **Restrictions:** Аппаратные и pipeline-ограничения
- **Exceptions:** Типы прерываний/трапов, которые может сгенерировать инструкция
- **Visualization:** Схема выполнения (Mermaid)

---

### `add Register`
**Semantics:**
```
operand1 ← SignExtend32(RSRC1);
operand2 ← SignExtend32(RSRC2);
result1 ← operand1 + operand2;
RDEST ← Register(result1);
```
**Description:** Сложение двух регистровых операндов со знаком. Результат записывается в целевой регистр общего назначения.
**Restrictions:** Нет ограничений по адресации/бандлам. Нет задержек конвейера (latency = 1 цикл).
**Exceptions:** Нет.

```mermaid
flowchart LR
  RSRC1 -->|SignExtend32| OP1
  RSRC2 -->|SignExtend32| OP2
  OP1 -->|+| ADD
  OP2 -->|+| ADD
  ADD -->|Register| RDEST
```
---

### `add Immediate`
**Semantics:**
```
operand1 ← SignExtend32(RSRC1);
operand2 ← SignExtend32(Imm(ISRC2));
result1 ← operand1 + operand2;
RIDEST ← Register(result1);
```
**Description:** Сложение регистрового операнда и знакового немедленного значения (с поддержкой расширенных immediate через `imml`/`immr`).
**Restrictions:** Нет ограничений. Latency = 1 цикл.
**Exceptions:** Нет.

```mermaid
flowchart LR
  RSRC1 -->|SignExtend32| OP1
  ISRC2 -->|Imm| OP2
  OP1 -->|+| ADD
  OP2 -->|+| ADD
  ADD -->|Register| RIDEST
```
---

### `addcg`
**Semantics:**
```
operand1 ← ZeroExtend32(RSRC1);
operand2 ← ZeroExtend32(RSRC2);
operand3 ← ZeroExtend1(BSCOND);
result1 ← (operand1 + operand2) + operand3;
result2 ← Bit(result1, 32);
RDEST ← Register(result1);
BBDEST ← Bit(result2);
```
**Description:** Сложение с переносом (carry) и генерацией флага переноса в битовый регистр.
**Restrictions:** Нет ограничений. Latency = 1 цикл.
**Exceptions:** Нет.

```mermaid
flowchart LR
  RSRC1 --> ZE32 --> OP1
  RSRC2 --> ZE32 --> OP2
  BSCOND --> ZE1 --> OP3
  OP1 & OP2 & OP3 -->|+| ADD
  ADD -->|Bit32| BBDEST
  ADD -->|Register| RDEST
```
---

### `and Register`
**Semantics:** `operand1 ← SignExtend32(RSRC1); operand2 ← SignExtend32(RSRC2); result1 ← operand1 ∧ operand2; RDEST ← Register(result1);`
**Description:** Побитовое И над регистровыми операндами.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `and Immediate`
**Semantics:** `operand1 ← SignExtend32(RSRC1); operand2 ← SignExtend32(Imm(ISRC2)); result1 ← operand1 ∧ operand2; RIDEST ← Register(result1);`
**Description:** Побитовое И регистра и немедленного значения.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `andc Register`
**Semantics:** `operand1 ← SignExtend32(RSRC1); operand2 ← SignExtend32(RSRC2); result1 ← (~operand1) ∧ operand2; RDEST ← Register(result1);`
**Description:** Инверсия первого операнда, затем побитовое И со вторым.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `andc Immediate`
**Semantics:** `operand1 ← SignExtend32(RSRC1); operand2 ← SignExtend32(Imm(ISRC2)); result1 ← (~operand1) ∧ operand2; RIDEST ← Register(result1);`
**Description:** Инверсия регистра, побитовое И с immediate.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `andl Register-Register`
**Semantics:** `operand1 ← SignExtend32(RSRC1); operand2 ← SignExtend32(RSRC2); result1 ← (operand1 ≠ 0) AND (operand2 ≠ 0); RDEST ← Register(result1);`
**Description:** Логическое И (результат 1, если оба операнда не равны нулю).
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `andl Branch Register-Register`
**Semantics:** `... result1 ← (operand1 ≠ 0) AND (operand2 ≠ 0); BBDEST ← Bit(result1);`
**Description:** Логическое И, результат записывается в битовый регистр ветвления.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `andl Register-Immediate`
**Semantics:** `operand1 ← SignExtend32(RSRC1); operand2 ← SignExtend32(Imm(ISRC2)); result1 ← (operand1 ≠ 0) AND (operand2 ≠ 0); RIDEST ← Register(result1);`
**Description:** Логическое И регистра и immediate.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `andl Branch Register-Immediate`
**Semantics:** `... result1 ← (operand1 ≠ 0) AND (operand2 ≠ 0); BIBDEST ← Bit(result1);`
**Description:** Логическое И, результат в битовый регистр.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `br`
**Semantics:** `operand1 ← ZeroExtend1(BBCOND); operand2 ← SignExtend23(BTARG) << 2; IF(operand1 ≠ 0) PC ← Register(ZeroExtend32(BUNDLE_PC) + operand2);`
**Description:** Условный переход по битовому регистру. Смещение умножается на 4 (выравнивание слов).
**Restrictions:** Должна быть первой операцией (syllable) в бандле. Задержка 2 бандла между записью в `BBCOND` и выполнением.
**Exceptions:** Нет.

```mermaid
flowchart LR
  BBCOND -->|ZeroExtend1| COND
  BTARG -->|<<2| OFFSET
  COND -->|IF≠0?| CHECK
  BUNDLE_PC -->|+| CHECK
  OFFSET -->|+| CHECK
  CHECK -->|True| PC
```
---

### `break`
**Semantics:** `THROW ILL_INST;`
**Description:** Программный брейкпоинт (генерирует исключение нелегальной инструкции для отладки).
**Restrictions:** Без ограничений.
**Exceptions:** `ILL_INST`

---

### `brf`
**Semantics:** `operand1 ← ZeroExtend1(BBCOND); operand2 ← SignExtend23(BTARG) << 2; IF(operand1 = 0) PC ← Register(ZeroExtend32(BUNDLE_PC) + operand2);`
**Description:** Условный переход, если битовый регистр равен 0 (Branch False).
**Restrictions:** Первая операция в бандле. Latency = 2 бандла для условия.
**Exceptions:** Нет.

```mermaid
flowchart TD
  BBCOND -->|ZeroExtend1| COND
  BTARG -->|SignExtend23 & << 2| OFFSET
  COND -->|IF = 0?| DECIDE
  OFFSET --> DECIDE
  BUNDLE_PC --> DECIDE
  DECIDE -->|Условие ложно True| PC_UPDATE[PC ← Register ZeroExtend32 BUNDLE_PC + OFFSET]
  DECIDE -->|Условие истинно False| NEXT[PC ← BUNDLE_PC + BundleSize]
```
---

### `bswap`
**Semantics:** Извлекает байты 0..3, меняет порядок (0↔3, 1↔2), собирает обратно в 32-битное слово.
**Description:** Обмен порядка байтов (Big/Little Endian swap).
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `call Immediate`
**Semantics:** `operand1 ← SignExtend23(BTARG) << 2; NEXT_PC ← PC; PC ← Register(ZeroExtend32(BUNDLE_PC) + operand1); LR ← NEXT_PC;`
**Description:** Вызов подпрограммы с переходом по immediate и сохранением адреса возврата в Link Register (`$r63`).
**Restrictions:** Первая в бандле. Без latency.
**Exceptions:** Нет.

```mermaid
flowchart TD
  Start(["call Immediate"]) --> SignExt["operand1 ← SignExtend23(BTARG) << 2"]
  SignExt --> SaveRet["NEXT_PC ← PC\n(Save return address)"]
  SaveRet --> CalcTarget["PC ← Register(ZeroExtend32(BUNDLE_PC) + operand1)"]
  CalcTarget --> UpdateLR["LR ← NEXT_PC"]
  UpdateLR --> End(["Resume Execution at Target Address"])

  subgraph Restrictions ["VLIW Restrictions"]
    R1["Must be 1st syllable in bundle"]
    R2["No latency constraints"]
    R3["Updates Link Register ($r63)"]
  end
  Restrictions -.-> UpdateLR
```
---

### `call Link Register`
**Semantics:** `NEXT_PC ← PC; PC ← Register(ZeroExtend32(LR)); LR ← NEXT_PC;`
**Description:** Косвенный вызов через Link Register.
**Restrictions:** Первая в бандле. Требуется задержка 2 бандла после последней записи в `LR` (кроме предыдущего `call`).
**Exceptions:** Нет.

```mermaid
flowchart TD
  Start(["call $r63=$r63"]) --> SavePC["NEXT_PC ← PC\n(Save current bundle PC)"]
  SavePC --> FetchTarget["PC ← Register(ZeroExtend32(LR))\n(Fetch target address from LR)"]
  FetchTarget --> UpdateLR["LR ← NEXT_PC\n(Store return address in LR)"]
  UpdateLR --> End(["Resume Execution at Target Address"])

  subgraph Restrictions ["VLIW & Latency Restrictions"]
    R1["Must be 1st syllable in bundle"]
    R2["Latency: 2 bundles after LR write (except call)"]
    R3["No latency constraint if LR written by previous call"]
  end
  Restrictions -.-> FetchTarget

  classDef proc fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#000;
  classDef success fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#000;
  class Start,End success;
  class SavePC,FetchTarget,UpdateLR proc;
  class R1,R2,R3 proc;
```
---

### `clz`
**Semantics:** `operand1 ← ZeroExtend32(RSRC1); result1 ← CountLeadingZeros(operand1); RIDEST ← Register(result1);`
**Description:** Подчёт количества ведущих нулевых битов.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `cmpeq / cmpge / cmpgt / cmple / cmplt / cmpne` (все варианты: Register-Register, Branch Register-Register, Register-Immediate, Branch Register-Immediate)
**Semantics:** Выполняют соответствующее сравнение (`==, ≥, >, ≤, <, ≠`) между операндами. Для Register-вариантов результат `0/1` пишется в GPR. Для Branch-вариантов результат пишется в битовый регистр.
**Description:** Целочисленное сравнение (знаковое для `cmpge/gt/le/lt`, беззнаковое для `cmpgeu/gtu/leu/ltu`).
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `divs`
**Semantics:** Реализует один шаг алгоритма деления без восстановления (non-restoring divide stage). Обрабатывает знак делимого и формирует частное/остаток в регистре и бите переноса.
**Description:** Аппаратный шаг итеративного деления.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `goto Immediate`
**Semantics:** `operand1 ← SignExtend23(BTARG) << 2; PC ← Register(ZeroExtend32(BUNDLE_PC) + operand1);`
**Description:** Безусловный переход по смещению.
**Restrictions:** Первая в бандле.
**Exceptions:** Нет.

---

### `goto Link Register` (`goto $r63`)
**Semantics:** `PC ← Register(ZeroExtend32(LR));`
**Description:** Безусловный косвенный переход через Link Register (обычно используется для возврата из функции).
**Restrictions:** Первая в бандле. Latency 2 бандла после записи в `LR`.
**Exceptions:** Нет.

---

### `imml` / `immr`
**Semantics:** `extension ← ZeroExtend23(IMM);`
**Description:** Расширение немедленного значения для соседней операции (`imml` - для левой, `immr` - для правой).
**Restrictions:** Должны кодироваться по чётным адресам слов в бандле.
**Exceptions:** Нет.

---

### `ldb` / `ldbu` (и `.d` версии)
**Semantics:** `ea ← Imm + RSRC1; ReadCheckMemory8(ea); ReadMemory8(ea); result ← Sign/ZeroExtend8(...); RNLIDEST ← Register(result);`
**Description:** Загрузка байта (знаковая `ldb` / беззнаковая `ldbu`). Версии `.d` (dismissible) возвращают 0 при исключении, а не трипают.
**Restrictions:** Нельзя писать в `$r63`. Использует LSU (только 1 LSU-операция на бандл). Latency 2 бандла до результата.
**Exceptions:** `DBREAK`, `CREG_ACCESS_VIOLATION`, `DTLB` (для `.d`: `DBREAK`, `DTLB`)

```mermaid
flowchart TD
  subgraph Restrictions ["VLIW & Latency Restrictions"]
    R1["Destination cannot be $r63 Link Register"]
    R2["Uses LSU: max 1 LSU op per bundle"]
    R3["Latency: 2 bundles before RNLIDEST is valid"]
  end

  Restrictions -.-> Start["ldb / ldbu / ldb.d / ldbu.d"]

  Start --> CalcEA["ea ← ZeroExtend32 Imm ISRC2 + RSRC1"]
  CalcEA --> CheckDBreak{"IsDBreakHit ea?"}
  CheckDBreak -->|Yes| ThrowDBreak["THROW DBREAK"]
  CheckDBreak -->|No| CheckCReg{"IsCRegSpace ea?"}

  CheckCReg -->|Yes & Standard| ThrowCReg["THROW CREG_ACCESS_VIOLATION"]
  CheckCReg -->|Yes & .d Version| RetZeroCReg["result1 ← 0"]
  CheckCReg -->|No & Standard| MemCheckStd["ReadCheckMemory8 ea\nChecks Alignment & TLB"]
  CheckCReg -->|No & .d Version| MemCheckDis["DisReadCheckMemory8 ea\nSkips traps on miss/violation"]

  MemCheckStd -->|Fault| ThrowDTLB["THROW DTLB / MISALIGNED_TRAP"]
  MemCheckStd -->|OK| ReadMemStd["ReadMemory8 ea"]
  MemCheckDis -->|Miss/Violation| RetZeroMiss["result1 ← 0"]
  MemCheckDis -->|OK| ReadMemDis["DisReadMemory8 ea"]

  ReadMemStd --> ExtType{"Instruction Suffix?"}
  ReadMemDis --> ExtType
  RetZeroCReg --> ExtType
  RetZeroMiss --> ExtType

  ExtType -->|ldb / ldb.d| SignExt["result1 ← SignExtend8 ReadMemResponse"]
  ExtType -->|ldbu / ldbu.d| ZeroExt["result1 ← ZeroExtend8 ReadMemResponse"]

  SignExt --> WriteReg
  ZeroExt --> WriteReg
  WriteReg --> End(["Execution Complete"])

  classDef proc fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#000;
  classDef branch fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#000;
  classDef error fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#000;
  classDef success fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#000;
  classDef restrict fill:#f3f4f6,stroke:#4b5563,stroke-width:2px,color:#000,stroke-dasharray: 5 5;

  class CalcEA,MemCheckStd,MemCheckDis,ReadMemStd,ReadMemDis,ExtType,SignExt,ZeroExt,WriteReg,RetZeroCReg,RetZeroMiss proc;
  class CheckDBreak,CheckCReg branch;
  class ThrowDBreak,ThrowCReg,ThrowDTLB error;
  class Start,End success;
  class R1,R2,R3 restrict;
```
---

### `ldh` / `ldhu` (и `.d`)
**Semantics:** Аналогично `ldb`, но 16 бит. Проверяет выравнивание.
**Description:** Загрузка полуслова (знак/без знака).
**Restrictions:** Нельзя `$r63`. 1 LSU на бандл. Latency 2.
**Exceptions:** `DBREAK`, `CREG_ACCESS_VIOLATION`, `DTLB`, `MISALIGNED_TRAP`

---

### `ldw` / `ldw.d`
**Semantics:** `ea ← Imm + RSRC1; ... ReadCheckMemory32(ea); ReadMemory32(ea); RIDEST ← Register(...);`
**Description:** Загрузка 32-битного слова.
**Restrictions:** 1 LSU на бандл. Latency 2. При записи в `$r63` latency 3 для последующего `call/goto $r63`.
**Exceptions:** `DBREAK`, `DTLB`, `MISALIGNED_TRAP`, `CREG_ACCESS_VIOLATION`, `CREG_NO_MAPPING`

---

### `max` / `maxu` / `min` / `minu` (Register/Immediate)
**Semantics:** `IF(operand1 op operand2) result1 ← operand1; ELSE result1 ← operand2; RDEST ← Register(result1);`
**Description:** Выбор максимума или минимума (знаковые `max/min`, беззнаковые `maxu/minu`).
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `mulh` / `mulhh` / `mull` / `mullh` / `mulll` / `mulhu` / `mullhu` / `mullu` (Register/Immediate)
**Semantics:** Различные комбинации знакового/беззнакового умножения слов и полуслов. Например, `mulhh`: `(RSRC1>>16) * (RSRC2>>16)`.
**Description:** Умножение частей слов (upper/lower half-word × full/upper half-word).
**Restrictions:** Нельзя `$r63`. Должны быть на нечётных адресах слов. Latency 2 бандла.
**Exceptions:** Нет.

---

### `mulhhs` / `mulhhu` / `mulhs` / `mullhus`
**Semantics:** Аналогично базовым `mul*`, но возвращают старшие 16/32 бита результата (сдвиги `>>16` или `>>32`).
**Description:** Умножение с возвратом старшей части результата (для фиксированной точки).
**Restrictions:** Нельзя `$r63`. Нечётные адреса. Latency 2.
**Exceptions:** Нет.

---

### `mul32` / `mul64h` / `mul64hu` / `mulfrac` (Register/Immediate)
**Semantics:** `mul32`: `RSRC1 * RSRC2`. `mul64h`: `(RSRC1 * RSRC2) >> 32`. `mulfrac`: Фракционное умножение с обработкой переполнения `-1 * -1`.
**Description:** Полное 32×32 умножение, старшая часть 64-битного результата, дробное DSP-умножение.
**Restrictions:** Нельзя `$r63`. Нечётные адреса. Latency 2.
**Exceptions:** Нет.

```mermaid
flowchart TD
  subgraph Restrictions ["VLIW & Latency Restrictions"]
    R1["Destination cannot be $r63 Link Register"]
    R2["Must be encoded at odd word address in bundle"]
    R3["Uses Multiply Unit"]
    R4["Latency: 2 bundles before result is valid"]
  end

  Restrictions -.-> Start["mul32 / mul64h / mul64hu / mulfrac\nRegister / Immediate"]

  Start --> FetchOps["Fetch Operands RSRC1, RSRC2/ISRC2"]
  FetchOps --> VarCheck{"Variant Type?"}

  VarCheck -->|Register| RegExt["operand1 ← Sign/ZeroExtend32 RSRC1\noperand2 ← Sign/ZeroExtend32 RSRC2"]
  VarCheck -->|Immediate| ImmExt["operand1 ← Sign/ZeroExtend32 RSRC1\noperand2 ← Sign/ZeroExtend32 Imm ISRC2"]

  RegExt --> InstrCheck{"Instruction Mnemonic?"}
  ImmExt --> InstrCheck

  InstrCheck -->|mul32| Op32["result ← operand1 × operand2"]
  InstrCheck -->|mul64h| Op64h["result ← operand1 × operand2 >> 32\nSigned Arithmetic"]
  InstrCheck -->|mul64hu| Op64hu["operand1 ← ZeroExtend32 RSRC1\noperand2 ← ZeroExtend32 RSRC2/Imm\nresult ← operand1 × operand2 >> 32"]
  InstrCheck -->|mulfrac| CheckOverflow{"operand1 == -0x80000000 AND operand2 == -0x80000000?"}

  CheckOverflow -->|Yes| MulfracSat["result ← 0x7FFFFFFF"]
  CheckOverflow -->|No| MulfracNorm["temp ← operand1 × operand2\ntemp ← temp + 1 << 30\nresult ← temp >> 31"]

  Op32 --> WriteReg
  Op64h --> WriteReg
  Op64hu --> WriteReg
  MulfracSat --> WriteReg
  MulfracNorm --> WriteReg

  WriteReg["RDEST / NLDEST ← Register result"] --> End(["Execution Complete"])

  classDef proc fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#000;
  classDef branch fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#000;
  classDef success fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#000;
  classDef restrict fill:#f3f4f6,stroke:#4b5563,stroke-width:2px,color:#000,stroke-dasharray: 5 5;

  class Start,FetchOps,RegExt,ImmExt,Op32,Op64h,Op64hu,CheckOverflow,MulfracSat,MulfracNorm,WriteReg,End proc;
  class VarCheck,InstrCheck branch;
  class R1,R2,R3,R4 restrict;
```
---

### `nandl` / `norl` (все варианты Register/Branch/Immediate)
**Semantics:** `result1 ← NOT((operand1 ≠ 0) AND/OR (operand2 ≠ 0)); ...`
**Description:** Логические NAND и NOR.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `or` / `orc` (Register/Immediate)
**Semantics:** `or`: `operand1 ∨ operand2`. `orc`: `(~operand1) ∨ operand2`.
**Description:** Побитовое ИЛИ и ИЛИ с инверсией первого операнда.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `orl` (все варианты)
**Semantics:** `result1 ← (operand1 ≠ 0) OR (operand2 ≠ 0); ...`
**Description:** Логическое ИЛИ.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `pft`
**Semantics:** `ea ← Imm + RSRC1; PrefetchCheckMemory(ea); PrefetchMemory(ea);`
**Description:** Программный префетч данных в кэш.
**Restrictions:** 1 LSU на бандл. Без latency. Игнорируется при попадании в кэш, uncached областях или нарушении SCU.
**Exceptions:** Нет.

```mermaid
flowchart TD
  subgraph Restrictions ["VLIW & Latency Restrictions"]
    R1["Uses LSU: max 1 LSU op per bundle"]
    R2["No latency constraints"]
    R3["Silently ignored if cache hit, uncached, or invalid"]
  end

  Restrictions -.-> Start["pft ISRC2[RSRC1]"]

  Start --> CalcEA["ea ← ZeroExtend32 SignExtend32 Imm ISRC2 + RSRC1"]
  CalcEA --> CheckMem["PrefetchCheckMemory ea\nValidate TLB, Permissions & SCU"]
  CheckMem -->|Valid & Cacheable| DoPft["PrefetchMemory ea\nHint to prefetch cache"]
  CheckMem -->|Invalid / Uncached / Hit| Ignore["Prefetch silently ignored"]
  DoPft --> End(["Execution Complete"])
  Ignore --> End

  classDef proc fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#000;
  classDef branch fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#000;
  classDef success fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#000;
  classDef restrict fill:#f3f4f6,stroke:#4b5563,stroke-width:2px,color:#000,stroke-dasharray: 5 5;

  class Start,CalcEA,DoPft,Ignore,End proc;
  class CheckMem branch;
  class R1,R2,R3 restrict;
```
---

### `prgadd`
**Semantics:** `ea ← Imm + RSRC1; PurgeAddressCheckMemory(ea); PurgeAddress(ea);`
**Description:** Очистка (purge) конкретной строки данных по адресу из D-cache.
**Restrictions:** 1 LSU на бандл.
**Exceptions:** `DTLB`

---

### `prgins`
**Semantics:** `IF(PSW[USER_MODE]) THROW ILL_INST; PurgeIns();`
**Description:** Полная инвалидация I-cache.
**Restrictions:** Должна быть одна в бандле. Только режим Supervisor.
**Exceptions:** `ILL_INST`

---

### `prginspg`
**Semantics:** `ea ← Imm + RSRC1; IF(PSW[USER_MODE]) THROW ILL_INST; PurgeInsPg(ea);`
**Description:** Очистка 8 КБ страницы I-cache по виртуальному/физическому адресу.
**Restrictions:** 1 LSU на бандл. Только Supervisor.
**Exceptions:** `ILL_INST`

---

### `prgset`
**Semantics:** `ea ← Imm + RSRC1; PurgeSet(ea);`
**Description:** Очистка набора (set) из 4 строк D-cache.
**Restrictions:** 1 LSU на бандл.
**Exceptions:** Нет.

---

### `pswclr` / `pswset`
**Semantics:** `operand2 ← SignExtend32(RSRC2); IF(PSW[USER_MODE]) THROW ILL_INST; PswClr/PswSet(operand2);`
**Description:** Атомарная очистка/установка битов в Program Status Word.
**Restrictions:** Первая в бандле. 1 LSU на бандл. Только Supervisor.
**Exceptions:** `ILL_INST`

---

### `rfi`
**Semantics:** `IF(PSW[USER_MODE]) THROW ILL_INST; PC ← SAVED_PC; PSW ← SAVED_PSW; SAVED_PC ← SAVED_SAVED_PC; SAVED_PSW ← SAVED_SAVED_PSW; Rfi();`
**Description:** Возврат из прерывания/исключения. Восстанавливает PC и PSW из сохранённого контекста.
**Restrictions:** Первая в бандле. 1 LSU. Только Supervisor. Задержка 4 бандла после записи в `SAVED_*`.
**Exceptions:** `ILL_INST`

```mermaid
flowchart TD
  Start(["rfi Instruction"]) --> CheckMode{"PSW[USER_MODE] == 1?"}
  CheckMode -->|Yes User Mode| ThrowExc["THROW ILL_INST"]
  CheckMode -->|No Supervisor Mode| RestorePC["PC <- SAVED_PC"]
  RestorePC --> RestorePSW["PSW <- SAVED_PSW"]
  RestorePSW --> ShiftContext["SAVED_PC <- SAVED_SAVED_PC\nSAVED_PSW <- SAVED_SAVED_PSW"]
  ShiftContext --> RfiProc["Rfi() Procedure\nPipeline & Context Restore"]
  RfiProc --> End(["Resume Execution at New PC"])

  classDef proc fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#000;
  classDef branch fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#000;
  classDef error fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#000;
  classDef success fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#000;

  class CheckMode branch;
  class ThrowExc error;
  class RestorePC,RestorePSW,ShiftContext,RfiProc,End success;

  subgraph LatencyRestrictions ["VLIW & Latency Restrictions"]
    R1["Must be 1st syllable in bundle"]
    R2["Uses LSU (max 1/bundle)"]
    R3["4 bundle latency after writes to SAVED_*/PSW"]
  end
  LatencyRestrictions -.-> RestorePC
```

---

### `sbrk`
**Semantics:** `operand1 ← ZeroExtend21(SBRKNUM); THROW SBREAK;`
**Description:** Программный брейкпоинт с кодом отладки.
**Restrictions:** Без ограничений.
**Exceptions:** `SBREAK`

---

### `sh1add` / `sh2add` / `sh3add` / `sh4add` (Register/Immediate)
**Semantics:** `result1 ← (operand1 << N) + operand2; RDEST ← Register(result1);`
**Description:** Сдвиг влево на N позиций и прибавление второго операнда (оптимизация адресной арифметики).
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `shl` / `shr` / `shru` (Register/Immediate)
**Semantics:** `shl`: Логический сдвиг влево (сдвиг >31 даёт 0). `shr`: Арифметический сдвиг вправо. `shru`: Логический сдвиг вправо.
**Description:** Битовые сдвиги.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `slct` / `slctf` (Register/Immediate)
**Semantics:** `slct`: `IF(BSCOND≠0) result←RSRC1 ELSE result←RSRC2/ISRC2`. `slctf`: Инверсия условия (`BSCOND=0`).
**Description:** Предикативный выбор (conditional select). Избегает ветвления.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `stb` / `sth` / `stw`
**Semantics:** `ea ← Imm + RSRC1; ... WriteCheckMemoryN(ea); WriteMemoryN(ea, RSRC2);`
**Description:** Сохранение байта/полуслова/слова в память.
**Restrictions:** 1 LSU на бандл. Без latency.
**Exceptions:** `DBREAK`, `CREG_ACCESS_VIOLATION`, `DTLB`, `MISALIGNED_TRAP` (для `sth/stw`), `CREG_NO_MAPPING` (для `stw`)

---

### `sub` (Register/Immediate)
**Semantics:** `result1 ← operand2 - operand1; RDEST ← Register(result1);`
**Description:** Вычитание (первый операнд вычитается из второго/immediate).
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `sxtb` / `sxth`
**Semantics:** `operand1 ← SignExtend8/16(RSRC1); RIDEST ← Register(operand1);`
**Description:** Знаковое расширение байта/полуслова до 32 бит.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `sync`
**Semantics:** `Sync();`
**Description:** Синхронизация D-side: ожидание завершения всех load/store/prefetch, очистка write buffer.
**Restrictions:** 1 LSU на бандл.
**Exceptions:** Нет.

---

### `syscall`
**Semantics:** `operand1 ← ZeroExtend21(SBRKNUM); THROW SYSCALL;`
**Description:** Системный вызов (переход в обработчик SYSCALL).
**Restrictions:** Должна быть одна в бандле.
**Exceptions:** `SYSCALL`

---

### `xor` (Register/Immediate)
**Semantics:** `result1 ← operand1 ⊕ operand2; RDEST ← Register(result1);`
**Description:** Побитовое исключающее ИЛИ.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

### `zxth`
**Semantics:** `operand1 ← ZeroExtend16(RSRC1); RIDEST ← Register(operand1);`
**Description:** Беззнаковое расширение полуслова до 32 бит.
**Restrictions:** Без ограничений.
**Exceptions:** Нет.

---

## 📜 Сводная таблица ограничений VLIW-бандлов
| Тип инструкции | Позиция в бандле | Ресурс | Latency до результата | Примечание |
|---|---|---|---|---|
| `br`, `brf`, `call`, `goto` | Только первая (syllable 1) | Branch Unit | Зависит от цели | Прерывают последовательный поток |
| `ld*`, `st*`, `pft`, `sync`, `prg*`, `psw*` | Любая (макс 1 на бандл) | Load/Store Unit (LSU) | `ld`: 2 цикла, `st`: 0 | Конфликт при дублировании LSU |
| `mul*` | Только нечётные адреса слов | Multiply Unit | 2 цикла | Не пишут в `$r63` |
| `imml`/`immr` | Только чётные адреса слов | Decoder | 0 | Связаны с соседней операцией |
| `prgins`, `sbrk`, `syscall` | Только одна в бандле | Special/Control | - | Stop-bit обязателен |

> 💡 **Рекомендация для VLIWGPT:** При генерации бандлов соблюдайте правило `BUNDLE_CHECKING_ON`: не более 1 LSU, не более 1 ветвления, `mul*` на нечётных адресах, уникальные целевые регистры (кроме `$r0`), `$r63` не допускается в `ldh/ldb/mul*`.
