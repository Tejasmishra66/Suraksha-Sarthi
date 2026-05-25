import "dart:convert";

import "package:http/http.dart" as http;

import "../models/offline_queue_item.dart";
import "local_db_service.dart";

class SyncService {
  SyncService(this._token, this._localDb);

  final String _token;
  final LocalDbService _localDb;
  static const String _baseUrl = "http://localhost:4000";

  Future<int> syncOfflineQueue() async {
    // Pushes queued local operations to backend and clears local queue.
    final queue = await _localDb.readQueue();
    if (queue.isEmpty) return 0;

    final payload = {
      "items": queue.map((OfflineQueueItem item) => item.toJson()).toList(),
    };

    final response = await http.post(
      Uri.parse("$_baseUrl/sync/queue"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $_token",
      },
      body: jsonEncode(payload),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      await http.post(
        Uri.parse("$_baseUrl/sync/flush"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $_token",
        },
      );
      await _localDb.clearQueue();
      return queue.length;
    }

    return 0;
  }
}
