import app from './app.js';
import { config } from './config/config.js';
import { startWorker } from './worker.js';
import { dispatchPendingNotifications } from './services/notificationDispatch.js';

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Free-tier friendly mode: run the notification worker and the dispatch
// scheduler in this same process instead of requiring a separate paid
// background-worker service and an external cron job. Enable with
// RUN_WORKER_INPROCESS=true.
//
// Note: this only fires while the process is actually running. Render's
// free web services spin down after ~15 minutes of no HTTP traffic, which
// pauses this too — pair it with a free uptime pinger (e.g. UptimeRobot or
// cron-job.org hitting GET / every 10 minutes) to keep the service awake.
if (config.runWorkerInProcess) {
  startWorker();

  const DISPATCH_INTERVAL_MS = 60 * 1000; // every minute, same as the old Render cron
  setInterval(() => {
    dispatchPendingNotifications().catch((error) => {
      console.error('Failed to dispatch pending notifications:', error);
    });
  }, DISPATCH_INTERVAL_MS);

  console.log('Running notification worker + dispatch scheduler in-process.');
}
