import "package:flutter/material.dart";

class StatusChip extends StatelessWidget {
  const StatusChip({required this.status, super.key});

  final String status;

  @override
  Widget build(BuildContext context) {
    // Visual status pill for task progression.
    Color color;
    switch (status) {
      case "Complete":
        color = Colors.green;
        break;
      case "In Progress":
        color = Colors.orange;
        break;
      default:
        color = Colors.blueGrey;
    }

    return Chip(
      label: Text(status),
      backgroundColor: color.withOpacity(0.15),
      side: BorderSide(color: color),
      labelStyle: TextStyle(color: color, fontWeight: FontWeight.w600),
    );
  }
}
