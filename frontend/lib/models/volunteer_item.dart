class VolunteerItem {
  final int id;
  final String name;
  final String capabilities;
  final String phone;

  VolunteerItem({
    required this.id,
    required this.name,
    required this.capabilities,
    required this.phone,
  });

  factory VolunteerItem.fromJson(Map<String, dynamic> json) {
    return VolunteerItem(
      id: json["id"] as int,
      name: (json["name"] ?? "") as String,
      capabilities: (json["capabilities"] ?? "") as String,
      phone: (json["phone"] ?? "") as String,
    );
  }
}
