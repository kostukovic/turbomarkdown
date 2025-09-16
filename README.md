# Turbomarkdown

Ein leichtgewichtiges Mini-Framework, das **Markdown in sauberes HTML** rendert – mit **Ein-/Ausklappen**, **Kurz/Lang-Ansichten** und **fokussiertem Lesen**.
Markdown ist schneller zu schreiben und besser lesbar als umfangreiches HTML.

## Problem

PDFs sind auf dem Bildschirm oft **unbequem**: starre Seiten, schlechte Navigation, wenig Interaktivität.
Wer z. B. Full-Stack-Entwickler\:in werden möchte, kommt leicht auf **5.000–20.000+ Seiten** an Lektüre und Doku. Man braucht **prägnante** Ansichten, schnelles **Überfliegen** und **gezieltes Vertiefen** – ohne lange Suche nach relevanten Stellen.

## Lösung

Turbomarkdown wandelt Markdown in **lesefreundliches HTML** und ergänzt:

* **Ausklappbare Abschnitte** (Details/Summary)
* Umschalter für **Kurz/Lang** (oder *Leichte Sprache*/Überblick)
* **Responsiv für alle Geräte** – von Mobile bis Desktop
* **Dark-/Light-Mode** umschaltbar

## KI-generiertes Markdown

Man kann die KI bitten, ein praxisorientiertes, prägnantes, projektbezogenes Handbuch zu erstellen – jeweils in Kurz- und Langfassung, inklusive Tipps zur Fehlervermeidung. So erhält man schnell nutzbare Inhalte, ohne zwingend zusätzliche Fachbücher kaufen zu müssen. Bei Unklarheiten: Codeabschnitt kopieren und der KI zur Erklärung geben.

Mein Quick-Demo als Beispiel (ohne Installation): [https://xprototyp.de/company](https://xprototyp.de/company)

> **Tipp**: Relevante Kapitel (z. B. das Inhaltsverzeichnis) an die KI geben → kurze, praxisnahe Zusammenfassung + „nicht empfohlen“-Liste für mein Projekt.

## Features

* **Fold/Unfold** für Abschnitte, Code und Beispiele
* **Mehrere Fassungen** pro Text: *Kurz*, *Lang*, *Leicht*
* **Kein Vendor-Lock-in**: Standard-Markdown + Progressive Enhancement
* **Zugänglichkeit**: `:focus-visible`, ausreichender Kontrast, klare Labels
* **Null Build-Friction**: Drop-in nutzbar, keine schweren Toolchains
* **Ohne Build-Zwang**: Markdown kann auch serverseitig gerendert werden – Turbomarkdown übernimmt die **Interaktionsebene**
* **Portabel**: setzt auf **Standards** (Details/Summary, ARIA, logische Properties)

## Nächste Schritte (Roadmap)

* **Reines Frontend** (HTML/CSS/JS), offline nutzbar
* **Bilder & Medien:** unterstützt Markdown-Bilder (PNG/JPG/GIF/SVG), responsive Darstellung, optional Lazy-Loading
* **Schnelles Scannen**: kollabierbare Listen, Callouts, Anker-Links
* **Volltextsuche** (clientseitig)
* **PWA-Support** (Service Worker, Offline-Cache, Installierbarkeit)
* **Verbessertes Rendering-Framework**: Batching/Mehrfachabrufe, Caching, bessere Performance bei großen Dokumenten
* **TOC-Generator & Permalinks** für Überschriften
* **Persistente Zustände** (offen/zu) via `localStorage`
* **Theme-API** (eigene Farbpaletten, Typografie-Presets)
* **PDF-Export** Als PDF speichern

