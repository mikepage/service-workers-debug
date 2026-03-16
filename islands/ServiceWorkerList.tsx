import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface ServiceWorkerInfo {
  scope: string;
  scriptURL: string;
  state: string;
}

export default function ServiceWorkerList() {
  const workers = useSignal<ServiceWorkerInfo[]>([]);
  const error = useSignal<string | null>(null);
  const loading = useSignal(true);

  async function fetchWorkers() {
    loading.value = true;
    error.value = null;

    if (!("serviceWorker" in navigator)) {
      error.value = "Service Workers are not supported in this browser.";
      loading.value = false;
      return;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      workers.value = registrations.map((reg) => {
        const sw = reg.active || reg.waiting || reg.installing;
        return {
          scope: reg.scope,
          scriptURL: sw?.scriptURL ?? "unknown",
          state: sw?.state ?? "no worker",
        };
      });
    } catch (e) {
      error.value = `Failed to get registrations: ${e}`;
    } finally {
      loading.value = false;
    }
  }

  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div class="w-full max-w-2xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Registered Service Workers</h2>
        <button
          onClick={fetchWorkers}
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>

      {loading.value && <p class="text-gray-500">Loading...</p>}

      {error.value && (
        <p class="text-red-600 bg-red-50 p-3 rounded">{error.value}</p>
      )}

      {!loading.value && !error.value && workers.value.length === 0 && (
        <p class="text-gray-500 bg-gray-50 p-4 rounded">
          No service workers registered for this origin.
        </p>
      )}

      {workers.value.length > 0 && (
        <div class="space-y-4">
          {workers.value.map((sw, i) => (
            <div key={i} class="border rounded-lg p-4 bg-white shadow-sm">
              <div class="mb-2">
                <span class="text-xs font-semibold uppercase text-gray-400">
                  Scope
                </span>
                <p class="font-mono text-sm break-all">{sw.scope}</p>
              </div>
              <div class="mb-2">
                <span class="text-xs font-semibold uppercase text-gray-400">
                  Script
                </span>
                <p class="font-mono text-sm break-all">{sw.scriptURL}</p>
              </div>
              <div>
                <span class="text-xs font-semibold uppercase text-gray-400">
                  State
                </span>
                <span
                  class={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                    sw.state === "activated"
                      ? "bg-green-100 text-green-800"
                      : sw.state === "installed"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {sw.state}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
