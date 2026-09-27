export const changeDetections = [
  {
    id: "change-001",
    siteId: "site-001",
    beforeDate: "Jan 2024",
    afterDate: "Jan 2026",
    changeCount: 3,
    changes: [
      {
        type: "Construction",
        confidence: 91,
        area: "1.2 hectares",
      },
      {
        type: "Road Development",
        confidence: 84,
        area: "0.6 hectares",
      },
      {
        type: "Water Variation",
        confidence: 78,
        area: "0.9 hectares",
      },
    ],
    falseAlarmRisk: "medium",
    falseAlarmReason: "Partial cloud coverage detected in the after image.",
    alignmentError: 2.3,
  },
];