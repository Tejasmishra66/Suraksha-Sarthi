import "dart:convert";

import "package:flutter/services.dart";

class OfflineTrainingService {
  Future<List<Map<String, dynamic>>> loadKits() async {
    // Loads pre-cached training kit index from assets.
    final raw = await rootBundle.loadString("assets/training_kits/kit_index.json");
    final data = jsonDecode(raw) as Map<String, dynamic>;
    final kits = data["kits"] as List<dynamic>? ?? [];
    return kits.map((item) => (item as Map<String, dynamic>)).toList();
  }
}
