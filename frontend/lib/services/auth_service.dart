import "dart:convert";

import "package:http/http.dart" as http;

class AuthService {
  String? _token;
  static const String _baseUrl = "http://localhost:4000";

  String? get token => _token;

  Future<bool> login(String email, String password) async {
    // Authenticates against backend and stores JWT in memory.
    final response = await http.post(
      Uri.parse("$_baseUrl/auth/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "password": password}),
    );

    if (response.statusCode != 200) return false;
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    _token = data["token"] as String?;
    return _token != null;
  }
}
