class TaskItem {
  final int id;
  final int incidentId;
  final String title;
  final String details;
  final String assignedAgency;
  final String status;
  final String incidentTitle;

  TaskItem({
    required this.id,
    required this.incidentId,
    required this.title,
    required this.details,
    required this.assignedAgency,
    required this.status,
    required this.incidentTitle,
  });

  factory TaskItem.fromJson(Map<String, dynamic> json) {
    return TaskItem(
      id: json["id"] as int,
      incidentId: json["incident_id"] as int,
      title: (json["title"] ?? "") as String,
      details: (json["details"] ?? "") as String,
      assignedAgency: (json["assigned_agency"] ?? "") as String,
      status: (json["status"] ?? "New") as String,
      incidentTitle: (json["incident_title"] ?? "") as String,
    );
  }
}
