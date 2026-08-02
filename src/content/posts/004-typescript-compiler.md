---
title:
  "From Design to API: Understanding and working with the TypeScript compiler"
description:
  "Hinter einem Compiler steckt mehr als reines Übersetzen von A nach B. Eine
  Handreichung, um die Arbeit mit dem TypeScript-Compiler und seiner API zu
  bewältigen."
published: 2022-05-31
category: Elsewhere
lang: de
source: "heise Developer"
externalUrl: "https://www.heise.de/hintergrund/Von-Design-bis-API-TypeScripts-Compiler-verstehen-und-mit-ihm-arbeiten-7121785.html"
tags:
  - elsewhere
---

> Originally published at
> [heise Developer](https://www.heise.de/hintergrund/Von-Design-bis-API-TypeScripts-Compiler-verstehen-und-mit-ihm-arbeiten-7121785.html)
> in German.

Wer nicht regelmäßig mit Low-Level-Sprachen wie C++ programmiert, hat selten
Kontakt mit den inneren Mechanismen eines Compilers. Auch der Besuch einer
Hochschulvorlesung zum Thema Compilerbau entfacht selten Leidenschaft für diesen
Teilbereich der Informatik. Doch stark abstrahierte Sprachen wie TypeScript
bieten die Chance, dieses Bild zu revidieren: Mit der API des
TypeScript-Compilers tsc lassen sich dessen interne Schritte nachvollziehen und
sogar eigene Sprachfeatures implementieren, ohne in die Untiefen breitenloser
Leerzeichen und anderer Parsing-Gemeinheiten abzutauchen.

Der TypeScript-Compiler ist einer der wenigen, die eine öffentliche und gut
dokumentierte Schnittstelle haben. Zwar lassen auch andere Compiler – wie der
Java-Compiler – die Ausführung des Kompiliervorgangs per API zu. Doch viele der
internen Methoden sind entweder privat und damit nicht aufrufbar oder nicht
dokumentiert. Dagegen ist der Quellcode des TypeScript-Compilers ausreichend
beschrieben.

[Continue reading at heise Developer](https://www.heise.de/hintergrund/Von-Design-bis-API-TypeScripts-Compiler-verstehen-und-mit-ihm-arbeiten-7121785.html).
