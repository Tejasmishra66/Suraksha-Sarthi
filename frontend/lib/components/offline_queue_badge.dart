import "package:flutter/material.dart";

class OfflineQueueBadge extends StatelessWidget {
  const OfflineQueueBadge({required this.count, super.key});

  final int count;

  @override
  Widget build(BuildContext context) {
    // Shows count of locally queued offline operations.
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: count > 0 ? Colors.orange.shade100 : Colors.green.shade100,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        count > 0 ? "Offline Queue: $count" : "Queue Synced",
        style: const TextStyle(fontWeight: FontWeight.w600),
      ),
    );
  }
}
