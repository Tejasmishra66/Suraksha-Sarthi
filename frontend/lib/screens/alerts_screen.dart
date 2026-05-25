import "package:flutter/material.dart";

import "../services/api_service.dart";

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({required this.token, super.key});

  final String token;

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  late final ApiService _api;
  List<dynamic> _pins = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _api = ApiService(widget.token);
    _loadPins();
  }

  Future<void> _loadPins() async {
    // Fetches alert pins as a map-data placeholder.
    final pins = await _api.fetchAlertPins();
    if (!mounted) return;
    setState(() {
      _pins = pins;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _loadPins,
      child: ListView.builder(
        itemCount: _pins.length,
        itemBuilder: (context, index) {
          final pin = _pins[index] as Map<String, dynamic>;
          return ListTile(
            leading: const Icon(Icons.location_on),
            title: Text("${pin["disaster_type"]} • ${pin["severity"]}"),
            subtitle: Text("Lat: ${pin["lat"]}, Lng: ${pin["lng"]}"),
          );
        },
      ),
    );
  }
}
