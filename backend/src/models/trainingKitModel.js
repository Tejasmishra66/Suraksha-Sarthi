function listTrainingKits() {
  // Returns static manifest of offline training kits for the app cache.
  return [
    {
      id: "flood-basics",
      title: "Flood Response Basics",
      version: "1.0",
      downloadPath: "/resources/training-kits/flood_response_basics.pdf"
    },
    {
      id: "sar-safe",
      title: "Search and Rescue Safety",
      version: "1.0",
      downloadPath: "/resources/training-kits/sar_safety_checklist.pdf"
    }
  ];
}

module.exports = {
  listTrainingKits
};
