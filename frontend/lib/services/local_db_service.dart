import "dart:convert";

import "package:path/path.dart";
import "package:sqflite/sqflite.dart";

import "../models/offline_queue_item.dart";

class LocalDbService {
  Database? _db;

  Future<Database> get database async {
    if (_db != null) return _db!;
    _db = await _openDb();
    return _db!;
  }

  Future<Database> _openDb() async {
    // Creates local tables for offline queue and cached entities.
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, "sdrf_mobile.db");

    return openDatabase(
      path,
      version: 1,
      onCreate: (db, _version) async {
        await db.execute(
          "CREATE TABLE OfflineQueue(id INTEGER PRIMARY KEY AUTOINCREMENT, entity_type TEXT, entity_id TEXT, operation TEXT, payload_json TEXT, created_at TEXT)"
        );
        await db.execute(
          "CREATE TABLE Volunteers(id INTEGER PRIMARY KEY, name TEXT, phone TEXT, capabilities TEXT, lat REAL, lng REAL)"
        );
        await db.execute(
          "CREATE TABLE Resources(id INTEGER PRIMARY KEY, name TEXT, category TEXT, quantity INTEGER, status TEXT)"
        );
        await db.execute(
          "CREATE TABLE Incidents(id INTEGER PRIMARY KEY, title TEXT, disaster_type TEXT, verification_state TEXT, status TEXT)"
        );
      },
    );
  }

  Future<void> enqueue(OfflineQueueItem item) async {
    final db = await database;
    await db.insert("OfflineQueue", {
      "entity_type": item.entityType,
      "entity_id": item.entityId,
      "operation": item.operation,
      "payload_json": jsonEncode(item.payload),
      "created_at": DateTime.now().toIso8601String(),
    });
  }

  Future<List<OfflineQueueItem>> readQueue() async {
    final db = await database;
    final rows = await db.query("OfflineQueue", orderBy: "id ASC");
    return rows.map((row) {
      return OfflineQueueItem(
        entityType: (row["entity_type"] ?? "") as String,
        entityId: row["entity_id"] as String?,
        operation: (row["operation"] ?? "") as String,
        payload: jsonDecode((row["payload_json"] ?? "{}") as String) as Map<String, dynamic>,
      );
    }).toList();
  }

  Future<void> clearQueue() async {
    final db = await database;
    await db.delete("OfflineQueue");
  }
}
