import "package:flutter/material.dart";

import "../models/task_item.dart";
import "agency_dropdown.dart";
import "status_chip.dart";

class TaskCard extends StatelessWidget {
  const TaskCard({
    required this.task,
    required this.onSave,
    super.key,
  });

  final TaskItem task;
  final Future<void> Function(String agency, String status) onSave;

  @override
  Widget build(BuildContext context) {
    // Card widget used in each Kanban column.
    String selectedAgency = task.assignedAgency;
    String selectedStatus = task.status;

    return StatefulBuilder(
      builder: (context, setState) {
        return Card(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(task.title, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 6),
                Text(task.incidentTitle, style: const TextStyle(color: Colors.black54)),
                const SizedBox(height: 8),
                Text(task.details),
                const SizedBox(height: 8),
                StatusChip(status: selectedStatus),
                const SizedBox(height: 8),
                AgencyDropdown(
                  value: selectedAgency,
                  onChanged: (value) => setState(() => selectedAgency = value ?? ""),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: selectedStatus,
                  decoration: const InputDecoration(labelText: "Status", border: OutlineInputBorder()),
                  items: const ["New", "In Progress", "Complete"]
                      .map((item) => DropdownMenuItem<String>(value: item, child: Text(item)))
                      .toList(),
                  onChanged: (value) => setState(() => selectedStatus = value ?? selectedStatus),
                ),
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.centerRight,
                  child: FilledButton(
                    onPressed: () => onSave(selectedAgency, selectedStatus),
                    child: const Text("Update"),
                  ),
                )
              ],
            ),
          ),
        );
      },
    );
  }
}
