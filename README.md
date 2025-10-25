# 📊 Murray Irrigation Dashboard

A lightweight React + TypeScript dashboard for visualizing time-series data with interactive zooming and panning.  
Built with **Vite**, **Chart.js**, **TailwindCSS**, and **date-fns**.

---

## 🚀 Features

- Interactive time-series charts using Chart.js
- Zoom & pan support via chartjs-plugin-zoom
- Time-based x-axis powered by chartjs-adapter-date-fns

---

## 🧩 Tech Stack

| Category        | Technology                                               |
| --------------- | -------------------------------------------------------- |
| Framework       | React 18 + TypeScript                                    |
| Charts          | Chart.js, chartjs-plugin-zoom, chartjs-plugin-annotation |
| Date Adapter    | chartjs-adapter-date-fns                                 |
| Styling         | TailwindCSS                                              |
| Build Tool      | Vite                                                     |
| Code Quality    | Prettier                                                 |
| Package Manager | npm                                                      |

---

## 🛠️ Setup

### 1️⃣ Install dependencies

```bash
make install
```

### 2️⃣ Start development server

```bash
make dev
```

### 3️⃣ Build for production

```bash
make build
```

### 4️⃣ Preview production build

```bash
make preview
```

---

## 💡 Tips

- Use `as const` for Chart.js scale types (`type: 'time' as const`)
- For better date formatting, ensure you register `'chartjs-adapter-date-fns'`
- Zoom and pan modes must be `'x' | 'y' | 'xy'`
- Prettier auto-formats on `Cmd + S` (if configured)
- Use Tailwind for layout and responsive sizing (`w-full`, `h-[400px]`, etc.)
