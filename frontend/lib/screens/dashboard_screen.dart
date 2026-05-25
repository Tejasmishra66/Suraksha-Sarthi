import "package:flutter/material.dart";

import "alerts_screen.dart";
import "task_board_screen.dart";

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({required this.token, super.key});

  final String token;

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      TaskBoardScreen(token: widget.token),
      AlertsScreen(token: widget.token)
    ];

    return Scaffold(
      appBar: AppBar(title: const Text("SDRF Helping Hands Dashboard")),
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.checklist), label: "Task List"),
          NavigationDestination(icon: Icon(Icons.map), label: "Incident Map"),
        ],
      ),
    );
  }
}
