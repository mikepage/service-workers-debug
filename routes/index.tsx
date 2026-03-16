import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import ServiceWorkerList from "../islands/ServiceWorkerList.tsx";

export default define.page(function Home() {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen bg-gray-50">
      <Head>
        <title>Service Workers Debug</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center">
        <h1 class="text-4xl font-bold mb-8">Service Workers Debug</h1>
        <ServiceWorkerList />
      </div>
    </div>
  );
});
