import "package:flutter/material.dart";

import "../models/incident_item.dart";
import "../services/api_service.dart";

class IncidentsScreen extends StatefulWidget {
  const IncidentsScreen({required this.token, super.key});

  final String token;

  @override
  State<IncidentsScreen> createState() => _IncidentsScreenState();
}

class _IncidentsScreenState extends State<IncidentsScreen> {
  late final ApiService _api;
  bool _onlyVerified = true;
  List<IncidentItem> _incidents = [];

  @override
  void initState() {
    super.initState();
    _api = ApiService(widget.token);
    _load();
  }

  Future<void> _load() async {
    // Loads incidents with optional dual-verification filtering.
    final list = await _api.fetchIncidents(onlyVerified: _onlyVerified);
    if (!mounted) return;
    setState(() => _incidents = list);
  }

  Future<void> _verify(int incidentId) async {
    await _api.verifyIncident(incidentId);
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          Row(
            children: [
              FilterChip(
                selected: _onlyVerified,
                onSelected: (value) {
                  setState(() => _onlyVerified = value);
                  _load();
                },
                label: const Text("Only Verified"),
              ),
              const SizedBox(width: 10),
              OutlinedButton(onPressed: _load, child: const Text("Refresh")),
            ],
          ),
          const SizedBox(height: 10),
          Expanded(
            child: ListView.builder(
              itemCount: _incidents.length,
              itemBuilder: (context, index) {
                final incident = _incidents[index];
                final unverified = incident.verificationState == "Unverified";
                return Card(
                  child: ListTile(
                    title: Text(incident.title),
                    subtitle: Text("${incident.disasterType} • ${incident.status} • ${incident.verificationState}"),
                    trailing: unverified
                        ? FilledButton(
                            onPressed: () => _verify(incident.id),
                            child: const Text("Verify"),
                          )
                        : const Icon(Icons.verified, color: Colors.green),
                  ),
                );
              },
            ),
          )
        ],
      ),
    );
  }
}
