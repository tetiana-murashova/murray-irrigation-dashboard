import React, { useEffect, useMemo, useState } from "react";
import { TimeSeriesChart } from "./components/TimeSeriesChart.js";

type Point = { ts: string; value: number; q: "good" | "uncertain" | "bad" };
type Tag = { id: string; label: string; unit?: string; points: Point[] };
type Asset = { id: string; name: string; type?: string; tags: Tag[] };
type Site = { id: string; name: string; assets: Asset[] };
type DataJson = { sites: Site[] };

const App = (): JSX.Element => {
  const [data, setData] = useState<DataJson | null>(null);
  const [selectedSite, setSelectedSite] = useState<number>(0);
  const [selectedAsset, setSelectedAsset] = useState<number>(0);
  const [selectedTag, setSelectedTag] = useState<number>(0);

  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then((j: DataJson) => setData(j))
      .catch(console.error);
  }, []);

  const sites = data?.sites ?? [];
  const assets = sites[selectedSite]?.assets ?? [];
  const tags = assets[selectedAsset]?.tags ?? [];
  const selectedTagObj = tags[selectedTag];

  const chartData = useMemo(() => {
    if (!selectedTagObj) return null;

    const allPoints = selectedTagObj.points.map((point) => ({
      x: new Date(point.ts),
      y: point.value,
      q: point.q,
    }));

    const good = allPoints.filter((pt) => pt.q === "good");
    const uncertain = allPoints.filter((pt) => pt.q === "uncertain");
    const bad = allPoints.filter((pt) => pt.q === "bad");

    return {
      datasets: [
        {
          label: `${selectedTagObj.label} — good`,
          data: good,
          borderColor: "rgba(26, 189, 108, 0.9)",
          backgroundColor: "rgba(26, 189, 108, 0.9)",
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: `${selectedTagObj.label} — uncertain`,
          data: uncertain,
          borderColor: "rgba(229, 174, 24, 0.9)",
          backgroundColor: "rgba(229, 174, 24, 0.9)",
          borderWidth: 2,
          pointRadius: 3,
        },
        {
          label: `${selectedTagObj.label} — bad`,
          data: bad,
          borderColor: "rgba(239,68,68,0.9)",
          backgroundColor: "rgba(239,68,68,0.9)",
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    };
  }, [selectedTagObj]);

  const options = useMemo(
    () => ({
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time" as const,
          time: {
            displayFormats: {
              minute: "MMM d, HH:mm",
              hour: "MMM d, HH:mm",
              day: "MMM d, HH:mm",
            },
            tooltipFormat: "PPpp",
          },
          ticks: {
            source: "auto" as const,
            autoSkip: true,
            maxRotation: 0,
          },
        },
        y: { beginAtZero: false },
      },
    }),
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">
            Murray Irrigation — Time Series Dashboard
          </h1>
        </header>

        <main className="flex flex-col gap-4 ">
          <aside className="bg-white p-4 rounded shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Site Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Site</label>
                <select
                  className="border rounded p-1"
                  value={selectedSite}
                  onChange={(e) => {
                    const newSiteIndex = Number(e.target.value);
                    setSelectedSite(newSiteIndex);
                    setSelectedAsset(0);
                    setSelectedTag(0);
                  }}
                >
                  {sites.map((s, i) => (
                    <option key={s.id ?? i} value={i}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Asset Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Asset</label>
                <select
                  className="border rounded p-1"
                  value={selectedAsset}
                  onChange={(e) => {
                    const newAssetIndex = Number(e.target.value);
                    setSelectedAsset(newAssetIndex);
                    setSelectedTag(0);
                  }}
                >
                  {assets.map((a, i) => (
                    <option key={a.id ?? i} value={i}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Tag</label>
                <select
                  className="border rounded p-1"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(Number(e.target.value))}
                >
                  {tags.map((t, i) => (
                    <option key={t.id ?? i} value={i}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <section className="md:col-span-3 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium mb-2">
              {selectedTagObj ? selectedTagObj.label : "Select a tag"}
            </h3>
            <TimeSeriesChart chartData={chartData} options={options} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
