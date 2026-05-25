import "package:flutter/material.dart";

import "../services/api_service.dart";

class BulletinsScreen extends StatefulWidget {
  const BulletinsScreen({required this.token, super.key});

  final String token;

  @override
  State<BulletinsScreen> createState() => _BulletinsScreenState();
}

class _BulletinsScreenState extends State<BulletinsScreen> {
  late final ApiService _api;
  List<dynamic> _items = [];
  List<dynamic> _watchdog = [];

  @override
  void initState() {
    super.initState();
    _api = ApiService(widget.token);
    _load();
  }

  Future<void> _load() async {
    // Pulls macro updates and watchdog online/offline status.
    final bulletins = await _api.fetchBulletins();
    final watchdog = await _api.fetchWatchdogStatus();
    if (!mounted) return;
    setState(() {
      _items = bulletins;
      _watchdog = watchdog;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        Text("Macro-Updates Bulletin", style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        ..._items.map(
          (item) => Card(
            child: ListTile(
              title: Text((item["title"] ?? "") as String),
              subtitle: Text("${item["category"]} • ${(item["body"] ?? "") as String}"),
              trailing: (item["pinned"] == 1) ? const Icon(Icons.push_pin) : null,
            ),
          ),
        ),
        const Divider(height: 24),
        Text("System Watchdog Status", style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        ..._watchdog.map(
          (item) => ListTile(
            leading: Icon(
              (item["status"] == "online") ? Icons.wifi : Icons.wifi_off,
              color: (item["status"] == "online") ? Colors.green : Colors.red,
            ),
            title: Text((item["agency"] ?? "") as String),
            subtitle: Text("Last heartbeat: ${(item["lastHeartbeatAt"] ?? "N/A") as String}"),
          ),
        ),
      ],
    );
  }
}
