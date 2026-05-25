class IncidentItem {
  final int id;
  final String title;
  final String disasterType;
  final String verificationState;
  final String status;

  IncidentItem({
    required this.id,
    required this.title,
    required this.disasterType,
    required this.verificationState,
    required this.status,
  });

  factory IncidentItem.fromJson(Map<String, dynamic> json) {
    return IncidentItem(
      id: json["id"] as int,
      title: (json["title"] ?? "") as String,
      disasterType: (json["disaster_type"] ?? "") as String,
      verificationState: (json["verification_state"] ?? "Unverified") as String,
      status: (json["status"] ?? "New") as String,
    );
  }
}
