"use client";

import { api } from "~/trpc/react";

export function LatestMeterReading() {
  const [latestPost] = api.meter.getLatest.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <div className="flex flex-col">
          <span>Your most recent meter reading:</span>
          <span>id: {latestPost.id}</span>
          <span>value: {latestPost.value}</span>
          <span>date: {latestPost.readingDate.toISOString()}</span>
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
    </div>
  );
}
