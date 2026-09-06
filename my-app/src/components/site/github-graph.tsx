"use client";

import { GitHubCalendar } from "react-github-calendar";

export function GithubGraph() {
  return (
    <div className="font-mono text-xs text-muted-foreground">
      <GitHubCalendar
        username="Chriss0309"
        colorScheme="light"
        theme={{ light: ["#ece6da", "#d5c7ae", "#b3a184", "#8f7c62", "#6c5e4e"] }}
        blockSize={9}
        blockMargin={2}
        blockRadius={2}
        fontSize={12}
        showColorLegend={false}
        showMonthLabels={false}
        labels={{ totalCount: "{{count}} contributions on GitHub in the last year" }}
        errorMessage="GitHub activity is unavailable right now."
      />
    </div>
  );
}
