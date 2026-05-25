import "dart:convert";

import "package:http/http.dart" as http;

import "../models/incident_item.dart";
import "../models/task_item.dart";
import "../models/volunteer_item.dart";

class ApiService {
  ApiService(this._token);

  final String _token;
  static const String _baseUrl = "http://localhost:4000";

  Map<String, String> get _headers => {
        "Content-Type": "application/json",
        "Authorization": "Bearer $_token",
      };

  Future<List<TaskItem>> fetchTasks() async {
    // Pulls task board cards from backend.
    final response = await http.get(Uri.parse("$_baseUrl/tasks"), headers: _headers);
    if (response.statusCode != 200) return [];
    final list = jsonDecode(response.body) as List<dynamic>;
    return list.map((item) => TaskItem.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> updateTask(int taskId, String agency, String status) async {
    await http.patch(
      Uri.parse("$_baseUrl/tasks/$taskId"),
      headers: _headers,
      body: jsonEncode({"assignedAgency": agency, "status": status}),
    );
  }

  Future<List<IncidentItem>> fetchIncidents({bool onlyVerified = false}) async {
    final response = await http.get(
      Uri.parse("$_baseUrl/verify/incidents?onlyVerified=$onlyVerified"),
      headers: _headers,
    );
    if (response.statusCode != 200) return [];
    final list = jsonDecode(response.body) as List<dynamic>;
    return list.map((item) => IncidentItem.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> verifyIncident(int incidentId) async {
    await http.post(Uri.parse("$_baseUrl/verify/$incidentId"), headers: _headers);
  }

  Future<List<VolunteerItem>> fetchVolunteers() async {
    final response = await http.get(Uri.parse("$_baseUrl/volunteers"), headers: _headers);
    if (response.statusCode != 200) return [];
    final list = jsonDecode(response.body) as List<dynamic>;
    return list.map((item) => VolunteerItem.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<Map<String, dynamic>> sendAlert({
    required String disasterType,
    required double lat,
    required double lng,
    double radiusKm = 10,
  }) async {
    final response = await http.post(
      Uri.parse("$_baseUrl/alerts"),
      headers: _headers,
      body: jsonEncode({
        "disasterType": disasterType,
        "lat": lat,
        "lng": lng,
        "radiusKm": radiusKm,
      }),
    );
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<List<dynamic>> fetchAlertPins() async {
    final response = await http.get(Uri.parse("$_baseUrl/alerts"), headers: _headers);
    if (response.statusCode != 200) return [];
    return jsonDecode(response.body) as List<dynamic>;
  }

  Future<List<dynamic>> fetchWatchdogStatus() async {
    final response = await http.get(Uri.parse("$_baseUrl/ping/status"), headers: _headers);
    if (response.statusCode != 200) return [];
    return jsonDecode(response.body) as List<dynamic>;
  }

  Future<void> heartbeat(String agency) async {
    await http.post(
      Uri.parse("$_baseUrl/ping"),
      headers: _headers,
      body: jsonEncode({"agency": agency, "source": "flutter-app"}),
    );
  }

  Future<List<dynamic>> fetchBulletins() async {
    final response = await http.get(Uri.parse("$_baseUrl/bulletins"), headers: _headers);
    if (response.statusCode != 200) return [];
    return jsonDecode(response.body) as List<dynamic>;
  }
}
