import "package:flutter/material.dart";

import "../models/volunteer_item.dart";
import "../services/api_service.dart";
import "../services/offline_training_service.dart";

class VolunteersScreen extends StatefulWidget {
  const VolunteersScreen({required this.token, super.key});

  final String token;

  @override
  State<VolunteersScreen> createState() => _VolunteersScreenState();
}

class _VolunteersScreenState extends State<VolunteersScreen> {
  late final ApiService _api;
  final _trainingService = OfflineTrainingService();

  List<VolunteerItem> _volunteers = [];
  List<Map<String, dynamic>> _kits = [];

  @override
  void initState() {
    super.initState();
    _api = ApiService(widget.token);
    _load();
  }

  Future<void> _load() async {
    // Loads volunteer roster and offline training kit references.
    final volunteers = await _api.fetchVolunteers();
    final kits = await _trainingService.loadKits();
    if (!mounted) return;
    setState(() {
      _volunteers = volunteers;
      _kits = kits;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        Text("Volunteer Capability Registry", style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        ..._volunteers.map(
          (volunteer) => Card(
            child: ListTile(
              title: Text(volunteer.name),
              subtitle: Text("${volunteer.capabilities} • ${volunteer.phone}"),
              trailing: const Icon(Icons.badge),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text("Pre-cached Offline Training Kits", style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        ..._kits.map(
          (kit) => ListTile(
            leading: const Icon(Icons.menu_book),
            title: Text((kit["title"] ?? "") as String),
            subtitle: Text((kit["localPath"] ?? "") as String),
          ),
        ),
      ],
    );
  }
}
