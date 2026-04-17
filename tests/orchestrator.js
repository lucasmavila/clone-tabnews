import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    await retry(fetchStatusPage, {
      retries: 10,
      maxTimeout: 2000,
      onRetry: (error, attempt) =>
        console.log(`${attempt} - Status Page Error: ${error.message}`),
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error("HTTP error " + response.status);
      }
      await response.json();
    }
  }
}
export default { waitForAllServices };
