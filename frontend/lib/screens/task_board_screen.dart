import "package:flutter/material.dart";

import "../models/task_item.dart";
import "../services/api_service.dart";

class TaskBoardScreen extends StatefulWidget {
  const TaskBoardScreen({required this.token, super.key});

  final String token;

  @override
  State<TaskBoardScreen> createState() => _TaskBoardScreenState();
}

class _TaskBoardScreenState extends State<TaskBoardScreen> {
  late final ApiService _api;

  List<TaskItem> _tasks = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _api = ApiService(widget.token);
    _loadData();
  }

  Future<void> _loadData() async {
    // Loads minimal task list placeholder from backend.
    final tasks = await _api.fetchTasks();
    if (!mounted) return;
    setState(() {
      _tasks = tasks;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        itemCount: _tasks.length,
        itemBuilder: (context, index) {
          final task = _tasks[index];
          return ListTile(
            leading: const Icon(Icons.assignment),
            title: Text(task.title),
            subtitle: Text("${task.incidentTitle} • ${task.assignedAgency} • ${task.status}"),
          );
        },
      ),
    );
  }
}
